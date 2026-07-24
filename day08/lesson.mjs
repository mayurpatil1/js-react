/* ============================================================
   DAY 8 — ES6 modules (import/export) & JS classes
   ============================================================

   Run with: node lesson.mjs
   (the .mjs extension tells Node "this file uses import/export"
   without needing any project config — React projects use a
   bundler like Vite that handles this for you automatically)

   This is the first day working across MULTIPLE files:
     shapes.mjs    — Shape / Circle / Rectangle classes
     mathUtils.mjs — named exports + a default export
     lesson.mjs    — this file, importing from both
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Import styles
// -------------------------------------------------------------
// Named imports — curly braces, names must match the exports
// (Circle, Rectangle, Shape are all named exports in shapes.mjs)
import { Circle, Rectangle, Shape, Triangle } from "./shapes.mjs";

// Default import (no braces) + named imports, combined in one line.
// You can call the default import anything you want — here it's
// named `formatCurrency` to match what it actually does, but the
// FILE doesn't enforce that name.
import formatCurrency, { add, multiply, PI_APPROX } from "./mathUtils.mjs";

// Namespace import — grabs EVERYTHING as one object. Rarely needed,
// but you'll see it in some codebases (import * as React from "react"
// is the same idea, before newer syntax made it less common).
import * as mathUtils from "./mathUtils.mjs";

console.log(add(2, 3), multiply(2, 3), PI_APPROX);
console.log(formatCurrency(499.5));
console.log(mathUtils.add(10, 20)); // same function, accessed via the namespace

// -------------------------------------------------------------
// 2. Quick note: CommonJS (the OLD way) vs ES modules (this way)
// -------------------------------------------------------------
// Older Node code and some tutorials still use:
//   const thing = require("./thing");
//   module.exports = thing;
// That's CommonJS — Node's original module system, still common in
// backend Node code. React/Vite/modern frontend tooling uses ES
// modules (import/export) exclusively — what this lesson teaches
// is what you'll actually type in React files.

// -------------------------------------------------------------
// 3. Classes & inheritance (imported from shapes.mjs)
// -------------------------------------------------------------
const shapes = [
  new Circle(3),
  new Rectangle(4, 5),
  new Circle(1),
  new Triangle(6, 4),
];

shapes.forEach((shape) => console.log(shape.describe()));

// Polymorphism — same .area() call, different behavior per subclass,
// exactly like calling an overridden method in Java.
const sortedByArea = [...shapes].sort(Shape.compareByArea); // static method
console.log(
  "sorted smallest to largest:",
  sortedByArea.map((s) => s.name),
);

// -------------------------------------------------------------
// 4. Private fields — the modern, ACTUALLY-private way
// -------------------------------------------------------------
// Older JS code fakes privacy with a naming convention: `this._balance`
// (the underscore is just a signal, nothing stops outside code from
// touching it). The `#` syntax below is real, enforced privacy —
// closer to Java's `private` keyword than the old convention ever was.
class BankAccount {
  #balance; // declared private field — only accessible inside this class

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount > this.#balance) {
      throw new Error(
        `Cannot withdraw ${amount}, balance is only ${this.#balance}`,
      );
    }
    this.#balance -= amount;
    return this.#balance;
  }

  // A getter — called like a PROPERTY (acct.balance), not a method
  // (acct.balance(), no parentheses). Same idea as a Java getter,
  // but you don't call it as a method.
  get balance() {
    return this.#balance;
  }

  static describeAccount(account) {
    return `Balance: ${account.balance}`;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log("balance via getter:", account.balance); // 150, no parens
// console.log(account.#balance); // SyntaxError if run outside the class —
//                                    truly private, not just a convention

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Import `add` and `multiply` with DIFFERENT local names
//         using the `as` keyword, e.g.:
//         import { add as sum, multiply as product } from "./mathUtils.mjs";
//         then call them and log the results.
import { add as sum, multiply as product } from "./mathUtils.mjs";

console.log("sum(2, 3):", sum(2, 3));
console.log("product(2, 3):", product(2, 3));

// TODO 2: Open shapes.mjs and add a new class `Triangle extends Shape`
//         with a constructor(base, height) and an area() method
//         (area = 0.5 * base * height). Export it, import it here,
//         create one, and add it to the `shapes` array above —
//         confirm it sorts correctly with the others.
//done

// TODO 3: Add a `withdraw(amount)` method to BankAccount that throws
//         an Error if the amount is more than the current #balance.
//         Test it by trying to withdraw too much and catching the
//         error (try/catch — Day 6).
try {
  account.withdraw(1000);
} catch (err) {
  console.log("withdraw failed as expected:", err.message);
}
console.log("balance after failed withdraw:", account.balance);

// TODO 4: Add a static field/method to BankAccount:
//         `static describeAccount(account) { return \`Balance: ${account.balance}\`; }`
//         and call it as BankAccount.describeAccount(account).
console.log(BankAccount.describeAccount(account));

// TODO 5 (the "why it matters" one): In a comment, explain why
//         `this.#balance` inside deposit() can only be safely
//         relied on because it's an arrow-free REGULAR method
//         called as `account.deposit(...)` — what would happen to
//         `this` if you did `const d = account.deposit; d(50);`
//         instead? (Tie this back to Day 5's `this` rules.)
//
// A regular (non-arrow) method like deposit() doesn't have a fixed
// `this` — its `this` is set by HOW it's called (Day 5's "call-site
// rule"), not by where it's defined. `account.deposit(50)` calls it
// AS A PROPERTY OF `account`, so `this` is bound to `account` inside
// the method, and `this.#balance` correctly reaches into account's
// private field.
//
// `const d = account.deposit;` copies the FUNCTION only — it detaches
// it from `account`. Calling `d(50)` now calls it with no receiver,
// so in a module (strict mode by default) `this` is `undefined`
// instead of `account`, and `this.#balance` throws a TypeError
// (can't read a private field off `undefined`). Demonstrated below:
const d = account.deposit;
try {
  d(50);
} catch (err) {
  console.log("detached deposit failed as expected:", err.message);
}
