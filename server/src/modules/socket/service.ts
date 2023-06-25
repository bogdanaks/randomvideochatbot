import { SocketType } from "@/common/types"
import { io } from "@/app"

interface SocketServiceProps {
  io: typeof io
}

export class SocketService {
  private io

  constructor({ io }: SocketServiceProps) {
    this.io = io
  }

  async userJoin(socket: SocketType, roomId: string) {
    await socket.join(roomId)
    // await this.emitRoomJoin(user, roomId)
  }

  // async emitRoomJoin(user: UserEntity, roomId: string) {
  //   this.io.to(roomId).emit(SocketEvents.RoomUserJoin, user)
  // }
}
