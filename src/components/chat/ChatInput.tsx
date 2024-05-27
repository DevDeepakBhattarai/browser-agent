import { useInput, type PreviewImage } from "@/states/chat-input-state"
import { MicIcon, Paperclip, SendIcon } from "lucide-react"
import React, { useRef } from "react"
import type { ClipboardEvent } from "react"

import { Button } from "../ui/button"
import { Input as InputPrimitive } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import ImagePreview from "./ImagePreview"

const MAX_HEIGHT = 100

const TextAreaResizeExample = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { previewImages, setPreviewImages, setPrompt } = useInput()

  return (
    <div className="group relative h-auto rounded-md">
      <InputPrimitive
        onChange={handleFileInputChange}
        type="file"
        multiple
        id="file-input"
        className="hidden"
        ref={fileInputRef}
      />
      {previewImages.length > 0 && <ImagePreview></ImagePreview>}
      <div className="flex items-center  min-h-9 h-auto justify-center gap-2 overflow-clip">
        <Label
          className="grid aspect-square h-9 place-items-center rounded-full p-0 hover:bg-accent"
          htmlFor="file-input">
          <Paperclip height={20} width={20} />
        </Label>

        <Textarea
          ref={textareaRef}
          autoFocus
          rows={1}
          className="w-full min-h-10 flex-1 resize-none text-black"
          placeholder="What's next ?"
          onChange={(e) => setPrompt(e.target.value)}
          onInput={handleInput}
          onPaste={handlePaste}></Textarea>

        <Button
          className="text-white hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          size="icon"
          variant="ghost">
          <MicIcon className="h-5 w-5" />
          <span className="sr-only">Record audio</span>
        </Button>

        <Button
          className="text-white hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          size="icon"
          type="submit">
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  )

  function handleInput() {
    adjustHeight()
  }

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const items = event.clipboardData?.items || []
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) {
          addImages(file)
        }
      }
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    console.log(files)
    if (files && files?.length > 0) {
      for (const file of files) {
        if (file?.type.startsWith("image/")) {
          addImages(file)
        }
      }
    }
  }

  function addImages(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result)
        setPreviewImages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            url: e.target?.result as string
          } as PreviewImage
        ])
    }
    reader.readAsDataURL(file)
  }

  function adjustHeight() {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto" // Reset height to auto to shrink if necessary
      textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px` // Set height to scroll height or maxHeight, whichever is smaller
    }
  }
}

export default TextAreaResizeExample
