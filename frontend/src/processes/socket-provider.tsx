import { useEffect, useRef } from "react"
import { Outlet } from "react-router-dom"
import { Socket } from "socket.io-client"

import { useAppDispatch } from "app/hooks"

import { SoketEvents } from "entities/chat/model/enums"
import { setSocket, socket } from "entities/chat/model/socket"
import { useTelegram } from "entities/telegram/model"

const SocketProvider = () => {
  const { user: tgUser, initData } = useTelegram()
  const dispatch = useAppDispatch()
  const socketConnected = useRef<Socket | null>(null)

  useEffect(() => {
    if (!initData) return

    const socketCon = !socket ? setSocket(initData) : socket
    socketConnected.current = socketCon
  }, [initData])

  useEffect(() => {
    if (!socketConnected.current || !tgUser?.id) return
    let timerGetRandomUser: NodeJS.Timeout

    socketConnected.current.on("connect", () => {
      if (!socketConnected.current) return

      // eslint-disable-next-line no-console
      console.log("Socket connect", socketConnected.current.id)

      timerGetRandomUser = setTimeout(() => {
        if (!socketConnected.current) return

        socketConnected.current.emit(SoketEvents.GetRandomUser, (peerId: string) => {
          console.log("peerId", peerId)
          // dispatch(setInit(initState))
        })
      }, 500)
    })

    // ROOMS
    // socketConnected.on(SoketEvents.RoomUpdate, (roomId: string) => {
    //   dispatch(setRoomId(roomId))
    // })
    // socketConnected.on(SoketEvents.RoomUserJoin, (user: UserEntity) => {
    //   dispatch(joinUser(user))
    // })
    // socketConnected.on(SoketEvents.RoomUserLeave, (user_id: string) => {
    //   dispatch(leaveUser(user_id))
    // })

    socketConnected.current.connect()

    return () => {
      socketConnected.current?.removeAllListeners()
      socketConnected.current = null
      clearTimeout(timerGetRandomUser)
    }
  }, [socketConnected, tgUser])

  return socketConnected.current ? <Outlet /> : null
}

export default SocketProvider
