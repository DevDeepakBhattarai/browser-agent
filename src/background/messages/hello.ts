import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req.body)
  console.log("hello there mate what is up")
  res.send({ success: true })
}

export default handler
