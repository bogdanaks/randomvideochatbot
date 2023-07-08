import React, { useEffect } from "react"
import { HiChevronDoubleRight } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { SoketEvents } from "entities/chat/model/enums"
import { socket } from "entities/chat/model/socket"
import { selectSelectedCountry } from "entities/user/model/slice"
import { selectVideoChat, setIsSearching } from "entities/video-chat/model/slice"

import { usePeer } from "shared/hooks/use-peer"

import { Searching } from "../searching"
import { SettingsSearch } from "../settings-chat"
import styles from "./styles.module.css"

export const VideoChat: React.FC = () => {
  const videoChat = useAppSelector(selectVideoChat)
  const selectedCountry = useAppSelector(selectSelectedCountry)
  const dispatch = useAppDispatch()
  const {
    peer,
    myVideoRef,
    peerVideoRef,
    recipientPeerId,
    handleConnectMyStreamToMyVideoRef,
    handlePeerDisconnect,
    onWaitCall,
    handleCall,
  } = usePeer()

  useEffect(() => {
    if (!peer) return
    ;(async () => {
      await handleConnectMyStreamToMyVideoRef()
      onWaitCall(handleNextSearch)
    })()
  }, [peer])

  useEffect(() => {
    if (recipientPeerId) {
      dispatch(setIsSearching(false))
    }
  }, [recipientPeerId])

  const handleSearchUser = async (peerId: string | null) => {
    if (peerId) {
      await handleCall(peerId, handleNextSearch)
      dispatch(setIsSearching(false))
    } else {
      dispatch(setIsSearching(true))
    }
  }

  const handleNextSearch = async () => {
    await handlePeerDisconnect()
    dispatch(setIsSearching(true))
    socket.emit(SoketEvents.SearchUser, selectedCountry, handleSearchUser)
  }

  const isConnected = !videoChat.isSearching && !!recipientPeerId?.length

  return (
    <div className={styles.wrapper}>
      <div className={styles.half}>
        {videoChat.isSearching && <Searching />}
        {!recipientPeerId && !videoChat.isSearching && <SettingsSearch />}
        {isConnected && (
          <div className={styles.iconNext} onClick={handleNextSearch}>
            <HiChevronDoubleRight size={30} />
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
