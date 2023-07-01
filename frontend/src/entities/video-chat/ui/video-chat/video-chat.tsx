import { PeerContext } from "processes/peer-provider"
import React, { useContext, useEffect } from "react"
import { HiChevronDoubleRight } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { selectVideoChat, setIsSearching } from "entities/video-chat/model/slice"

import { Searching } from "../searching"
import { SettingsSearch } from "../settings-chat"
import styles from "./styles.module.css"

export const VideoChat: React.FC = () => {
  const { peer, myVideoRef, peerVideoRef, recipientPeerId, setRecipientPeerId } =
    useContext(PeerContext)
  const videoChat = useAppSelector(selectVideoChat)
  const dispatch = useAppDispatch()

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

            if (!isPlaying && setRecipientPeerId) {
              setRecipientPeerId(callRecipientPeerId)
              await peerVideoRef.current.play()
              dispatch(setIsSearching(false))
            }
          }
        })
      })
    })()

    return () => {
      // Логика очистки
    }
  }, [peer, myVideoRef, peerVideoRef])

  const isConnected = !videoChat.isSearching && !!recipientPeerId?.length

  return (
    <div className={styles.wrapper}>
      <div className={styles.half}>
        {videoChat.isSearching && <Searching />}
        {!recipientPeerId && !videoChat.isSearching && <SettingsSearch />}
        {isConnected && (
          <div className={styles.iconNext}>
            <HiChevronDoubleRight size={24} />
          </div>
        )}
        <video
          id="peer"
          ref={peerVideoRef}
          autoPlay
          playsInline
          style={{ display: videoChat.isSearching || !recipientPeerId ? "none" : "block" }}
        />
      </div>
      <div className={styles.half}>
        <video id="my" ref={myVideoRef} muted autoPlay playsInline />
      </div>
    </div>
  )
}
