import styles from "./styles.module.css"

interface FlagProps {
  country: string
  size?: number
}

export const Flag = ({ country, size = 22 }: FlagProps) => {
  return (
    <div className={styles.flag} style={{ width: size, height: size }}>
      <img
        alt="Russia"
        src={`http://purecatamphetamine.github.io/country-flag-icons/1x1/${country}.svg`}
      />
    </div>
  )
}
