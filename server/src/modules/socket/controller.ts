import { Country, SocketType } from "@/common/types"
import { SocketEvents } from "@/common/socket-events"
import { UserController } from "../user"

interface SocketControllerProps {
  userController: UserController
}

export class SocketController {
  private userController

  constructor({ userController }: SocketControllerProps) {
    this.userController = userController
  }

  async connect(socket: SocketType) {
    console.log(`[SocketController]: Socket(${socket.id}) connecting`)
    await this.listeners(socket)
  }

  async listeners(socket: SocketType) {
    socket.on(SocketEvents.SearchUser, (selectedCountry, resolve) =>
      this.onSearchUser(resolve, socket.data.user.id, selectedCountry)
    )
    socket.on(
      SocketEvents.Disconnect,
      async () => await this.onDisconnect(String(socket.data.user.id))
    )
  }

  async onSearchUser(resolve: any, userId: string, selectedCountry: Country | null) {
    const user = await this.userController.searchFreeUser(selectedCountry)
    if (!user) {
      await this.userController.addUserToWaitList(userId, selectedCountry)
      resolve(null)
      return
    }

    if (String(user) === String(userId)) {
      resolve(null)
      return
    }

    resolve(user)

    // if (!waitUser) {
    //   await this.userController.setUserWait(userId)
    //   resolve(null)
    //   return
    // }
    // if (String(waitUser) === String(userId)) {
    //   resolve(null)
    //   return
    // }
    // resolve(waitUser)
  }

  async onDisconnect(userId: string) {
    // await this.socketService.emitRoomLeave(userId, roomId)
    // await this.room.userLeave(userId, roomId)
  }
}
