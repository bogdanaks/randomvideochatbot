import "reflect-metadata"
import * as dotenv from "dotenv"
dotenv.config()
import { createServer } from "http"
import { PeerServer } from "peer"

import express, { Express, Router } from "express"

import { appConfig } from "./config"
import { AppDataSource } from "./common/data-source"
import { DI } from "./common/di"
import { scopePerRequest } from "awilix-express"
import { Server } from "socket.io"
import { asValue } from "awilix"
import cors from "cors"
import path from "path"
import routes from "./modules"
import { getPeerServerConfig } from "./modules/peer-server"

export const app: Express = express()
export const router: Router = express.Router()
export const server = createServer(app)
export const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 60 * 1000, // 1min
  },
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

AppDataSource.initialize()
  .then(async () => {
    console.log("Database run on port 5432")
    const port: number = appConfig.port || 55555

    app.enable("trust proxy")

    const route = path.join(__dirname, "../static")
    app.use(express.static(route))
    app.use(
      cors({
        origin: "*",
      })
    )
    app.use(scopePerRequest(DI))
    app.use(express.json())
    app.use("/api/v1", routes)

    app.get(
      "/api/v1/status",
      (req, res, next) => {
        console.log("the response will be sent by the next function ...")
        next()
      },
      function (req, res) {
        res.send("Ok!")
      }
    )

    app.get(
      "/rvc",
      (req, res, next) => {
        console.log("the response will be sent by the next function ...")
        next()
      },
      function (req, res) {
        res.send("RVC!")
      }
    )

    DI.register({
      io: asValue(io),
    })
    await DI.cradle.ioConnector.connect()

    server.listen(port, () => {
      console.log(`App run on port ${port} :)`)
    })

    const peerConfig = getPeerServerConfig()
    const peerServer = PeerServer(peerConfig)

    peerServer.on("connection", (client) => {
      console.log("Peer Server connect client:", client.getId())
    })

    peerServer.on("error", (err) => {
      console.log("Peer Server error", err)
    })
  })
  .catch(async (err) => {
    console.error("Error initialization:", err)
  })
