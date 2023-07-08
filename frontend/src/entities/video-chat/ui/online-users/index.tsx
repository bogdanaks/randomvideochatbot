import { useEffect, useState } from "react"

import { SoketEvents } from "entities/chat/model/enums"
import { socket } from "entities/chat/model/socket"

import styles from "./styles.module.css"

export const OnlineUsers = () => {
  const [online, setOnline] = useState(0)

  const setOnlineUsers = (count: string) => {
    setOnline(Number(count))
  }

  useEffect(() => {
    socket.emit(SoketEvents.GetOnline, setOnlineUsers)
  }, [])

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.online}>Онлайн: {online}</h4>
    </div>
  )
}
