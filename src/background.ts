chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message)
  if (message.type == "REQ_COOKIE") {
    const cookies = await chrome.cookies.getAll({
      url: "https://allweone.vercel.app"
    })
    console.log(cookies)
    await fetch("http://localhost:3000/api/auth", {
      headers: { Authorization: "Yo what is up" }
    })

    await chrome.sidePanel.open({ tabId: sender.tab.id })

    sendResponse({ cookies })
  }
})
chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    console.log(request)
    sendResponse({ Yo: "What is up mate" })
  }
)
