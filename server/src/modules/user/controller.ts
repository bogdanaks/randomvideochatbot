import { UserService } from "./service"
import { RedisService } from "../redis"
import { UserEntity } from "./user.entity"
import { Country } from "@/common/types"

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

  async searchFreeUser(userId: string, country: Country | null) {
    const prevUsers = await this.getPrevUsersCall(userId)
    const usersByCountry = await this.redisService.getUsersByCountry(country)
    const freeUsers = usersByCountry.filter((i) => !prevUsers.includes(i))
    const freeWithoutMe = freeUsers.filter((i) => i !== userId)

    if (!freeWithoutMe.length) {
      return null
    }

    if (freeWithoutMe.length) {
      let findFreeUser = null
      for (const freeUserId of freeWithoutMe) {
        const isConnected = await this.isConnected(freeUserId)
        if (isConnected) {
          findFreeUser = freeUserId
          break
        }
      }

      if (findFreeUser) {
        await this.redisService.removeUserFromWaitList(findFreeUser, country)
        return findFreeUser
      }

      return null
    }
  }

  async getPrevUsersCall(userId: string) {
    return await this.redisService.getPrevUsersCall(userId)
  }

  async addUserToWaitList(userId: string, country: Country | null) {
    await this.redisService.addUserToWaitList(userId, country)
  }

  async addUserToPrevList(userId: string, callUserId: string) {
    await this.redisService.setPrevUsersCall(userId, callUserId)
  }

  async removeUserFromWaitList(userId: string, country: Country | null) {
    await this.redisService.removeUserFromWaitList(userId, country)
  }

  async setConnectedUser(userId: string) {
    await this.redisService.setConnectedUser(userId)
  }

  async removeConnectedUser(userId: string) {
    await this.redisService.removeConnectedUser(userId)
  }

  async isConnected(userId: string) {
    return await this.redisService.isConnectedUser(userId)
  }
}
