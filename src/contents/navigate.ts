import { listen } from "@plasmohq/messaging/message"

export type NavigateOptions = {
  name: "navigate"
  url: string
  tabId: number
}

listen(async (req, res) => {
  const reqData = req.body as NavigateOptions
  if (reqData.name !== "navigate") return

  await chrome.tabs.update(reqData.tabId, { url: reqData.url })

  res.send({
    success: true,
    message: `Navigating to ${reqData.url}`
  })
})
