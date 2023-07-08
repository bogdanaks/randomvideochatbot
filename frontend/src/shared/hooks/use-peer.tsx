import { DataConnection, MediaConnection } from "peerjs"
import { PeerContext } from "processes/peer-provider"
import { useContext, useMemo } from "react"

export const usePeer = () => {
  const {
    peer,
    peerVideoRef,
    myVideoRef,
    recipientPeerId,
    setRecipientPeerId,
    dataConnection,
    mediaConnection,
    setDataConnection,
    setMediaConnection,
  } = useContext(PeerContext)

  const checkMediaConnection = (connection: MediaConnection) => {
    connection.on("stream", () => {
      // eslint-disable-next-line no-console
      console.log("Соединение установлено!")
      // Выполните здесь действия, которые вы хотите выполнить при успешном соединении
    })

    connection.on("close", async () => {
      // eslint-disable-next-line no-console
      console.log("Соединение закрыто!")
      await handlePeerDisconnect()
      // Выполните здесь действия, которые вы хотите выполнить при закрытии соединения
    })

    connection.on("error", (error) => {
      // Ошибка соединения
      // eslint-disable-next-line no-console
      console.log("Ошибка соединения:", error)
      // Выполните здесь действия, которые вы хотите выполнить при ошибке соединения
    })
  }

  const myVideStream = useMemo(async () => {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: true,
    })
  }, [])

  const setConnection = (conn: DataConnection, call: MediaConnection) => {
    if (setDataConnection && setMediaConnection) {
      setDataConnection(conn)
      setMediaConnection(call)
    }
  }

  const handlePeerDisconnect = async () => {
    if (setRecipientPeerId && peerVideoRef?.current) {
      setRecipientPeerId(null)
      peerVideoRef.current.pause()
      peerVideoRef.current.currentTime = 0
      peerVideoRef.current.srcObject = null
      peerVideoRef.current.playsInline = false

      if (mediaConnection && dataConnection && setDataConnection && setMediaConnection) {
        dataConnection.send("connection_close")
        mediaConnection.close()
        setDataConnection(null)
        setMediaConnection(null)
      }
    }
  }

  const handleCall = async (peerCallId: string, handleClosePeerConnection: () => void) => {
    if (!peer) return

    const stream = await myVideStream
    // Отправка вызова другому участнику
    const call = peer.call(peerCallId, stream, {
      metadata: {
        peerId: peer.id,
      },
    })

    if (!call) {
      console.error("Ошибка при отправке вызова")
      return
    }

    const conn = peer.connect(peerCallId)
    setConnection(conn, call)
    checkMediaConnection(call)

    peer.on("connection", (dataConnection) => {
      dataConnection.on("open", () => {
        dataConnection.on("data", (data) => {
          if (data === "connection_close") {
            handleClosePeerConnection()
          }
        })
      })
    })

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
          setRecipientPeerId(peerCallId)
          // await peerVideoRef.current.play()
        }
      }
    })

    call.on("close", () => {
      // eslint-disable-next-line no-console
      console.log("close connection")
    })
  }

  const onWaitCall = async (handleClosePeerConnection: () => void) => {
    if (!peer) return

    peer.on("connection", (dataConnection) => {
      dataConnection.on("open", () => {
        dataConnection.on("data", (data) => {
          if (data === "connection_close") {
            handleClosePeerConnection()
          }
        })
      })
    })

    peer.on("call", async (call) => {
      const callRecipientPeerId = call.metadata.peerId
      const stream = await myVideStream

      const conn = peer.connect(callRecipientPeerId)
      setConnection(conn, call)
      checkMediaConnection(call)

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
            // await peerVideoRef.current.play()
          }
        }
      })
    })
  }

  const handleConnectMyStreamToMyVideoRef = async () => {
    if (myVideoRef?.current) {
      myVideoRef.current.srcObject = await myVideStream
      myVideoRef.current.playsInline = true
      // await myVideoRef.current.play()
    }
  }

  return {
    peer,
    peerVideoRef,
    myVideoRef,
    recipientPeerId,
    myVideStream,
    dataConnection,
    mediaConnection,
    setRecipientPeerId,
    checkMediaConnection,
    handleConnectMyStreamToMyVideoRef,
    handlePeerDisconnect,
    handleCall,
    onWaitCall,
  }
}
