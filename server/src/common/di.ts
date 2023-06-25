import { createContainer, InjectionMode, asClass } from "awilix"
import { UserController, UserService } from "@/modules/user"
import { IoConnector } from "../modules/socket/io"
import { TelegramService } from "@/modules/telegram/service"
import { RedisService } from "@/modules/redis/service"
import { SocketService } from "@/modules/socket/service"
import { SocketController } from "@/modules/socket"

export const DI = createContainer({
  injectionMode: InjectionMode.PROXY,
})

DI.register({
  ioConnector: asClass(IoConnector).singleton(),
  userService: asClass(UserService),
  userController: asClass(UserController),
  tgService: asClass(TelegramService),
  redisService: asClass(RedisService).singleton(),
  socketController: asClass(SocketController),
  socketService: asClass(SocketService),
})
