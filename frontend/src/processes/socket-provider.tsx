import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { setSocket, socket } from "entities/chat/model/socket"
import { useTelegram } from "entities/telegram/model"

import { Loader } from "shared/ui/loader"

const SocketProvider = () => {
  const { user: tgUser, initData } = useTelegram()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(socket?.connected || false)

  const handleDisconnect = () => {
    setIsConnected(false)
  }

  const handleConnectError = (err: Error) => {
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
      setIsConnected(true)

      // eslint-disable-next-line no-console
      console.log("Socket connect", socket.id)
    })

    socket.on("connect_error", handleConnectError)

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
      style={{
        height: "100vh",
        width: "100wh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader />
    </div>
  )
}

export default SocketProvider
