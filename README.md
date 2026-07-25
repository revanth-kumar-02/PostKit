# PostKit V2

AI-powered Chrome Extension for creating and publishing high-performing, professional LinkedIn posts.

> **Phase 1 — Project Foundation & Architecture**  
> PostKit V2 provides a production-grade Chrome Extension (Manifest V3) architecture powered by React 19, Vite, TypeScript, and Tailwind CSS v4.

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **UI Framework** | React 19 | Declarative UI rendering |
| **Language** | TypeScript (Strict) | End-to-end type safety |
| **Build System** | Vite 8 + CRXJS | Fast HMR dev server & Chrome Extension bundling |
| **Styling** | Tailwind CSS v4 + Design Tokens | Modern dark theme CSS variable design system |
| **Extension Platform** | Chrome Manifest V3 | Service Worker, Side Panel, & Content Script |
| **Code Quality** | Oxlint & Prettier | Lightning-fast linting & formatting |

---

## V2 Folder Architecture

```text
postkit/
├── .env                    # Local environment secrets (VITE_GROQ_API_KEY)
├── .env.example            # Environment configuration template
├── manifest.json           # Chrome Extension Manifest V3
├── package.json            # Scripts & dependencies
├── tsconfig.json           # Root TypeScript configuration
├── vite.config.ts          # Vite build plugin configuration
│
├── docs/                   # System & architecture documentation
│   └── architecture.md     # Data flow and extension surface diagrams
│
├── public/                 # Extension icons & static public assets
│   └── icons/              # Extension toolbar & store icons (16, 48, 128px)
│
└── src/                    # Source Code
    ├── app/                # Main Application root wrappers & providers
    ├── components/         # Atomic reusable UI components (Button, Card, Badge, Typography)
    ├── config/             # Centralized configuration (env, constants, chrome, AI providers)
    ├── extension/          # Chrome Extension Surfaces
    │   ├── background/     # Service Worker lifecycle management
    │   ├── content/        # Content script injected into LinkedIn pages
    │   ├── sidepanel/      # Chrome Side Panel UI (Primary Workspace)
    │   └── popup/          # Toolbar quick-action popup UI
    ├── features/           # Feature-first application modules (Phase 2+)
    ├── hooks/              # Custom React hooks (useStorage, useEnvironment)
    ├── layouts/            # Layout shells (MainLayout, Header)
    ├── lib/                # Core utilities, Logger, ErrorHandler, Storage adapter
    ├── services/           # Business logic service abstractions
    ├── styles/             # Global CSS & Tailwind CSS v4 design tokens
    ├── types/              # Centralized TypeScript definitions
    └── utils/              # Pure utility functions (debounce, validation, formatting, browser)
```

---

## Development Setup

### 1. Prerequisites
- Node.js >= 20
- npm >= 10

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
Ensure your `.env` file contains:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server (HMR)
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
```

Outputs compiled assets to `dist/`.

---

## Loading PostKit V2 into Google Chrome

1. Run `npm run build` (or keep `npm run dev` running).
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in top-right corner).
4. Click **Load unpacked**.
5. Select the `dist/` directory inside this repository.
6. The **PostKit V2** icon will appear in your Chrome extension toolbar.
7. Click the icon to open the native **Chrome Side Panel**.

---

## Available NPM Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Starts Vite dev server with Hot Module Replacement |
| `npm run build` | Runs type-checking (`tsc -b`) and builds production output in `dist/` |
| `npm run typecheck` | Validates TypeScript types across the codebase |
| `npm run lint` | Runs Oxlint linter across all source files |
| `npm run format` | Runs Prettier code formatter |
