import { listen } from "@plasmohq/messaging/message"

listen((req, res) => {
  const reqData = req.body as { type: string; message: string }
  if (reqData.type == "PING") {
    res.send({ message: "I am ready ! Wow" })
  }
})
