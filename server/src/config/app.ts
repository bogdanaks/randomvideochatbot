import assert from "assert"

assert(process.env.PORT, "Env PORT undefined")
assert(process.env.TG_TOKEN, "Env TG_TOKEN undefined")
assert(process.env.REDIS_HOST, "Env REDIS_HOST undefined")
assert(process.env.SSL_KEY_PATH, "Env SSL_KEY_PATH undefined")
assert(process.env.SSL_CERT_PATH, "Env SSL_CERT_PATH undefined")
assert(process.env.PEER_PORT, "Env PEER_PORT undefined")
assert(process.env.PEER_PATH, "Env PEER_PATH undefined")
assert(process.env.PEER_KEY, "Env PEER_KEY undefined")
assert(process.env.NODE_ENV, "Env NODE_ENV undefined")

export const appConfig = {
  port: Number(process.env.PORT),
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisHost: process.env.REDIS_HOST || "",
  tgToken: process.env.TG_TOKEN || "",
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCertPath: process.env.SSL_CERT_PATH,
  peerPort: Number(process.env.PEER_PORT) || 9000,
  peerPath: process.env.PEER_PATH || "",
  peerKey: process.env.PEER_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development",
}
