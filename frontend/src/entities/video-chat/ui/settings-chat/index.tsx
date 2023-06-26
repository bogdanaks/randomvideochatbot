import { MediaConnection } from "peerjs"
import { PeerContext } from "processes/peer-provider"
import { useContext, useEffect, useState } from "react"

import { SoketEvents } from "entities/chat/model/enums"
import { socket } from "entities/chat/model/socket"
import { useTelegram } from "entities/telegram/model"

import GlobeImg from "shared/assets/globe.png"
import NoizeImg from "shared/assets/noize.jpg"
import { countries } from "shared/config/countries"
import { Flag } from "shared/ui/flag"

import styles from "./styles.module.css"

interface Country {
  code: string
  title: string
}

export const SettingsChat = () => {
  const { user } = useTelegram()
  const { peer, peerVideoRef, setRecipientPeerId } = useContext(PeerContext)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isCountryVisible, setIsCountryVisible] = useState(false)

  useEffect(() => {
    if (!user) return
    const findCountry = countries.find(
      (i) => i.code.toLowerCase() === user.language_code.toLowerCase()
    )
    if (findCountry) {
      setSelectedCountry(findCountry)
    }
  }, [user])

  const handleCountrySelect = () => {
    setIsCountryVisible(!isCountryVisible)
  }

  const handleCountryClick = (country: Country | null) => {
    setSelectedCountry(country)
  }

  // TODO dublicate
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

  const handleCall = (peerCallId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: true })
      .then((stream) => {
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

        checkMediaConnection(call)

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
            }
          }
        })
      })
      .catch((error) => {
        console.error("Ошибка при доступе к медиа-устройствам:", error)
      })
  }

  const handleGetRandomUser = (peerId: string | null) => {
    if (peerId) {
      console.log("peerId is value", peerId)
      handleCall(peerId)
      return
    }

    console.log("peerId is null", peerId)
  }

  const handleSearchClick = () => {
    setIsCountryVisible(false)
    socket.emit(SoketEvents.GetRandomUser, selectedCountry, handleGetRandomUser)
  }

  return (
    <div className={styles.wrapper}>
      <img className={styles.imgNoize} src={NoizeImg} alt="Noize" />
      <div className={styles.body}>
        <h4 className={styles.online}>Онлайн: 123 412 пользов.</h4>
      </div>
      <div className={styles.footer}>
        <div className="flex w-full relative">
          <button
            onClick={handleCountrySelect}
            className="flex-shrink-0 w-2/4 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
          >
            {selectedCountry ? (
              <>
                <Flag country={selectedCountry.code} size={20} />
                {selectedCountry.title}
              </>
            ) : (
              <div className="inline-flex items-center">
                <img src={GlobeImg} width={18} height={18} style={{ marginRight: 6 }} />
                Все страны
              </div>
            )}
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={`${
              isCountryVisible ? styles.selectCountryDiv : styles.hide
            } z-10 bg-gray-700 divide-y divide-gray-100 rounded-lg shadow w-44`}
          >
            <ul className="py-2 text-sm text-gray-200 w-full" aria-labelledby="states-button">
              <li>
                <button
                  type="button"
                  onClick={() => handleCountryClick(null)}
                  className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 hover:text-white"
                >
                  <div className="inline-flex items-center">
                    <img src={GlobeImg} width={18} height={18} style={{ marginRight: 6 }} />
                    Все страны
                  </div>
                </button>
              </li>
              {countries.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    onClick={() => handleCountryClick(country)}
                    className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <div className="inline-flex items-center">
                      <Flag country={country.code} size={18} />
                      {country.title}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleSearchClick}
            className="border text-sm rounded-r-lg border-l-gray-700 border-l-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          >
            Поиск
          </button>
        </div>
      </div>
    </div>
  )
}
