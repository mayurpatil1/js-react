"use strict";
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
function firstElement(list) {
    return list[0];
}
const firstNumber = firstElement([1, 2, 3]); // T inferred as number
const firstName = firstElement(["Mayur", "Rohit"]); // T inferred as string
console.log(firstNumber, firstName);
// Same interface, two totally different shapes of `data`:
const userResponse = {
    data: { id: 1, name: "Mayur" },
    success: true,
};
const numbersResponse = {
    data: [1, 2, 3],
    success: true,
};
console.log(userResponse.data.name, numbersResponse.data);
// This EXACT pattern (ApiResponse<T>) is what you'll write constantly
// once you're typing responses from your Spring Boot API in Phase 3+.
// Generic constraints — "T can be ANYTHING, as long as it has at
// least these fields" (this `extends` means something different
// from class inheritance — here it means "must be compatible with"):
function logId(item) {
    console.log(`id: ${item.id}`);
}
logId({ id: 1, name: "Mayur" }); // fine — has an id field
// not just "any string"
function describeStatus(status) {
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
function getUserLabel(user) {
    if (typeof user === "string") {
        return user; // TypeScript knows it's a string here — "narrowed"
    }
    return user.name; // and knows it's the object here, in this branch
}
console.log(getUserLabel("guest-id-123"));
console.log(getUserLabel({ name: "Mayur" }));
const signupEvent = {
    name: "Signup",
    createdAt: "2026-01-01",
};
console.log(signupEvent);
// Partial<T> — every field becomes optional. Extremely common for
// "update" operations, where you only send the fields that changed
// (PATCH-style, same idea as a partial DTO in a Spring Boot update
// endpoint).
function updateProduct(product, changes) {
    return { ...product, ...changes }; // Day 4: spread, later field wins
}
const original = {
    id: 1,
    name: "Mouse",
    price: 799,
    description: "Wireless",
};
const updated = updateProduct(original, { price: 699 }); // only price, rest stays
console.log(updated);
const summary = { id: 1, name: "Mouse", price: 699 };
console.log(summary);
const draft = {
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
function lastElement(list) {
    return list[list.length - 1];
}
const lastNumber = lastElement([10, 20, 30, 40]);
const lastString = lastElement(["Java", "TypeScript", "Rust"]);
console.log(lastNumber);
console.log(lastString);
function describePayment(method) {
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
const keyboard = {
    name: "Mechanical Keyboard",
    price: 3499,
    sku: "KB-001",
};
console.log(keyboard);
function renderPreview(p) {
    return `${p.name} - ${p.description}`;
}
const preview = {
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
function wrapResponse(data) {
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
