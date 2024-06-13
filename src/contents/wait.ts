import { sleep } from "@/lib/utils"

import { listen } from "@plasmohq/messaging/message"

export type WaitOptions = {
  name: "wait"
}

listen(async (req, res) => {
  const reqData = req.body as WaitOptions
  if (reqData.name !== "wait") return

  // TODO Have a better mechanism to wait until everything loads in the page
  await sleep(4000)

  res.send({
    success: true,
    navigate: true
  })
})
