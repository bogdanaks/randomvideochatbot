import { Server } from "socket.io"
import { Handshake, Socket } from "socket.io/dist/socket"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export interface Message {
  user: TgUser
  message: string
}

export interface TgUser {
  id: string
  first_name: string
  last_name?: string
  language_code: string
  is_premium?: boolean
  username?: string
}

export interface TgUserSignIn extends TgUser {
  age: number
  gender: "M" | "W"
}

export interface RoomsType {
  [roomId: string]: string[]
}

type HandshakeAuth = {
  initData: string
}
type HandshakeExtends = Omit<Handshake, "auth"> & { auth: HandshakeAuth }

type SocketTypeInit = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
export type SocketType = Omit<SocketTypeInit, "handshake"> & {
  handshake: HandshakeExtends
} & { data: { user: TgUser } }

export type IoType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
