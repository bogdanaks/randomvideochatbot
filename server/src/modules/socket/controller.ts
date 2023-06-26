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
    socket.on(SocketEvents.GetRandomUser, (selectedCountry, resolve) =>
      this.onGetRandomUser(resolve, socket.data.user.id, selectedCountry)
    )
    socket.on(
      SocketEvents.Disconnect,
      async () => await this.onDisconnect(String(socket.data.user.id))
    )
  }

  async onGetRandomUser(resolve: any, userId: string, selectedCountry: Country | null) {
    const waitUser = await this.userController.getUserWait()

    console.log("selectedCountry", selectedCountry)

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

  async onDisconnect(userId: string) {
    // await this.socketService.emitRoomLeave(userId, roomId)
    // await this.room.userLeave(userId, roomId)
  }
}
