# AI Browser Agent

A powerful browser extension built with Plasmo and Next.js that acts as an intelligent agent to perform tasks on behalf of users.

## 🚀 Features

- Browser automation and task execution
- Intelligent web navigation and interaction
- Secure cookie and storage management
- Real-time web request monitoring
- Cross-origin communication support
- Modern UI with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

### Frontend (Browser Extension)

- **Framework**: Plasmo (v0.87.2)
- **UI Library**: React 18
- **Styling**:
  - Tailwind CSS
  - Radix UI Components
  - Framer Motion for animations
- **State Management**: Zustand
- **Type Safety**: TypeScript
- **Code Quality**: Prettier, ESLint

### Backend (Next.js API)

- Next.js API routes
- Upstash Redis for data storage
- TypeScript for type safety

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd allweone-extension
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
# Start the extension development server
pnpm dev

# Start the Next.js API server (in the next-js-api-and-frontend directory)
cd next-js-api-and-frontend
pnpm dev
```

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the extension for production
- `pnpm package` - Package the extension for distribution

### Project Structure

```
├── src/                    # Extension source code
├── next-js-api-and-frontend/  # Next.js API and frontend
│   ├── api/               # API routes
│   └── hooks/             # Custom React hooks
├── assets/                # Static assets
└── build/                 # Build output
```

## 🔐 Permissions

The extension requires the following permissions:

- `cookies` - For cookie management
- `scripting` - For executing scripts
- `storage` - For data persistence
- `tabs` - For tab management
- `webNavigation` - For navigation events
- `webRequest` - For request monitoring
- `activeTab` - For current tab access
- `debugger` - For debugging capabilities

## 🔌 External Connections

The extension can communicate with:

- `http://localhost:3000/*`
- `https://allweone.vercel.app/*`

## 🎨 UI Components

The project uses a modern component library built with:

- Radix UI for accessible components
- Tailwind CSS for styling
- Framer Motion for smooth animations
- Custom components for specific functionality

## 📝 License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
