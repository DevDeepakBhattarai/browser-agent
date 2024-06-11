export type ScreenshotOptions = {
  type: "fullpage" | "screen"
  save?: boolean
  windowId: number
}

export async function takeScreenshot({
  type,
  save,
  windowId
}: ScreenshotOptions) {
  const screenshot = await chrome.tabs.captureVisibleTab(windowId, {
    format: "jpeg"
  })
  return screenshot
}
