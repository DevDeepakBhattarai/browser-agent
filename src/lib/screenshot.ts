export async function takeScreenshot(windowId: number) {
  const screenshot = await chrome.tabs.captureVisibleTab(windowId, {
    format: "jpeg"
  })
  return screenshot
}
