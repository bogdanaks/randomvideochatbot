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

  async getRandomUserByCountry(country: Country | null) {
    const countryKey = country ? `country:${country.code}` : "country:all"
    const user = await this.subClient.spop(`users:${countryKey}`)
    console.log("user", user)
    return user
  }

  async addUserToWaitList(userId: string, country: Country | null) {
    const countryKey = country ? `country:${country.code}` : "country:all"
    console.log("countryKey", countryKey)
    await this.pubClient.sadd(`users:${countryKey}`, userId)
  }
}
