import { useEffect, useMemo } from "react"
import SimplePeer from "simple-peer"

import { Wrapper } from "shared/ui/wrapper"

import styles from "./styles.module.css"

const simplePeer = new SimplePeer()

const MainPage = () => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode: "user" },
      })
      .then(function (stream) {
        console.log("steam", stream)
      })
  }, [])

  return (
    <Wrapper>
      <div className={styles.container}>
        Hello World
        <span>
          {SimplePeer.WEBRTC_SUPPORT
            ? "WebRTC is supported in this browser"
            : "WebRTC is not supported in this browser"}
        </span>
      </div>
    </Wrapper>
  )
}

export default MainPage
