import { UserService } from "./service"
import { RedisService } from "../redis"
import { UserEntity } from "./user.entity"

interface UserControllerProps {
  userService: UserService
  redisService: RedisService
}

export class UserController {
  private userService
  private redisService

  constructor({ userService, redisService }: UserControllerProps) {
    this.userService = userService
    this.redisService = redisService
  }

  async getUserById(userId: string) {
    const userCache = await this.redisService.getUserById(userId)
    if (userCache) {
      return userCache
    }

    const user = await this.userService.getUserById(userId)
    if (!user) {
      console.log(`User not found: ${userId}`)
      return null
    }

    await this.redisService.saveUser(user)
    return user
  }

  async saveUser(user: UserEntity) {
    await this.userService.saveUser(user)
    await this.redisService.saveUser(user)
  }

  async getUserWait() {
    return await this.redisService.getUserWait()
  }

  async setUserWait(userId: string) {
    await this.redisService.setUserWait(userId)
  }
}
