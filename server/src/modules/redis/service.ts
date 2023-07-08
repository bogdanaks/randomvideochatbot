import { Redis } from "ioredis"

import { UserEntity } from "../user"
import { appConfig } from "@/config"
import { Country } from "@/common/types"

export class RedisService {
  protected pubClient
  protected subClient

  constructor() {
    this.pubClient = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
    this.subClient = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
  }

  async getUserById(userId: string) {
    const userStr = await this.subClient.get(`users:${userId}`)
    return userStr ? (JSON.parse(userStr) as UserEntity) : null
  }

  async saveUser(user: UserEntity) {
    await this.pubClient.set(`users:${user.id}`, JSON.stringify(user), "EX", 3600)
  }

  async getUsersByCountry(country: Country | null) {
    const countryKey = country ? `country:${country.code}` : "country:all"
    return await this.subClient.smembers(`users:${countryKey}`)
  }

  async addUserToWaitList(userId: string, country: Country | null) {
    const countryKey = country ? `country:${country.code}` : "country:all"
    const useKey = `users:${countryKey}`

    await this.pubClient.sadd(useKey, userId)
    await this.pubClient.expire(useKey, 3600)
  }

  async removeUserFromWaitList(userId: string, country: Country | null) {
    const countryKey = country ? `country:${country.code}` : "country:all"
    const useKey = `users:${countryKey}`

    await this.pubClient.srem(useKey, userId)
    await this.pubClient.expire(useKey, 3600)
  }

  async getPrevUsersCall(userId: string) {
    return await this.subClient.smembers(`users:${userId}:call`)
  }

  async setPrevUsersCall(userId: string, prevUserId: string) {
    const usersList = await this.getPrevUsersCall(userId)
    if (usersList.includes(prevUserId)) return

    if (usersList.length >= 5) {
      await this.pubClient.srem(`users:${userId}:call`, usersList[0])
    }

    await this.pubClient.sadd(`users:${userId}:call`, prevUserId)
    await this.pubClient.sadd(`users:${prevUserId}:call`, userId)
    await this.pubClient.expire(`users:${userId}:call`, 3600)
    await this.pubClient.expire(`users:${prevUserId}:call`, 3600)
  }

  async setConnectedUser(userId: string) {
    await this.pubClient.set(`users:${userId}:connected`, "true", "EX", 3600)
  }

  async removeConnectedUser(userId: string) {
    await this.pubClient.del(`users:${userId}:connected`)
  }

  async isConnectedUser(userId: string) {
    return !!(await this.pubClient.get(`users:${userId}:connected`))
  }

  async incrementOnlineUsers() {
    await this.pubClient.incr("users:online")
  }

  async decrementOnlineUsers() {
    await this.pubClient.decr("users:online")
  }

  async getOnlineUsers() {
    return await this.pubClient.get("users:online")
  }
}
