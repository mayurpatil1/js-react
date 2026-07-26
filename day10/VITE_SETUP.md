# Create your first React + TypeScript project with Vite

Run this on your own machine, in a folder separate from `js-react-learning`
(this scaffolds a whole real project with its own `node_modules`, so it
shouldn't live nested inside the notes repo).

## 1. The project

```bash
npm create vite@latest my-first-react-app -- --template react-ts
cd my-first-react-app
npm install
npm run dev
```

`npm run dev` starts a local dev server (usually `http://localhost:5173`)
with hot reload — save a file, the browser updates instantly, no manual
refresh. Open that URL and you should see Vite's default welcome page.

## 2. What you'll find inside

```
my-first-react-app/
├── index.html          <- the ONE html page — a single-page app
├── package.json        <- see PACKAGE_JSON_GUIDE.md — dev/build/preview scripts live here
├── vite.config.ts       <- Vite's own config (plugins, build options)
├── tsconfig.json        <- TypeScript compiler settings (Day 11+)
├── src/
│   ├── main.tsx         <- entry point: mounts <App /> into index.html's #root div
│   ├── App.tsx          <- the root component — start editing here
│   └── App.css, index.css
└── node_modules/        <- installed packages (never committed to git)
```

The flow: `index.html` has one `<div id="root"></div>`. `main.tsx` grabs
that div and tells React to render `<App />` into it. Everything you build
from here on is just components rendered inside `App`.

## 3. Useful scripts already wired up for you

- `npm run dev` — local dev server with hot reload (what you'll use 95% of
  the time while building).
- `npm run build` — produces an optimized production build in `dist/`
  (this is what actually gets deployed, later in Phase 6).
- `npm run preview` — serves the production build locally so you can
  sanity-check it before deploying.
