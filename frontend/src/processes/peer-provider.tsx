import Peer, { DataConnection, MediaConnection } from "peerjs"
import React, { createContext, useEffect, useRef, useState } from "react"
import { Outlet } from "react-router-dom"

import { useTelegram } from "entities/telegram/model"

import { peerConfig } from "shared/config/peer-config"

interface PeerContextProps {
  peer: Peer | null
  myVideoRef: React.RefObject<HTMLVideoElement> | null
  peerVideoRef: React.RefObject<HTMLVideoElement> | null
  recipientPeerId: string | null
  setRecipientPeerId?: React.Dispatch<React.SetStateAction<string | null>>
  dataConnection: DataConnection | null
  mediaConnection: MediaConnection | null
  setDataConnection?: React.Dispatch<React.SetStateAction<DataConnection | null>>
  setMediaConnection?: React.Dispatch<React.SetStateAction<MediaConnection | null>>
}

export const PeerContext = createContext<PeerContextProps>({
  peer: new Peer(),
  myVideoRef: null,
  peerVideoRef: null,
  recipientPeerId: null,
  dataConnection: null,
  mediaConnection: null,
})

export const PeerProvider = () => {
  const { user } = useTelegram()
  const [recipientPeerId, setRecipientPeerId] = useState<string | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)

  const myVideoRef = useRef<HTMLVideoElement>(null)
  const peerVideoRef = useRef<HTMLVideoElement>(null)

  const [dataConnection, setDataConnection] = useState<DataConnection | null>(null)
  const [mediaConnection, setMediaConnection] = useState<MediaConnection | null>(null)

  useEffect(() => {
    const peerObj = new Peer(String(user.id), peerConfig)
    setPeer(peerObj)

    const initializePeer = async () => {
      peerObj.on("open", () => {
        // eslint-disable-next-line no-console
        console.log("Peer успешно инициализирован", peerObj.id)
      })
      peerObj.on("error", (error) => {
        // eslint-disable-next-line no-console
        console.log("Обработка ошибки инициализации Peer", error)
      })
    }

    initializePeer()

    return () => {
      if (peer) {
        peer.disconnect()
        peer.destroy()
      }
    }
  }, [])

  return (
    <PeerContext.Provider
      value={{
        peer,
        myVideoRef,
        peerVideoRef,
        recipientPeerId,
        dataConnection,
        mediaConnection,
        setRecipientPeerId,
        setDataConnection,
        setMediaConnection,
      }}
    >
      <Outlet />
    </PeerContext.Provider>
  )
}
