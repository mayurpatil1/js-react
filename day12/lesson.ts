/* ============================================================
   DAY 12 — TypeScript: generics, union/intersection types,
             and utility types (Partial, Pick, Omit)
   ============================================================

   Run it:
     npx tsc lesson.ts && node lesson.js
   (ts-node was unreliable last time — tsc + node is the workflow
   from here on for standalone .ts files.)
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Generics — a type that's a PLACEHOLDER, filled in per use
// -------------------------------------------------------------
// Java: public <T> T firstElement(List<T> list) { return list.get(0); }
// TypeScript's <T> means exactly the same thing: "this function
// works with any type, and whichever type comes in is what comes
// out" — without generics, you'd need `any` (losing all type
// safety) or one function per type (repetitive).

function firstElement<T>(list: T[]): T {
  return list[0];
}

const firstNumber = firstElement([1, 2, 3]); // T inferred as number
const firstName = firstElement(["Mayur", "Rohit"]); // T inferred as string
console.log(firstNumber, firstName);
// firstNumber is KNOWN to be a number by TypeScript — no cast needed,
// unlike Java's pre-generics Object-and-cast era.

// Generic interfaces work the same way — a reusable "shape" that's
// parameterized by whatever type you plug in:
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Same interface, two totally different shapes of `data`:
const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Mayur" },
  success: true,
};

const numbersResponse: ApiResponse<number[]> = {
  data: [1, 2, 3],
  success: true,
};

console.log(userResponse.data.name, numbersResponse.data);
// This EXACT pattern (ApiResponse<T>) is what you'll write constantly
// once you're typing responses from your Spring Boot API in Phase 3+.

// Generic constraints — "T can be ANYTHING, as long as it has at
// least these fields" (this `extends` means something different
// from class inheritance — here it means "must be compatible with"):
function logId<T extends { id: number }>(item: T): void {
  console.log(`id: ${item.id}`);
}
logId({ id: 1, name: "Mayur" }); // fine — has an id field
// logId({ name: "no id here" }); // Error — missing the required `id` field

// -------------------------------------------------------------
// 2. Union types — "this value is ONE OF these types"
// -------------------------------------------------------------
// Java doesn't really have an equivalent short of using a common
// superclass/interface. TypeScript lets you say "exactly this set
// of possibilities" directly with `|`.
type Status = "loading" | "success" | "error"; // a union of STRING LITERALS,
// not just "any string"

function describeStatus(status: Status): string {
  // TypeScript checks this switch covers real Status values —
  // typo "succes" here would be a compile error, not a silent bug.
  switch (status) {
    case "loading":
      return "Please wait...";
    case "success":
      return "Done!";
    case "error":
      return "Something went wrong.";
  }
}
console.log(describeStatus("loading"));

// Unions of different SHAPES, narrowed with typeof (a common React
// pattern: a value that's "either a string id or a full object"):
function getUserLabel(user: string | { name: string }): string {
  if (typeof user === "string") {
    return user; // TypeScript knows it's a string here — "narrowed"
  }
  return user.name; // and knows it's the object here, in this branch
}
console.log(getUserLabel("guest-id-123"));
console.log(getUserLabel({ name: "Mayur" }));

// -------------------------------------------------------------
// 3. Intersection types — "this value has ALL of these shapes combined"
// -------------------------------------------------------------
// Where `|` means "one of", `&` means "all of, merged together" —
// closer to Java's multiple-interface implementation
// (class Foo implements A, B), except here it's just a type, no class needed.
interface Timestamped {
  createdAt: string;
}
interface Named {
  name: string;
}

type NamedAndTimestamped = Named & Timestamped;

const signupEvent: NamedAndTimestamped = {
  name: "Signup",
  createdAt: "2026-01-01",
};
console.log(signupEvent);

// -------------------------------------------------------------
// 4. Utility types — built-in generics that TRANSFORM a type
// -------------------------------------------------------------
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Partial<T> — every field becomes optional. Extremely common for
// "update" operations, where you only send the fields that changed
// (PATCH-style, same idea as a partial DTO in a Spring Boot update
// endpoint).
function updateProduct(product: Product, changes: Partial<Product>): Product {
  return { ...product, ...changes }; // Day 4: spread, later field wins
}

const original: Product = {
  id: 1,
  name: "Mouse",
  price: 799,
  description: "Wireless",
};
const updated = updateProduct(original, { price: 699 }); // only price, rest stays
console.log(updated);

// Pick<T, Keys> — build a NEW type using only SOME fields from an
// existing one. Common for "summary" views that don't need everything.
type ProductSummary = Pick<Product, "id" | "name" | "price">;
const summary: ProductSummary = { id: 1, name: "Mouse", price: 699 };
console.log(summary);

// Omit<T, Keys> — the opposite: every field EXCEPT the ones listed.
// Common for "creation" types where the server assigns the id, so
// the client shouldn't be allowed to send one.
type NewProduct = Omit<Product, "id">;
const draft: NewProduct = {
  name: "Keyboard",
  price: 1499,
  description: "Mechanical",
};
console.log(draft);

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Write a generic function `lastElement<T>(list: T[]): T`
//         (mirrors firstElement above). Call it with an array of
//         numbers and an array of strings.

function lastElement<T>(list: T[]): T {
  return list[list.length - 1];
}

const lastNumber = lastElement([10, 20, 30, 40]);
const lastString = lastElement(["Java", "TypeScript", "Rust"]);

console.log(lastNumber);
console.log(lastString);

// TODO 2: Define a union type `PaymentMethod = "card" | "upi" | "cash"`
//         and a function `describePayment(method: PaymentMethod): string`
//         that returns a different sentence for each, using a switch.

type PaymentMethod = "card" | "upi" | "cash";

function describePayment(method: PaymentMethod): string {
  switch (method) {
    case "card":
      return "Paid using a debit/credit card.";

    case "upi":
      return "Paid using UPI.";

    case "cash":
      return "Paid with cash.";
  }
}

console.log(describePayment("card"));
console.log(describePayment("upi"));
console.log(describePayment("cash"));

// TODO 3: Define two interfaces, `Sellable { price: number }` and
//         `Trackable { sku: string }`, then an intersection type
//         `InventoryItem = Sellable & Trackable & { name: string }`.
//         Create one object of that type.

interface Sellable {
  price: number;
}

interface Trackable {
  sku: string;
}

type InventoryItem = Sellable &
  Trackable & {
    name: string;
  };

const keyboard: InventoryItem = {
  name: "Mechanical Keyboard",
  price: 3499,
  sku: "KB-001",
};

console.log(keyboard);

// TODO 4: Using the `Product` interface above, create a type
//         `ProductPreview` with Pick that only has `name` and
//         `description`. Write a function `renderPreview(p: ProductPreview): string`
//         that returns a formatted string from just those two fields.

type ProductPreview = Pick<Product, "name" | "description">;

function renderPreview(p: ProductPreview): string {
  return `${p.name} - ${p.description}`;
}

const preview: ProductPreview = {
  name: "Gaming Mouse",
  description: "RGB wireless gaming mouse",
};

console.log(renderPreview(preview));

// TODO 5 (the payoff): Write a generic function
//         `wrapResponse<T>(data: T): ApiResponse<T>` that returns
//         `{ data, success: true }` (using the ApiResponse<T>
//         interface above). Call it once with a Product and once
//         with a plain string, and in a comment explain why ONE
//         function can correctly handle both without using `any`.
function wrapResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true,
  };
}

const productResponse = wrapResponse(original);
const messageResponse = wrapResponse("Product created successfully.");

console.log(productResponse);
console.log(messageResponse);

/*
Why does one function work for both?

Because T is a generic type parameter. TypeScript automatically
infers the type of whatever value is passed in.

- When we pass a Product, T becomes Product.
- When we pass a string, T becomes string.

The same function is reused while preserving full type safety,
without using `any` or writing separate functions for each type.
*/
