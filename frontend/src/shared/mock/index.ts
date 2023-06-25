export const mockUserData = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090780,
    first_name: "Bogdan",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData2 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090777,
    first_name: "Oleg",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData3 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090666,
    first_name: "Ivan",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const mockUserData4 = {
  query_id: "AAGc6AYzAAAAAJzoBjOa-6Y_",
  user: {
    id: 856090555,
    first_name: "Petr",
    last_name: "A",
    username: "bogdanaks",
    language_code: "ru",
    is_premium: true,
  },
  auth_date: "1656771179",
  hash: "8ac4765d56b0f95932b2a129c0729647e86cc0d3c9a375c768e4e9dcaff352f9",
}

export const getMockTgUser = (userId: string): TgUser => {
  if (userId === "856090777") return mockUserData2.user
  if (userId === "856090666") return mockUserData3.user
  if (userId === "856090555") return mockUserData4.user

  return mockUserData.user
}

export const getMockTgInitData = (): string => {
  return "query_id=AAGc6AYzAAAAAJzoBjMvWBXV&user=%7B%22id%22%3A856090780%2C%22first_name%22%3A%22Bogdan%22%2C%22last_name%22%3A%22A%22%2C%22username%22%3A%22bogdanaks%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1687557783&hash=7e82cfdcc1ac588b775bcfc9525c8f3672b64d589bd3ae49f3a89629a075954d"
}

// const mockUserEntity = {
//   id: 856090780,
//   first_name: "Bogdan",
//   last_name: "A",
//   language_code: "ru",
//   is_premium: true,
//   photo_url: "/photos/856090780.jpg",
//   gender: "M",
//   age: 18,
//   position: 1,
//   created_at: "2023-05-27T02:06:01.507Z",
//   updated_at: "2023-05-27T02:06:01.507Z",
//   hearts: 3,
// }
