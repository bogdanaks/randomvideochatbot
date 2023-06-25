export const a = true
// import Peer from "peerjs"
// import { useEffect, useRef, useState } from "react"

// interface VideoChatProps {
//   userId: string
//   onConnect: () => void
//   onDisconnect: () => void
// }

// export const VideoChatOld = ({ userId, onConnect, onDisconnect }: VideoChatProps) => {
//   const [peer, setPeer] = useState<Peer | null>(null)
//   const [partnerId, setPartnerId] = useState<string | null>(null)
//   const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null)
//   const [myStream, setMyStream] = useState<MediaStream | null>(null)
//   const [audioEnabled, setAudioEnabled] = useState<boolean>(true)
//   const [videoEnabled, setVideoEnabled] = useState<boolean>(true)
//   const videoRef = useRef<HTMLVideoElement>(null)

//   useEffect(() => {
//     const newPeer = new Peer(userId)
//     setPeer(newPeer)

//     newPeer.on("open", () => {
//       onConnect()
//     })

//     newPeer.on("call", (call) => {
//       if (myStream) {
//         call.answer(myStream)
//       }
//       call.on("stream", (stream) => {
//         setPartnerStream(stream)
//       })
//       call.on("close", () => {
//         setPartnerStream(null)
//         setPartnerId(null)
//         onDisconnect()
//       })
//       setPartnerId(call.peer)
//     })

//     return () => {
//       newPeer.disconnect()
//     }
//   }, [])

//   useEffect(() => {
//     if (peer) {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true, video: true })
//         .then((stream) => {
//           setMyStream(stream)
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream
//           }
//         })
//         .catch((error) => {
//           console.error(error)
//         })
//     }
//   }, [peer])

//   useEffect(() => {
//     if (partnerStream && videoRef.current) {
//       videoRef.current.srcObject = partnerStream
//     }
//   }, [partnerStream])

//   const handleAudioToggle = () => {
//     if (myStream) {
//       myStream.getAudioTracks().forEach((track) => {
//         track.enabled = !audioEnabled
//       })
//       setAudioEnabled(!audioEnabled)
//     }
//   }

//   const handleVideoToggle = () => {
//     if (myStream) {
//       myStream.getVideoTracks().forEach((track) => {
//         track.enabled = !videoEnabled
//       })
//       setVideoEnabled(!videoEnabled)
//     }
//   }

//   return (
//     <div>
//       <video ref={videoRef} autoPlay muted />
//       <div>
//         <button onClick={handleAudioToggle}>
//           {audioEnabled ? "Disable Audio" : "Enable Audio"}
//         </button>
//         <button onClick={handleVideoToggle}>
//           {videoEnabled ? "Disable Video" : "Enable Video"}
//         </button>
//       </div>
//     </div>
//   )
// }
