/* ============================================================
   DAY 1 — Variables, primitive types, template literals,
            dynamic typing (the "not Java" parts of JS)
   ============================================================

   How to run this file:
     node lesson.js

   Read the notes, run the file, then scroll to EXERCISES
   at the bottom and fill in the TODOs yourself.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. let / const / var
// -------------------------------------------------------------
// Java has one way to declare a local variable. JS has three,
// and only two of them are worth using in new code.

let age = 27; // like a normal Java local variable — can be reassigned
const name = "Mayur"; // like `final` in Java — cannot be reassigned

age = 28; // fine
// name = "Someone";    // uncomment this line and run it -> TypeError

// `var` is the old way (pre-2015). It ignores block scope, which
// causes real bugs. You'll see it in old code, but don't write it yourself.
if (true) {
  var oldStyle = "I leak out of this block";
  let modernStyle = "I stay inside this block";
}
console.log(oldStyle); // works — var doesn't respect the `if` block
// console.log(modernStyle);  // ReferenceError — let respects the block, like Java

// -------------------------------------------------------------
// 2. Dynamic typing
// -------------------------------------------------------------
// In Java: `int x = 5;` — x is an int forever, the compiler enforces it.
// In JS: a variable's type is NOT fixed. Same variable, different types
// over time, and nothing stops you (the compiler won't catch mistakes —
// this is exactly the gap TypeScript fills later this week).

let thing = 5;
console.log(typeof thing); // "number"
thing = "five";
console.log(typeof thing); // "string" — totally legal, no error

// -------------------------------------------------------------
// 3. Primitive types
// -------------------------------------------------------------
// JS has 7 primitive types. The ones you'll use constantly:
let aNumber = 42; // no separate int/double/float — just "number"
let aString = "hello"; // like java.lang.String
let aBoolean = true; // same idea as Java boolean
let notAssignedYet; // undefined — a variable that exists but has no value
let deliberatelyEmpty = null; // null — like Java null, but you set it on purpose

console.log(typeof aNumber, typeof aString, typeof aBoolean);
console.log(typeof notAssignedYet, typeof deliberatelyEmpty);
// gotcha: typeof null is "object" — this is a 25-year-old JS bug that's
// permanent now for backwards compatibility. Just remember it's a quirk.

// -------------------------------------------------------------
// 4. Template literals
// -------------------------------------------------------------
// Java: String.format("Hello %s, you are %d", name, age)  or  "Hello " + name
// JS:   backticks + ${} — closer to Java 15's text blocks, but for any string.

const greeting = `Hello ${name}, you are ${age} years old.`;
console.log(greeting);

// They can span multiple lines and hold expressions, not just variables:
const summary = `
  Name: ${name}
  Next birthday age: ${age + 1}
  Is adult: ${age >= 18}
`;
console.log(summary);

/* ============================================================
   EXERCISES — write your answers below each TODO, then run
   `node lesson.js` to check the output.
   ============================================================ */

// TODO 1: Declare a const called `city` with your city name,
//         and a let called `temperatureCelsius` with a number.

const city = "Pune";
let temperatureCelsius = 89;

// TODO 2: Use typeof to print the type of `temperatureCelsius`,
//         then reassign it to a string (e.g. "warm") and print
//         its type again. Confirm it changed.

console.log(typeof temperatureCelsius);

temperatureCelsius = "warm";

// TODO 3: Write a template literal that prints:
//         "The weather in <city> is <temperatureCelsius>."
//         using the variables from TODO 1.

console.log(`The weather in ${city} is ${temperatureCelsius}.`);

// TODO 4: Predict, then test: what happens if you declare
//         `const pi = 3.14;` and then try `pi = 3.14159;`?
//         Write your prediction as a comment, then uncomment
//         the reassignment line below to confirm it.
// const pi = 3.14;
// pi = 3.14159;
//typeerror

// TODO 5 (scope challenge): Inside an `if (true) { ... }` block,
//         declare one variable with `var` and one with `let`.
//         Try to log both from OUTSIDE the block. Which one
//         throws an error? Write why in a comment.

// and -> throws exception because of it is in block
