import { listen } from "@plasmohq/messaging/message"

export type ClickOptions = {
  name: "click"
  selector: string
}

listen(async (req, res) => {
  const reqData = req.body as ClickOptions
  if (reqData.name !== "click") return

  const element = document.querySelector(reqData.selector) as HTMLElement
  element?.focus()
  element?.click()

  res.send({
    success: true,
    click: true
  })
})
