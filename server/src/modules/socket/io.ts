import { io } from "@/app"
import { UserController } from "@/modules/user"
import { SocketEvents } from "../../common/socket-events"
import { SocketType, TgUser } from "../../common/types"
import { SocketController } from "@/modules/socket"
import { TelegramService } from "../telegram/service"

interface IoConnectorProps {
  io: typeof io
  userController: UserController
  tgService: TelegramService
  socketController: SocketController
}

export class IoConnector {
  public io
  public userController
  public tgService
  public socketController

  constructor({ io, userController, socketController, tgService }: IoConnectorProps) {
    this.io = io
    this.userController = userController
    this.tgService = tgService
    this.socketController = socketController
  }

  async connect() {
    try {
      this.authIo()
    } catch (err) {
      console.log("Err socket auth", err)
      return
    }

    this.io.on(SocketEvents.Connection, async (socket) => {
      await this.socketController.connect(socket as unknown as SocketType)
    })
    this.io.on(SocketEvents.ConnectionError, (err) =>
      console.log(`connect_error due to ${err.message}`)
    )
  }

  private authIo() {
    this.io.use(async (socketCon, next) => {
      const socket = socketCon as unknown as SocketType
      const initData = socket.handshake.auth.initData
      // const isValid = this.tgService.verifyInitData(initData)
      const initDataParse = new URLSearchParams(initData)
      const user: TgUser = JSON.parse(initDataParse.get("user") || "{}")

      const isValid = true // TODO dev mode

      if (isValid) {
        const userData = await this.userController.getUserById(user.id)
        if (!userData) {
          next(new Error("User not found"))
          return
        }

        socket.data.user = userData
        next()
      } else {
        next(new Error("invalid socket auth"))
      }
    })
  }
}
