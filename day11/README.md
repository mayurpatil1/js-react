# Day 11 — TypeScript Basics

Run it:

```bash
npx tsc lesson.ts && node lesson.js
```

(Note: `ts-node` can be inconsistent depending on setup — compiling with
`tsc` first and running the plain `.js` output is more reliable, so
that's the workflow used from here on for standalone .ts files.)

To just type-check without producing a .js file:

```bash
npx tsc --noEmit lesson.ts
```
