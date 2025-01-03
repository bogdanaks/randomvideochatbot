import { useState } from "react"
import { HiOutlineCog8Tooth } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { SoketEvents } from "entities/chat/model/enums"
import { socket } from "entities/chat/model/socket"
import {
  selectSelectedCountry,
  setIsVisibleSettings,
  setSelectedCountry,
} from "entities/user/model/slice"
import { UserSettings } from "entities/user/ui/user-settings"
import { setIsSearching } from "entities/video-chat/model/slice"

import GlobeImg from "shared/assets/globe.png"
import NoizeImg from "shared/assets/noize.jpg"
import { countries } from "shared/config/countries"
import { usePeer } from "shared/hooks/use-peer"
import { Flag } from "shared/ui/flag"

import { OnlineUsers } from "../online-users"
import styles from "./styles.module.css"

interface Country {
  code: string
  title: string
}

export const SettingsSearch = () => {
  const [isCountryVisible, setIsCountryVisible] = useState(false)
  const dispatch = useAppDispatch()
  const selectedCountry = useAppSelector(selectSelectedCountry)
  const { handleCall, handlePeerDisconnect } = usePeer()

  const handleCountrySelect = () => {
    setIsCountryVisible(!isCountryVisible)
  }

  const handleCountryClick = (country: Country | null) => {
    dispatch(setSelectedCountry(country))
  }

  const handleNextSearch = async () => {
    await handlePeerDisconnect()
    dispatch(setIsSearching(true))
    socket.emit(SoketEvents.SearchUser, selectedCountry, handleSearchUser)
  }

  const handleSearchUser = async (peerId: string | null) => {
    if (peerId) {
      await handleCall(peerId, handleNextSearch)
      dispatch(setIsSearching(false))
    } else {
      dispatch(setIsSearching(true))
    }
  }

  const handleSearchClick = () => {
    setIsCountryVisible(false)
    socket.emit(SoketEvents.SearchUser, selectedCountry, handleSearchUser)
  }

  const handleSettingsClick = () => {
    dispatch(setIsVisibleSettings(true))
  }

  return (
    <div className={styles.wrapper}>
      <UserSettings />
      <img className={styles.imgNoize} src={NoizeImg} alt="Noize" />
      <div className={styles.body}>
        <OnlineUsers />
        <div className={styles.settingsIcon} onClick={handleSettingsClick}>
          <HiOutlineCog8Tooth size={24} />
        </div>
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
