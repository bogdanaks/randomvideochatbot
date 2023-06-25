import { appConfig } from "@/config/index"
import fs from "fs"
import { GetFilePath, GetUserPhotos } from "./types"
import axios from "axios"
import * as stream from "stream"
import { promisify } from "util"
import path from "path"
import crypto from "crypto"

const finished = promisify(stream.finished)

export class TelegramService {
  constructor() {}

  async getFilePath(file_id: string) {
    try {
      const { data } = await axios.post<GetFilePath>(
        `https://api.telegram.org/bot${appConfig.tgToken}/getFile`,
        { file_id }
      )
      if (!data.ok) {
        return null
      }

      return data.result.file_path
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async saveUserPhoto(file_path: string, user_id: string) {
    try {
      const route = path.join(__dirname, `../../../static/photos/${user_id}.jpg`) // TODO FIX IT
      const writer = fs.createWriteStream(route)

      return axios({
        method: "get",
        url: `https://api.telegram.org/file/bot${appConfig.tgToken}/${file_path}`,
        responseType: "stream",
      }).then((response) => {
        response.data.pipe(writer)
        return finished(writer)
      })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  verifyInitData(initData: string) {
    const encoded = decodeURIComponent(initData)
    const secret = crypto.createHmac("sha256", "WebAppData").update(appConfig.tgToken)

    const arr = encoded.split("&")
    const hashIndex = arr.findIndex((str) => str.startsWith("hash="))
    const hash = arr.splice(hashIndex)[0].split("=")[1]
    arr.sort((a, b) => a.localeCompare(b))
    const dataCheckString = arr.join("\n")
    const _hash = crypto.createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex")

    return _hash === hash
  }
}
