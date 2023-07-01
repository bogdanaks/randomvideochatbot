import path from "path"
import fs from "fs"
import { appConfig } from "@/config"

export const getPeerServerConfig = () => {
  if (appConfig.nodeEnv === "development") {
    return {
      port: 9000,
      key: "rvc",
      path: "/peerjs",
    }
  }

  const privateKey = fs.readFileSync(path.join(__dirname, "../../../ssl/privkey.pem")).toString()
  const certificate = fs.readFileSync(path.join(__dirname, "../../../ssl/fullchain.pem")).toString()
  const credentials = { key: privateKey, cert: certificate }

  return {
    port: 9000,
    key: "rvc",
    path: "/peerjs",
    proxied: true,
    corsOptions: {
      origin: "*",
    },
    ssl: credentials,
  }
}
