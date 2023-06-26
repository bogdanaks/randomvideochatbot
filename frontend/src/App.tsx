import { PeerProvider } from "processes/peer-provider"
import SocketProvider from "processes/socket-provider"
import TelegramProvider from "processes/telegram-provider"
import { FC } from "react"
import { Route, Routes } from "react-router-dom"

import SignInPage from "pages/sign-in"

import "shared/styles/globals.css"
import "shared/styles/tailwind.css"

import MainPage from "./pages/main"
import "/node_modules/flag-icons/css/flag-icons.min.css"

const App: FC = () => {
  return (
    <Routes>
      <Route element={<TelegramProvider />}>
        {/* <Route element={<AuthProvider />}> */}
        <Route element={<SocketProvider />}>
          <Route element={<PeerProvider />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/sign-in" element={<SignInPage />} />
      {/* </Route> */}
    </Routes>
  )
}

export default App
