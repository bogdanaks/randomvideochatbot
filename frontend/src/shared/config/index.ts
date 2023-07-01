export const config = {
  API_URL: process.env.REACT_APP_API_URL || "",
  PEER_HOST: process.env.REACT_APP_PEER_HOST || "",
  PEER_PORT: Number(process.env.REACT_APP_PEER_PORT) || 9000,
  PEER_PATH: process.env.REACT_APP_PEER_PATH || "",
  TEST_MODE: Boolean(process.env.REACT_APP_TEST_MODE) || false,
  NODE_ENV: process.env.REACT_APP_NODE_ENV || "development",
}
