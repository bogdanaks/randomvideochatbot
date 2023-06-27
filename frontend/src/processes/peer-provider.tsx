import Peer from "peerjs"
import React, { createContext, useEffect, useRef, useState } from "react"
import { Outlet } from "react-router-dom"

import { useTelegram } from "entities/telegram/model"

import { config } from "shared/config"

interface PeerContextProps {
  peer: Peer
  myVideoRef: React.RefObject<HTMLVideoElement> | null
  peerVideoRef: React.RefObject<HTMLVideoElement> | null
  recipientPeerId: string | null
  setRecipientPeerId?: React.Dispatch<React.SetStateAction<string | null>>
}

export const PeerContext = createContext<PeerContextProps>({
  peer: new Peer(),
  myVideoRef: null,
  peerVideoRef: null,
  recipientPeerId: null,
})

export const PeerProvider = () => {
  const { user } = useTelegram()
  const [recipientPeerId, setRecipientPeerId] = useState<string | null>(null)

  const myVideoRef = useRef<HTMLVideoElement>(null)
  const peerVideoRef = useRef<HTMLVideoElement>(null)

  const peer = new Peer(String(user.id), {
    host: config.PEER_HOST,
    port: config.PEER_PORT,
    secure: true,
    path: "/",
  })

  useEffect(() => {
    peer.on("open", () => {
      console.log("Peer успешно инициализирован", peer.id)
    })
    peer.on("error", (error) => {
      console.log("Обработка ошибки инициализации Peer", error)
    })

    return () => {
      peer.disconnect() // Отключение PeerJS при размонтировании компонента
    }
  }, [])

  return (
    <PeerContext.Provider
      value={{ peer, myVideoRef, peerVideoRef, recipientPeerId, setRecipientPeerId }}
    >
      <Outlet />
    </PeerContext.Provider>
  )
}
