import { listen } from "@plasmohq/messaging/message"

export type NavigateOptions = {
  name: "navigate"
  url: string
}

listen(async (req, res) => {
  const reqData = req.body as NavigateOptions
  if (reqData.name !== "navigate") return

  window.location.href = reqData.url

  res.send({
    success: true
  })
})
