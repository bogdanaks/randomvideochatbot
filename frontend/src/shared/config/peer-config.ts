import { config } from "./index"

export const peerConfig =
  config.NODE_ENV === "development"
    ? {
        host: config.PEER_HOST,
        path: "/peerjs",
        port: 9000,
        key: "rvc",
        debug: 2,
        secure: false,
      }
    : {
        host: config.PEER_HOST,
        path: "/peerjs",
        port: 443,
        key: "rvc",
        debug: 2,
        secure: true,
      }
