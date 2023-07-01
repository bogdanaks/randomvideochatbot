export const countries = [
  {
    code: "RU",
    title: "Россия",
  },
  {
    code: "UA",
    title: "Україна",
  },
  {
    code: "DE",
    title: "Germany",
  },
  {
    code: "IT",
    title: "Italy",
  },
  {
    code: "US",
    title: "USA",
  },
  {
    code: "CN",
    title: "China",
  },
]

export const getCountryByCode = (code: string) => {
  return countries.find((i) => i.code.toLowerCase() === code.toLowerCase())
}
