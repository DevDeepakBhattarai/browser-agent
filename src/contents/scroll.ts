import { listen } from "@plasmohq/messaging/message"

export type ScrollOptions = {
  name: "scroll"
  direction: "up" | "down"
}

listen(async (req, res) => {
  const reqData = req.body as ScrollOptions
  if (reqData.name !== "scroll") return

  const amount = window.innerHeight

  if (reqData.direction === "down") {
    window.scrollBy(0, amount)
    res.send({
      success: true,
      message: `Scrolled down by ${amount} pixels`,
      scroll: true
    })
  } else if (reqData.direction === "up") {
    window.scrollBy(0, -amount)
    res.send({
      success: true,
      message: `Scrolled up by ${amount} pixels`,
      scroll: true
    })
  } else {
    res.send({
      success: false,
      scroll: true
    })
  }
})
