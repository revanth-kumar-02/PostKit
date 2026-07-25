# PostKit

AI-powered Chrome Extension for creating and publishing professional LinkedIn posts.

**Personal productivity tool** — reduces LinkedIn posting workflow from ~20 minutes to under 2 minutes.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| CRXJS | Chrome Extension Vite plugin (HMR) |
| Manifest V3 | Chrome Extension platform |
| Groq API | Cloud AI inference |
| Ollama | Local AI inference |

---

## Folder Structure

```text
postkit/
├── public/
│   └── icons/              # Extension icons (16, 48, 128px)
│
├── docs/
│   ├── architecture.md     # Extension architecture & data flow
│   ├── roadmap.md          # Development phases
│   ├── prompts.md          # AI prompt templates
│   └── api.md              # AI API integration notes
│
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   ├── background/         # Service worker (extension lifecycle)
│   ├── components/         # Shared reusable UI components
│   ├── content/            # Content script (LinkedIn page injection)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core libraries & API clients
│   ├── popup/              # Extension popup UI
│   ├── services/           # Business logic services
│   ├── sidepanel/          # Chrome Side Panel UI (main workspace)
│   ├── styles/             # Global CSS & Tailwind entry
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Shared utility functions
│
├── manifest.json           # Chrome Extension Manifest V3
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Development

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Starts Vite dev server with HMR via CRXJS. The extension auto-reloads on code changes.

### Production Build

```bash
npm run build
```

Outputs to `dist/`. This is what you load into Chrome.

### Lint & Format

```bash
npm run lint        # Run Oxlint
npm run format      # Run Prettier
```

---

## Loading the Extension in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `dist/` folder
6. PostKit icon appears in the toolbar

### During Development

When using `npm run dev`, CRXJS serves the extension with hot reload. After the first `Load unpacked`, subsequent code changes apply automatically without needing to reload the extension.

---

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `tsc -b && vite build` | Type-check & production build |
| `lint` | `oxlint` | Run linter |
| `format` | `prettier --write "src/**/*"` | Format source files |
| `preview` | `vite preview` | Preview production build |

---

## Coding Conventions

- **Feature-based organization** — each extension surface (popup, sidepanel, background, content) has its own directory
- **Named exports** — prefer `export function Foo()` over default exports
- **Strict TypeScript** — `strict: true`, no `any` unless unavoidable
- **Small components** — one component per file, focused responsibility
- **Path aliases** — use `@/` to import from `src/` (e.g., `import { Foo } from '@/components/Foo'`)
- **Tailwind CSS** — use utility classes, extract components for repeated patterns
- **No dead code** — remove unused imports, variables, and functions
- **Prettier formatting** — single quotes, trailing commas, 2-space indent
