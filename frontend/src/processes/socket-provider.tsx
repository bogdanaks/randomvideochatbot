import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { setSocket, socket } from "entities/chat/model/socket"
import { useTelegram } from "entities/telegram/model"

const SocketProvider = () => {
  const { user: tgUser, initData } = useTelegram()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(socket?.connected || false)
  const [logStr, setLogStr] = useState("")

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const handleConnectError = (err: Error) => {
    setLogStr(String(err.message))
    if (err.message === "User not found") {
      navigate("/sign-in")
    }
  }

  useEffect(() => {
    if (!initData || socket) return
    setSocket(initData)
  }, [initData])

  useEffect(() => {
    if (!socket || !tgUser?.id) return

    socket.on("connect", () => {
      setLogStr("connect")
      setIsConnected(true)

      // eslint-disable-next-line no-console
      console.log("Socket connect", socket.id)
    })

    socket.on("connect_error", handleConnectError)

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

    socket.connect()

    return () => {
      socket.removeAllListeners()
      handleDisconnect()
      socket.disconnect()
    }
  }, [tgUser])

  return isConnected ? (
    <Outlet />
  ) : (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
    >
      Socket is not connected Tg: {tgUser?.id} {logStr}
    </div>
  )
}

export default SocketProvider
