import { useEffect, useState } from "react"
import { HiXMark } from "react-icons/hi2"

import { useAppDispatch, useAppSelector } from "app/hooks"

import { useTelegram } from "entities/telegram/model"

import { countries, getCountryByCode } from "shared/config/countries"
import { getAppSettings, setAppSettings } from "shared/lib/local-storage"
import { Flag } from "shared/ui/flag"

import { selectIsVisibleSettings, setIsVisibleSettings } from "../../model/slice"
import styles from "./styles.module.css"

export const UserSettings = () => {
  const { user } = useTelegram()
  const isVisible = useAppSelector(selectIsVisibleSettings)
  const dispatch = useAppDispatch()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isCountryVisible, setIsCountryVisible] = useState(false)

  const handleCloseClick = () => {
    dispatch(setIsVisibleSettings(false))
  }

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country)
    setAppSettings({ country })
  }

  const handleCountrySelect = () => {
    setIsCountryVisible(!isCountryVisible)
  }

  const handleContactClick = () => {
    window.location.href = "https://t.me/bogdanaks"
  }

  useEffect(() => {
    const appSettings = getAppSettings()
    if (appSettings) {
      setSelectedCountry(appSettings.country)
      return
    }

    const baseCountry = getCountryByCode(user.language_code)
    if (baseCountry) {
      setSelectedCountry(baseCountry)
    } else {
      setSelectedCountry(countries[0])
    }
  }, [])

  if (!isVisible || !selectedCountry) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.settingsIcon} onClick={handleCloseClick}>
        <HiXMark size={24} />
      </div>
      <div className={styles.header}>
        <h3>Настройки</h3>
      </div>
      <div className={styles.body}>
        <div className="flex flex-col relative gap-4 h-full">
          <div className={styles.row}>
            <label className="mb-2">Моя страна</label>
            <div>
              <button
                onClick={handleCountrySelect}
                className="flex-shrink-0 w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 border border-gray-300 rounded-l-lg hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200"
                type="button"
              >
                <Flag country={selectedCountry.code} size={20} />
                {selectedCountry.title}
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
                } z-10 bg-gray-200 divide-y divide-gray-100 rounded-lg shadow w-44`}
              >
                <ul className="py-2 text-sm text-gray-200 w-full" aria-labelledby="states-button">
                  {countries.map((country) => (
                    <li key={country.code}>
                      <button
                        type="button"
                        onClick={() => handleCountryClick(country)}
                        className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
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
            </div>
          </div>
          <div className={`${styles.row} mt-auto`}>
            <button
              onClick={handleContactClick}
              className="flex-shrink-0 w-full z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-200"
              type="button"
            >
              Написать разработчику
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
