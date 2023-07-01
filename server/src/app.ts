import "reflect-metadata"
import * as dotenv from "dotenv"
dotenv.config()
import { createServer } from "http"
import { ExpressPeerServer } from "peer"

import express, { Express, Router } from "express"

import { appConfig } from "./config"
import { AppDataSource } from "./common/data-source"
import { DI } from "./common/di"
import { scopePerRequest } from "awilix-express"
import { Server } from "socket.io"
import { asValue } from "awilix"
import cors from "cors"
import path from "path"
import fs from "fs"
import routes from "./modules"
import { ServerOptions } from "https"

const privateKey = fs.readFileSync(path.join(__dirname, "../ssl/privkey.pem")).toString()
const certificate = fs.readFileSync(path.join(__dirname, "../ssl/fullchain.pem")).toString()
const credentials: ServerOptions = { key: privateKey, cert: certificate }

export const app: Express = express()
export const router: Router = express.Router()
export const server = createServer(credentials, app)
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

    const peerServer = ExpressPeerServer(server, {
      path: "/",
      key: appConfig.peerKey,
      proxied: true,
    })
    app.use("/peerjs", peerServer)

    // peerServer.on("connection", (client) => {
    //   console.log("Peer Server connect client:", client.getId())
    // })

    // peerServer.on("error", (err) => {
    //   console.log("Peer Server error", err)
    // })
  })
  .catch(async (err) => {
    console.error("Error initialization:", err)
  })
