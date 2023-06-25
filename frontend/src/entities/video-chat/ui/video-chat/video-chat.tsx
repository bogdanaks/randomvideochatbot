import { MediaConnection } from "peerjs"
import { PeerContext } from "processes/peer-context"
import React, { useContext, useEffect, useRef, useState } from "react"

import styles from "./styles.module.css"

export const VideoChat: React.FC = () => {
  const { peer } = useContext(PeerContext)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const peerVideoRef = useRef<HTMLVideoElement>(null)
  const [recipientPeerId, setRecipientPeerId] = useState<string>("")
  const [strLog, setStrLog] = useState("")

  function checkMediaConnection(connection: MediaConnection) {
    connection.on("stream", () => {
      // Соединение установлено успешно
      console.log("Соединение установлено!")
      // Выполните здесь действия, которые вы хотите выполнить при успешном соединении
    })

    connection.on("close", () => {
      // Соединение закрыто
      console.log("Соединение закрыто!")
      // Выполните здесь действия, которые вы хотите выполнить при закрытии соединения
    })

    connection.on("error", (error) => {
      // Ошибка соединения
      console.log("Ошибка соединения:", error)
      // Выполните здесь действия, которые вы хотите выполнить при ошибке соединения
    })
  }

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((stream) => {
        // Отправка вызова другому участнику
        const call = peer.call(recipientPeerId, stream)
        if (!call) {
          console.error("Ошибка при отправке вызова")
          return
        }

        checkMediaConnection(call)

        call.on("stream", async (remoteStream) => {
          if (peerVideoRef.current) {
            peerVideoRef.current.srcObject = remoteStream
            peerVideoRef.current.playsInline = true
            await peerVideoRef.current.play()
          }
        })
      })
      .catch((error) => {
        console.error("Ошибка при доступе к медиа-устройствам:", error)
      })
  }

  useEffect(() => {
    if (!myVideoRef.current || !peerVideoRef.current) return
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
        call.answer(stream)
        call.on("stream", async (remoteStream) => {
          if (peerVideoRef.current) {
            peerVideoRef.current.srcObject = remoteStream
            peerVideoRef.current.playsInline = true
            await peerVideoRef.current.play()
          }
        })
      })
    })()

    return () => {
      // Логика очистки
    }
  }, [peer, myVideoRef, peerVideoRef])

  return (
    <>
      <div className={styles.header}>
        <span style={{ width: "fit-content" }}>{peer.id}</span>
        <input
          className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          value={recipientPeerId}
          onChange={(e) => setRecipientPeerId(e.target.value)}
        />
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          onClick={handleCall}
        >
          Call
        </button>
      </div>
      <div className={styles.videos}>
        <video className={styles.video1} id="my" ref={myVideoRef} muted autoPlay playsInline />
        <video className={styles.video2} id="another" ref={peerVideoRef} autoPlay playsInline />
      </div>
    </>
  )
}
