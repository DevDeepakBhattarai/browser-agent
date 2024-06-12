import { Authenticate } from "@/lib/authenticate"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const reqBody = req.body as { name: "send_request" }
  let response
  try {
    response = await Authenticate()
    res.send(response)
  } catch (e) {
    console.log(e)
    res.send("Cannot do it")
  }
}
export default handler
