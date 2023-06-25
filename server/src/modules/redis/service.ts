import { Redis } from "ioredis"

import { UserEntity } from "../user"
import { appConfig } from "@/config"
import { TgUser } from "@/common/types"

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

  async setUserWait(userId: string) {
    await this.pubClient.set("waitUser", userId)
  }

  async getUserWait() {
    return await this.pubClient.get("waitUser")
  }
}
