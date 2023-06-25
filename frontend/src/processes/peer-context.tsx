import { nanoid } from "nanoid"
import Peer from "peerjs"
import { createContext, useEffect } from "react"
import { Outlet } from "react-router-dom"

interface PeerContextProps {
  peer: Peer
}

export const PeerContext = createContext<PeerContextProps>({
  peer: new Peer(),
})
const myId = nanoid(6)
export const PeerProvider = () => {
  const peer = new Peer(myId, {
    host: "localhost",
    port: 9000,
    secure: false,
    path: "/",
  })
  console.log("myId", myId)
  console.log("peer", peer)

  useEffect(() => {
    peer.on("open", () => {
      console.log("Peer успешно инициализирован")
    })
    peer.on("error", (error) => {
      console.log("Обработка ошибки инициализации Peer", error)
    })

    return () => {
      peer.disconnect() // Отключение PeerJS при размонтировании компонента
    }
  }, [peer])

  return (
    <PeerContext.Provider value={{ peer }}>
      <Outlet />
    </PeerContext.Provider>
  )
}
