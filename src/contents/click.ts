import { listen } from "@plasmohq/messaging/message"

export type ClickOptions = {
  name: "click"
  selector: string
}

listen(async (req, res) => {
  const reqData = req.body as ClickOptions
  if (reqData.name !== "click") return

  const element = document.querySelector(reqData.selector)

  if (!element)
    return res.send({ success: false, message: "Element not found" })

  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
  })

  // Dispatch the event
  element.dispatchEvent(event)
  res.send({
    success: true
  })
})
