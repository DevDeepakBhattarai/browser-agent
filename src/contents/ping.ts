import { listen } from "@plasmohq/messaging/message"

listen((req, res) => {
  const reqData = req.body as { name: string; message: string }
  if (reqData.name == "ping") {
    res.send({ message: "I am ready ! Woooooh" })
  }
})
