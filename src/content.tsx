import { CountButton } from "@/features/count-button"
import cssText from "data-text:@/style.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:3000*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-top-32 plasmo-right-8">
      <CountButton />
    </div>
  )
}

export default PlasmoOverlay
