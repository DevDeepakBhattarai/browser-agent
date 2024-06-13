export async function navigate(tabId: number, url: string) {
  const tab = await chrome.tabs.get(tabId)
  console.log(tab)

  if (tab.status === "loading") {
    await new Promise<void>((resolve) => {
      const listener = async (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo
      ) => {
        if (tabId === tab.id && changeInfo.status === "complete") {
          const tab = await chrome.tabs.get(tabId)
          console.log(tab)
          chrome.tabs.onUpdated.removeListener(listener) // Remove listener once page is loaded
          resolve()
        }
      }

      chrome.tabs.onUpdated.addListener(listener)
    })
  }

  const updatedTab = await chrome.tabs.update(tabId, { url: url })
  console.log(updatedTab)

  await new Promise<void>((resolve) => {
    const listener = async (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo
    ) => {
      if (tabId === updatedTab.id && changeInfo.status === "complete") {
        const tab = await chrome.tabs.get(tabId)
        console.log(tab)
        console.log(updatedTab)
        chrome.tabs.onUpdated.removeListener(listener) // Remove listener once page is loaded
        resolve()
      }
    }
    chrome.tabs.onUpdated.addListener(listener)
  })

  return { success: true, tabId: true }
}
