import { sendToContentScript } from "@plasmohq/messaging"

type TypeTextResponse = { success: boolean }
export async function typeText(
  tabId: number,
  selector: string,
  text: string,
  type: "write" | "paste"
): Promise<TypeTextResponse> {
  return await sendToContentScript({
    name: "type",
    tabId,
    body: {
      selector,
      text,
      type,
      name: "type"
    }
  })
}

type NavigateResponse = { success: boolean }
export async function navigate(
  tabId: number,
  url: string
): Promise<NavigateResponse> {
  return await sendToContentScript({
    name: "navigate",
    tabId,
    body: {
      url,
      name: "navigate"
    }
  })
}
type ScrollResponse = { success: boolean }
export async function scroll(
  tabId: number,
  direction: "up" | "down"
): Promise<ScrollResponse> {
  return await sendToContentScript({
    name: "scroll",
    tabId,
    body: {
      direction,
      name: "scroll"
    }
  })
}

type GetHTMLResponse = { html: string; success: boolean }
export async function getHTML(tabId: number): Promise<GetHTMLResponse> {
  return await sendToContentScript({
    name: "getHTML",
    tabId,
    body: {
      name: "getHTML"
    }
  })
}

type clickResponse = { success: boolean }
export async function click(
  tabId: number,
  selector: string
): Promise<clickResponse> {
  return await sendToContentScript({
    name: "click",
    tabId,
    body: {
      selector,
      name: "click"
    }
  })
}
