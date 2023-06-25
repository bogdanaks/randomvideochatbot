import { VideoChat } from "entities/video-chat/ui/video-chat/video-chat"

import { Wrapper } from "shared/ui/wrapper"

import styles from "./styles.module.css"

const MainPage = () => {
  return (
    <Wrapper>
      <div className={styles.container}>
        <VideoChat />
      </div>
    </Wrapper>
  )
}

export default MainPage
