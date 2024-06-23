export async function Authenticate() {
  const cookies = await chrome.cookies.getAll({
    url: process.env.PLASMO_PUBLIC_WEBSITE_URL
  })
  console.log(cookies)

  const authToken = cookies.find(
    (cookie) => cookie.name === process.env.PLASMO_PUBLIC_AUTH_TOKEN_NAME
  ).value

  if (!authToken) {
    throw new Error("No auth token available")
  }

  const createCookieHeader = (cookies: chrome.cookies.Cookie[]): string => {
    return cookies
      .map((cookie) => {
        let cookieString = `${cookie.name}=${cookie.value}`
        return cookieString
      })
      .join("; ")
  }

  // Example usage in a fetch request
  const headers = new Headers()
  headers.append("Cookie", createCookieHeader(cookies))
  headers.append("Authorization", authToken)

  const response = await fetch(process.env.PLASMO_PUBLIC_LOGIN_URL, {
    headers
  })
  const data = await response.json()
  return data
}
