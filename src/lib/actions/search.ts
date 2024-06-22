export async function search(searchQuery: string) {
  const window = await chrome.windows.create({
    url: `https://www.google.com/search?q=${searchQuery}`,
    type: "popup",
    state: "maximized"
  })

  return window
}
