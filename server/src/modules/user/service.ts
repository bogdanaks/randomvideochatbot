import { TgUser, TgUserSignIn } from "@/common/types"
import { TelegramService } from "../telegram/service"
import { RedisService } from "../redis/service"
import { UserEntity } from "./user.entity"
import { AppDataSource } from "@/common/data-source"

interface UserServiceProps {
  tgService: TelegramService
  redisService: RedisService
}

export class UserService {
  protected userRepository

  constructor({}: UserServiceProps) {
    this.userRepository = AppDataSource.getRepository<UserEntity>(UserEntity)
  }

  async getUserById(userId: string) {
    return await this.userRepository.findOne({ where: { id: userId } })
  }

  // async getUsersByIds(userIds: string[]): Promise<TgUser[]> {
  //   const cachedUsers: TgUser[] = []
  //   for (const userId of userIds) {
  //     const userCache = await this.getUserById(userId)
  //     if (!userCache) {
  //       throw new Error("user undefined")
  //     }
  //     cachedUsers.push(userCache)
  //   }
  //   return cachedUsers
  // }

  async saveUser(user: TgUserSignIn) {
    await this.userRepository.save(user)
  }
}
