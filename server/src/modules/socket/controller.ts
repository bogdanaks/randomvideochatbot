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
    await this.userController.setConnectedUser(String(socket.data.user.id))
    await this.listeners(socket)
  }

  async listeners(socket: SocketType) {
    socket.on(SocketEvents.SearchUser, (selectedCountry, resolve) =>
      this.onSearchUser(resolve, socket.data.user.id, selectedCountry)
    )
    socket.on(SocketEvents.GetOnline, (resolve) => this.getOnlineUsers(resolve))
    socket.on(SocketEvents.Disconnect, () => this.onDisconnect(String(socket.data.user.id)))
  }

  async onSearchUser(resolve: any, userId: string, selectedCountry: Country | null) {
    const user = await this.userController.searchFreeUser(userId, selectedCountry)

    console.log("------")
    console.log("userId", userId)
    console.log("user", user)
    if (!user) {
      await this.userController.addUserToWaitList(userId, selectedCountry)
      resolve(null)
      return
    }

    await this.userController.addUserToPrevList(userId, user)
    resolve(user)
  }

  async getOnlineUsers(resolve: any) {
    const count = await this.userController.getOnlineUsers()
    resolve(count)
  }

  async onDisconnect(userId: string) {
    await this.userController.removeConnectedUser(userId)
  }
}
