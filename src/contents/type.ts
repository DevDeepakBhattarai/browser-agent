import { typeText, type TypeTextOptions } from "@/lib/type"

import { listen } from "@plasmohq/messaging/message"

listen((req, res) => {
  const reqData = req.body as TypeTextOptions
  typeText(reqData)
})
