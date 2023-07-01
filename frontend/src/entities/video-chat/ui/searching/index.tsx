import { useAppDispatch } from "app/hooks"

import { setIsSearching } from "entities/video-chat/model/slice"

import NoizeImg from "shared/assets/noize.jpg"
import { Loader } from "shared/ui/loader"

import styles from "./styles.module.css"

export const Searching = () => {
  const dispatch = useAppDispatch()

  const handleCancelSearch = () => {
    dispatch(setIsSearching(false))
  }

  return (
    <div className={styles.searching}>
      <img className={styles.imgNoize} src={NoizeImg} alt="Noize" />
      <div className={styles.body}>
        <h4 className={styles.online}>Онлайн: 123 412 пользов.</h4>
        <div className={styles.loader}>
          <span>Поиск..</span>
          <Loader />
        </div>
        <div className={styles.footer}>
          <div className="flex w-full relative">
            <button
              onClick={handleCancelSearch}
              className="border text-sm rounded-lg border-l-gray-700 border-l-2 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
