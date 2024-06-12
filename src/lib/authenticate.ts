export async function Authenticate() {
  console.log(
    process.env.PLASMO_PUBLIC_WEBSITE_URL,
    process.env.PLASMO_PUBLIC_AUTH_TOKEN_NAME,
    process.env.PLASMO_PUBLIC_LOGIN_URL
  )
  const cookies = await chrome.cookies.getAll({
    url: process.env.PLASMO_PUBLIC_WEBSITE_URL
  })
  console.log(cookies)

  const authToken = cookies.find(
    (cookie) => cookie.name === "__Secure-next-auth.session-token"
  ).value

  if (!authToken) {
    throw new Error("No auth token available")
  }
  const response = await fetch(process.env.PLASMO_PUBLIC_LOGIN_URL, {
    headers: { Authorization: authToken }
  })
  const data = await response.json()
  return data
}
