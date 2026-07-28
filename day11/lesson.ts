/* ============================================================
   DAY 11 — TypeScript basics: type annotations, interfaces,
             type inference
   ============================================================

   Run with: node --experimental-strip-types lesson.ts
   (ts-node doesn't work on Node 22 in this project — its loader
   isn't compatible with Node 22's stricter ESM/CJS entry detection.
   The above uses Node's own built-in TypeScript stripping instead.)
   Or compile then run plain JS: npx tsc lesson.ts && node lesson.js

   This is the day where TypeScript closes the exact gap Day 1
   opened: JS lets a variable silently change type at runtime with
   nothing catching it. TypeScript adds Java-style static type
   checking back on top of JS, checked at COMPILE time (before you
   ever run the code) — same job the Java compiler already does
   for you every day.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Type annotations — the type comes AFTER the colon, not before
//    the variable name like Java
// -------------------------------------------------------------
// Java:       int age = 27;
// TypeScript: let age: number = 27;

let age: number = 100;
let username: string = "Mayur";
let isActive: boolean = true;

// Try uncommenting this line — TypeScript will refuse to compile:
// age = "twenty-seven"; // Error: Type 'string' is not assignable to type 'number'.
// This is the Day 1 dynamic-typing gap, closed. The mistake is
// caught here, at compile time, instead of surfacing as a bug
// three screens away at runtime.

// -------------------------------------------------------------
// 2. Type inference — TypeScript often figures the type out
//    itself, so you don't have to annotate everything
// -------------------------------------------------------------
let score = 95; // TypeScript infers `number` automatically — no annotation needed
// score = "high"; // still an error, even with no explicit annotation —
//                     TypeScript remembers what it inferred.

// Rule of thumb used by most real codebases: let inference handle
// simple local variables, but ALWAYS annotate function parameters
// and return types explicitly (see section 3) — inference can't
// see into a function from the outside, so parameters need it.

// -------------------------------------------------------------
// 3. Typing functions
// -------------------------------------------------------------
// Java: public int add(int a, int b) { return a + b; }
function add(a: number, b: number): number {
  return a + b;
}

// If a function returns nothing, type it `void` (same word as Java).
function logMessage(message: string): void {
  console.log(`LOG: ${message}`);
}

// Arrow function typing looks the same, just with the colon in a
// slightly different spot:
const multiply = (a: number, b: number): number => a * b;

console.log(add(2, 3), multiply(2, 3));
logMessage("functions are typed now");

// Optional parameters use `?` — same symbol you'll see on optional
// object properties in a moment:
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}
console.log(greet("Test"));
console.log(greet("Test", "Test"));

// -------------------------------------------------------------
// 4. Arrays and basic building-block types
// -------------------------------------------------------------
let scores: number[] = [90, 85, 77]; // array of numbers
let tags: Array<string> = ["js", "ts"]; // equivalent generic syntax, same meaning

// `any` turns OFF type checking for that variable — it's an escape
// hatch, and overusing it defeats the entire point of TypeScript.
// Avoid it; reach for it only as a last resort.
let dangerous: any = 5;
dangerous = "now a string"; // TypeScript won't complain — that's the problem with `any`

// `unknown` is the safer alternative to `any` — you CAN assign
// anything to it, but you can't USE it until you narrow/check its
// type first (closer to Java's Object, which also needs a cast
// before you can call type-specific methods on it).
let mystery: unknown = "could be anything";
// mystery.toUpperCase(); // Error — TypeScript won't let you call
//                             a method without knowing the type first
if (typeof mystery === "string") {
  console.log(mystery.toUpperCase()); // fine now — TypeScript "narrowed" it
}

// -------------------------------------------------------------
// 5. Interfaces — describing the SHAPE of an object
// -------------------------------------------------------------
// Java: an interface is a contract a class explicitly `implements`.
// TypeScript: an interface describes the shape data must have —
// ANY object with matching fields satisfies it, with no explicit
// "implements" needed. This is called STRUCTURAL typing ("if it
// looks like a duck..."), and it's the biggest conceptual
// difference from Java's NOMINAL typing (where the type's NAME,
// not just its shape, is what matters).
interface User {
  id: number;
  name: string;
  email: string;
  role?: string; // `?` = optional property
  readonly createdAt: string; // readonly = can be set once, never reassigned after
}

const user: User = {
  id: 1,
  name: "Mayur",
  email: "mayur@example.com",
  createdAt: "2026-01-01",
  // role is optional, so leaving it out is fine
};

// user.createdAt = "2026-02-01"; // Error — readonly fields can't be reassigned

function printUser(u: User): void {
  console.log(`${u.name} <${u.email}>${u.role ? " - " + u.role : ""}`);
}
printUser(user);

// The structural-typing payoff: this plain object was never declared
// "implements User" anywhere, yet it satisfies the interface because
// its SHAPE matches:
function describeAnyUserShaped(thing: { name: string; email: string }): string {
  return `${thing.name} <${thing.email}>`;
}
console.log(describeAnyUserShaped(user)); // works — user has those two fields
console.log(
  describeAnyUserShaped({ name: "Guest", email: "guest@example.com" }),
); // also works

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Declare a typed variable `price: number` and a typed
//         variable `productName: string`. Then try (and comment
//         out) assigning the wrong type to each, to see the
//         compiler error, before fixing it back.

let price: number = 99.99;
let productName: string = "Laptop";

// Wrong assignments (commented out to avoid compiler errors)

// price = "100";
// productName = 123;

// Correct assignments

price = 149.99;
productName = "Mechanical Keyboard";

console.log(price);
console.log(productName);

// TODO 2: Write a function `calculateDiscount(price: number, percent: number): number`
//         that returns the discounted price. Call it with numbers.

function calculateDiscount(price: number, percent: number): number {
  return price - (price * percent) / 100;
}

const finalPrice = calculateDiscount(100, 20);

console.log(finalPrice);

// TODO 3: Define an interface `Product` with: id (number), name
//         (string), price (number), an OPTIONAL `description`
//         (string), and a readonly `sku` (string). Create one
//         object of type Product and log it.

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string; // optional property
  readonly sku: string; // cannot be changed after creation
}

const product: Product = {
  id: 1,
  name: "Laptop",
  price: 999,
  description: "Gaming laptop with 16GB RAM",
  sku: "LAP-001",
};

console.log(product);

// Error: Cannot assign to 'sku' because it is a read-only property.
// product.sku = "NEW-SKU";

// TODO 4: Write a function `applyDiscountToProduct(product: Product, percent: number): Product`
//         that returns a NEW product object (use spread — Day 4!)
//         with the price reduced by percent, leaving the original
//         untouched.

function applyDiscountToProduct(product: Product, percent: number): Product {
  return {
    ...product,
    price: product.price - (product.price * percent) / 100,
  };
}

const originalProduct: Product = {
  id: 1,
  name: "Laptop",
  price: 1000,
  description: "Gaming laptop",
  sku: "LAP-001",
};

const discountedProduct = applyDiscountToProduct(originalProduct, 20);

console.log("Original:", originalProduct);
console.log("Discounted:", discountedProduct);

// TODO 5 (the payoff): Try passing a plain object literal — NOT
//         declared as type Product — into applyDiscountToProduct,
//         as long as it has all the required fields. Confirm it
//         works with no "implements Product" anywhere. Then in a
//         comment, explain in your own words the difference between
//         this "structural" typing and Java's "nominal" typing,
//         where a class must explicitly declare `implements SomeInterface`.

const plainProduct = {
  id: 2,
  name: "Keyboard",
  price: 200,
  description: "Mechanical keyboard",
  sku: "KEY-001",
};

const discounted = applyDiscountToProduct(plainProduct, 10);

console.log(discounted);

/*
TypeScript uses structural typing.

It does not care whether an object was created using a Product interface
or whether it says "implements Product". It only checks if the object
has the required properties with the correct types.

Here, plainProduct works because it has:
- id: number
- name: string
- price: number
- sku: string

Java uses nominal typing.

In Java, a class must explicitly declare that it follows an interface:

class Laptop implements Product {
   ...
}

Even if another class has the exact same fields and methods, Java will
not consider it a Product unless it explicitly implements that interface.

TypeScript asks:
"Does this object have the correct shape?"

Java asks:
"Did this class explicitly declare this relationship?"
*/
