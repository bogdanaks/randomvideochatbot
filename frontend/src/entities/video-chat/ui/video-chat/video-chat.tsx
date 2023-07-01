import { PeerContext } from "processes/peer-provider"
import React, { useContext, useEffect, useState } from "react"

import { useAppSelector } from "app/hooks"

import { selectVideoChat } from "entities/video-chat/model/slice"

import { Loader } from "shared/ui/loader"

import { Searching } from "../searching"
import { SettingsChat } from "../settings-chat"
import styles from "./styles.module.css"

export const VideoChat: React.FC = () => {
  const { peer, myVideoRef, peerVideoRef, recipientPeerId, setRecipientPeerId } =
    useContext(PeerContext)
  const [strLog, setStrLog] = useState("")
  const videoChat = useAppSelector(selectVideoChat)

  useEffect(() => {
    if (!myVideoRef?.current) return
    ;(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      })

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream
        myVideoRef.current.playsInline = true
        await myVideoRef.current.play()
      }

      // Прием вызова от другого участника
      peer.on("call", (call) => {
        const callRecipientPeerId = call.metadata.peerId

        call.answer(stream)
        call.on("stream", async (remoteStream) => {
          if (peerVideoRef?.current) {
            peerVideoRef.current.srcObject = remoteStream
            peerVideoRef.current.playsInline = true

            const isPlaying =
              peerVideoRef.current.currentTime > 0 &&
              !peerVideoRef.current.paused &&
              !peerVideoRef.current.ended &&
              peerVideoRef.current.readyState > peerVideoRef.current.HAVE_CURRENT_DATA

            setStrLog(`isPlaying: ${isPlaying}`)
            if (!isPlaying && setRecipientPeerId) {
              setRecipientPeerId(callRecipientPeerId)
            }
          }
        })
      })
    })()

    return () => {
      // Логика очистки
    }
  }, [peer, myVideoRef, peerVideoRef])

  return (
    <div className={styles.videos}>
      {videoChat.isSearching && <Searching />}
      {!recipientPeerId && !videoChat.isSearching && <SettingsChat />}
      <video
        className={styles.video2}
        id="another"
        ref={peerVideoRef}
        autoPlay
        playsInline
        style={{ display: videoChat.isSearching || !recipientPeerId ? "none" : "block" }}
      />
      <video className={styles.video1} id="my" ref={myVideoRef} muted autoPlay playsInline />
    </div>
  )
}
