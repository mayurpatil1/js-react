# tsconfig.json, field by field

The file in this folder actually compiles `lesson.ts` — run it with:

```bash
npx tsc -p tsconfig.json
node dist/lesson.js
```

## What each option does

- **target** — which JS version the output is compiled DOWN to.
  `"ES2020"` means the output can use modern syntax (optional
  chaining, etc.) and still run on reasonably recent Node/browsers.
  Closest Java comparison: compiling with `--release 17` vs `--release 8` —
  picking how modern a runtime you're willing to require.

- **module** — how `import`/`export` get compiled into the output.
  `"CommonJS"` here so the compiled file runs directly with plain
  `node dist/lesson.js`, same as Day 8/10's require()-based files.
  A Vite/React project uses `"ESNext"` instead, since the bundler
  handles modules itself and ships ES modules straight to the browser.

- **strict** — turns on ALL of TypeScript's strictness checks at
  once (no implicit `any`, strict null checks, etc.). Always keep
  this `true` — it's the difference between TypeScript actually
  catching bugs and TypeScript just being decoration. Every lesson
  from Day 11 onward has been written to pass under `strict: true`.

- **esModuleInterop** — smooths over some old CommonJS/ES-module
  interop quirks so `import` statements behave the way you'd expect
  even against older CommonJS packages. Turn it on and forget about it.

- **skipLibCheck** — skips type-checking inside `.d.ts` library files
  (other packages' type definitions) to speed up compilation. Doesn't
  affect the safety of YOUR code, just speeds up the build.

- **outDir** — where compiled `.js` files land (`./dist` here). Never
  commit this folder to git — it's generated from your `.ts` source,
  same idea as not committing compiled `.class` files.

- **rootDir** — the root of your source files, used so the output
  folder structure mirrors your source folder structure.

- **include** — which files/folders this config applies to. A real
  project usually has `"include": ["src"]` rather than naming files
  individually.

## What Vite does differently

When you scaffolded a project in Day 10 (`npm create vite@latest ...
--template react-ts`), it generated its own `tsconfig.json` already
tuned for a browser + React project — `"jsx": "react-jsx"` (so `.tsx`
files work), `"module": "ESNext"`, `"lib"` including `"DOM"` (so
`document`, `window`, etc. are recognized types). You won't usually
need to touch it, but now you know what's actually in there and why,
rather than it being an opaque generated file.
