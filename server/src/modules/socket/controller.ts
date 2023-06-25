import { SocketType } from "@/common/types"
import { SocketService } from "./service"
import { RedisService } from "../redis/service"
import { SocketEvents } from "@/common/socket-events"
import { UserController, UserEntity } from "../user"

interface SocketControllerProps {
  socketService: SocketService
  redisService: RedisService
  userController: UserController
}

export class SocketController {
  private socketService
  private redisService
  private userController

  constructor({ socketService, redisService, userController }: SocketControllerProps) {
    this.socketService = socketService
    this.redisService = redisService
    this.userController = userController
  }

  async connect(socket: SocketType) {
    console.log(`[SocketController]: Socket(${socket.id}) connecting`)
    await this.listeners(socket)
    // await this.redisService.addUserToWaitingList(socket.data.user.id)
  }

  async listeners(socket: SocketType) {
    socket.on(SocketEvents.GetRandomUser, (resolve) =>
      this.onGetRandomUser(resolve, socket.data.user.id)
    )
    socket.on(
      SocketEvents.Disconnect,
      async () => await this.onDisconnect(String(socket.data.user.id))
    )
  }

  async onGetRandomUser(resolve: any, userId: string) {
    const waitUser = await this.userController.getUserWait()

    if (!waitUser) {
      await this.userController.setUserWait(userId)
      resolve(null)
      return
    }

    if (String(waitUser) === String(userId)) {
      resolve(null)
      return
    }

    resolve(waitUser)
  }

  async onKissUser(user: UserEntity, roomId: string, userTargetId: string) {
    // await this.game.emitKissUser(roomId, user, userTargetId)
  }

  async onDisconnect(userId: string) {
    // await this.socketService.emitRoomLeave(userId, roomId)
    // await this.room.userLeave(userId, roomId)
  }
}
