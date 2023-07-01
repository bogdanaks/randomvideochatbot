import { useAppSelector } from "app/hooks"

import { selectIsVisibleSettings } from "../../model/slice"
import styles from "./styles.module.css"

export const UserSettings = () => {
  const isVisible = useAppSelector(selectIsVisibleSettings)

  if (!isVisible) return null

  return <div className={styles.wrapper}>UserSettings</div>
}
