/**
 * v0 by Vercel.
 * @see https://v0.dev/t/w8UHuEUujL7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import "@/style.css"

import ChatList from "@/components/chat/ChatList"

export default function Component() {
  return (
    <div key="1" className="flex h-screen w-full flex-col">
      <ChatList></ChatList>
      <div className="sticky bottom-0 bg-white dark:bg-gray-950 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            size="icon"
            variant="ghost">
            <PaperclipIcon className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <div className="relative flex-1">
            <Textarea
              className="min-h-[20px] rounded-2xl resize-none p-3 pr-16 border border-gray-200 shadow-sm dark:border-gray-800"
              placeholder="Type your message..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            size="icon"
            variant="ghost">
            <MicIcon className="h-5 w-5" />
            <span className="sr-only">Record audio</span>
          </Button>
          <Button className="w-6 h-6" size="icon" type="submit">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
