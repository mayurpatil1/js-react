/* ============================================================
   DAY 13 — Typing functions & objects more deeply,
             plus tsconfig.json basics
   ============================================================

   Run it:
     npx tsc lesson.ts && node lesson.js
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Typing callbacks (functions passed as arguments)
// -------------------------------------------------------------
// This is the single most useful thing today — React is built
// almost entirely out of functions that take other functions as
// arguments (onClick handlers, .map() callbacks, useEffect, etc.)
function processItems<T>(
  items: T[],
  callback: (item: T, index: number) => void,
): void {
  items.forEach((item, index) => callback(item, index));
}

processItems(["a", "b", "c"], (item, index) => {
  console.log(`${index}: ${item}`); // TypeScript knows item is a string here
});

// A callback's own return type matters too — this one expects the
// callback to return a boolean (mirrors Array.filter's real signature):
function keepMatching<T>(items: T[], test: (item: T) => boolean): T[] {
  return items.filter(test);
}
console.log(keepMatching([1, 2, 3, 4, 5], (n) => n % 2 === 0)); // [2, 4]

// -------------------------------------------------------------
// 2. Rest parameters, typed
// -------------------------------------------------------------
// Java varargs equivalent (int... numbers), but typed like any
// other parameter — just with the ...
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// -------------------------------------------------------------
// 3. Function overloads — same function name, different valid
//    signatures (Java has this natively; TypeScript needs a
//    slightly different-looking syntax: declare the signatures
//    first, then ONE real implementation that handles all of them)
// -------------------------------------------------------------
function format(value: number): string;
function format(value: string): string;
function format(value: number | string): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.trim();
}
console.log(format(5)); // "5.00"
console.log(format("  hi  ")); // "hi"

// -------------------------------------------------------------
// 4. Index signatures — "an object with keys I don't know ahead
//    of time, but I know what type the VALUES are"
// -------------------------------------------------------------
// Java equivalent: Map<String, Integer>
interface ScoreBoard {
  [playerName: string]: number;
}
const scores: ScoreBoard = { Mayur: 10, Asha: 15 };
scores.Rohit = 7; // fine — any string key, must be a number value
console.log(scores);

// Record<K, V> — a built-in utility type that does the SAME job
// as an index signature, often preferred because it's shorter:
type Inventory = Record<string, number>;
const inventory: Inventory = { keyboards: 12, mice: 30 };
console.log(inventory);

// -------------------------------------------------------------
// 5. Nested object types
// -------------------------------------------------------------
interface Address {
  street: string;
  city: string;
}
interface Person {
  name: string;
  address: Address; // an interface can reference another interface
}

// Typed destructuring straight in a function parameter (Day 4 + Day 11
// combined) — a VERY common thing to see in a React component's props:
function printCity({ address: { city } }: Person): void {
  console.log(`Lives in ${city}`);
}
printCity({ name: "Mayur", address: { street: "MG Road", city: "Pune" } });

// -------------------------------------------------------------
// 6. `as const` — locking a value down to its EXACT literal type
// -------------------------------------------------------------
// Without `as const`, TypeScript would widen this array's type to
// just `string[]` (any string allowed). With it, TypeScript keeps
// the EXACT values, letting you build a precise union type from them.
const roles = ["admin", "editor", "viewer"] as const;
type Role = (typeof roles)[number]; // "admin" | "editor" | "viewer"

function checkAccess(role: Role): boolean {
  return role === "admin";
}
console.log(checkAccess("admin")); // true
// checkAccess("superuser"); // Error — not one of the three allowed roles

// This `as const` + `(typeof x)[number]` pattern is a common way to
// define a fixed set of allowed values ONCE and derive a type from
// it, instead of maintaining the union type separately by hand.

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Write a generic function `transformAll<T, U>(items: T[], transform: (item: T) => U): U[]`
//         that mirrors .map()'s type signature. Call it turning an
//         array of numbers into an array of strings.

function transformAll<T, U>(items: T[], transform: (item: T) => U): U[] {
  return items.map(transform);
}

const stringNumber = transformAll([1, 2, 3, 4], (n) => `Number : ${n}`);
console.log(stringNumber);

// TODO 2: Write a function `total(...prices: number[]): number` using
//         rest params, then call it with a handful of prices.

function total(...prices: number[]): number {
  return prices.reduce((sum, total) => sum + total, 0);
}

console.log(total(199, 499, 999, 150));

// TODO 3: Define an interface `Settings` with an index signature
//         where keys are strings and values are booleans (feature
//         flags). Create one with 2-3 flags and read one back.

interface Settings {
  [feature: string]: boolean;
}

const settings: Settings = {
  darkMode: true,
  notifications: false,
  betaFeatures: true,
};

console.log(settings.darkMode);

// TODO 4: Define nested interfaces `Company { name: string }` and
//         `Employee { name: string; company: Company }`. Write a
//         function that destructures straight to the company name
//         in its parameter list, like printCity above.

interface Company {
  name: string;
}

interface Employee {
  name: string;
  company: Company;
}

function printCompany({ company: { name } }: Employee): void {
  console.log(`Works at ${name}`);
}

printCompany({
  name: "Mayur",
  company: {
    name: "OpenAI",
  },
});

// TODO 5 (the payoff): Define `const sizes = ["small", "medium", "large"] as const;`
//         and derive a `Size` type from it the same way `Role` was
//         derived above. Write a function `priceForSize(size: Size): number`
//         that returns a different number per size using a switch.
//         Then in a comment, explain what would change (for better or
//         worse) if you'd written `const sizes: string[] = [...]`
//         instead of using `as const`.
const sizes = ["small", "medium", "large"] as const;

type Size = (typeof sizes)[number];

function priceForSize(size: Size): number {
  switch (size) {
    case "small":
      return 199;

    case "medium":
      return 299;

    case "large":
      return 399;
  }
}
console.log(priceForSize("small"));
console.log(priceForSize("medium"));
console.log(priceForSize("large"));
/*
Why use `as const`?

Using `as const`, TypeScript preserves the exact values:

type Size = "small" | "medium" | "large"

So only those three values are allowed.

If we had written:

const sizes: string[] = ["small", "medium", "large"];

then the element type would simply be `string`.

That means Size would become just `string`, so
priceForSize("extra-large") would compile, even though
our function doesn't handle it. We'd lose the safety of
restricting callers to the allowed values.
*/
