/* ============================================================
   DAY 2 — Operators, conditionals, loops, and functions
            (declarations vs expressions vs arrow functions,
             and why arrow functions handle `this` differently)
   ============================================================

   Run with: node lesson.js
   Read the notes, run the file, then do the EXERCISES at the
   bottom.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Operators — mostly identical to Java, with one big trap
// -------------------------------------------------------------
console.log(5 + 3, 5 - 3, 5 * 3, 5 / 2, 5 % 2); // arithmetic — same as Java

// Comparison: JS has TWO equality operators. This is the trap.
console.log(5 == "5"); // true  — "loose equality", converts types first
console.log(5 === "5"); // false — "strict equality", no conversion (== Java's ==)
// Rule of thumb: always use === and !==. Pretend == doesn't exist.
// (Java doesn't have this problem because it's statically typed —
//  "5" and 5 aren't even comparable there.)

// Logical operators
console.log(true && false, true || false, !true); // same as Java's &&, ||, !

// Nullish coalescing (??) — returns the right side ONLY if the
// left is null or undefined (not for other falsy values like 0 or "").
let userInput = 0;
console.log(userInput || "default"); // "default" -- 0 is falsy, this is often a bug!
console.log(userInput ?? "default"); // 0 -- ?? only cares about null/undefined
// This distinction matters a LOT once you're handling form inputs and API data.

// Ternary — identical to Java
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status);

// -------------------------------------------------------------
// 2. Conditionals & loops — mostly identical to Java
// -------------------------------------------------------------
if (age >= 18) {
  console.log("can vote");
} else if (age >= 13) {
  console.log("teenager");
} else {
  console.log("child");
}

const fruits = ["apple", "banana", "cherry"];

for (let i = 0; i < fruits.length; i++) {
  // classic for — same as Java
  console.log(i, fruits[i]);
}

for (const fruit of fruits) {
  // like Java's for-each (for (String f : fruits))
  console.log(fruit);
}

for (const index in fruits) {
  // iterates INDEXES (or keys for objects) — easy to
  console.log(index); // confuse with for...of. Prefer for...of for arrays.
}

// -------------------------------------------------------------
// 3. Functions — THREE ways to write one, and they're not
//    interchangeable
// -------------------------------------------------------------

// (a) Function declaration — hoisted, meaning you can call it
//     before it's defined in the file (Java doesn't have this
//     concept since methods aren't "declared inline").
sayHelloDeclaration("Mayur");
function sayHelloDeclaration(name) {
  console.log(`Hello, ${name} (declaration)`);
}

// (b) Function expression — NOT hoisted. Assigned to a variable,
//     so it follows the same let/const rules as any other value.
const sayHelloExpression = function (name) {
  console.log(`Hello, ${name} (expression)`);
};
sayHelloExpression("Mayur");

// (c) Arrow function — the modern, most common style in React code.
const sayHelloArrow = (name) => {
  console.log(`Hello, ${name} (arrow)`);
};
sayHelloArrow("Mayur");

// Shorthand: single expression body, implicit return, no braces needed
const square = (n) => n * n;
console.log(square(5)); // 25

// -------------------------------------------------------------
// 4. The `this` difference — THE thing to understand today
// -------------------------------------------------------------
// In Java, `this` always refers to the instance the method is
// called on — it's predictable. In JS, `this` depends on HOW a
// regular function is CALLED, which trips everyone up at first.
// Arrow functions fix this by not having their own `this` at all —
// they just use whatever `this` was in the surrounding code.

const counter = {
  count: 0,
  incrementRegular: function () {
    setTimeout(function () {
      // regular function inside setTimeout loses track of `this` —
      // it's no longer the counter object here.
      this.count++;
      console.log("regular function this.count:", this.count); // NaN or error-ish behavior
    }, 10);
  },
  incrementArrow: function () {
    setTimeout(() => {
      // arrow function inherits `this` from incrementArrow's scope,
      // which correctly IS the counter object.
      this.count++;
      console.log("arrow function this.count:", this.count); // 1, correctly
    }, 10);
  },
};

counter.incrementRegular();
counter.incrementArrow();
// This exact pattern (arrow function preserving `this`) is why React
// class components and many callbacks lean on arrow functions.

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Write a function `isEven` (as an arrow function) that
//         takes a number and returns true/false using the % operator.

let isEven = (number) => {
  if (number % 2 === 0) {
    return true;
  }
  return false;
};
console.log(isEven(2));
console.log(isEven(3));

// TODO 2: Use a ternary to print "even" or "odd" for the number 17,
//         calling your isEven function from TODO 1.

console.log(isEven(17) === true ? "even" : "odd");

// TODO 3: Loop over this array with for...of and print only the
//         words longer than 4 letters:
const words = ["cat", "elephant", "dog", "giraffe"];
for (const word of words) {
  if (word.length > 4) {
    console.log(word);
  }
}

// TODO 4: Explain in a comment: why does `0 || "fallback"` print
//         "fallback", but `0 ?? "fallback"` print 0? When would you
//         actually want ?? instead of ||? (Hint: think about a form
//         field where 0 is a valid, meaningful value.)

// The logical OR operator (||) checks if the left value is 'falsy'.
// In JavaScript, falsy values include 0, false, null, undefined, NaN, and "".
// Since 0 is falsy, 0 || "fallback" triggers the fallback string.

// The nullish coalescing operator (??) only checks if the left value
// is null or undefined (a 'nullish' value). Since 0 is a valid number,
// it ignores the fallback and returns 0.

// TODO 5: Rewrite `sayHelloExpression` above as an arrow function
//         one-liner using the implicit-return shorthand, and call it.

const sayHelloArrowOneLiner = (name) => console.log(name);
sayHelloArrowOneLiner("mayur");
