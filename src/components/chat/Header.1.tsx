import React from "react"

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex items-center">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage alt="Agent Avatar" src="/placeholder-user.jpg" />
          <AvatarFallback>AG</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium">Chat Assistant</h2>
      </div>
    </header>
  )
}
