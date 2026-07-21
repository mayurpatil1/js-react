/* ============================================================
   DAY 5 — Scope, closures, and `this` (in depth)
   ============================================================

   Run with: node lesson.js

   This is the biggest conceptual jump from Java in the whole
   fundamentals phase. Take your time. The payoff: closures are
   the exact mechanism behind how React hooks (useState, useEffect,
   custom hooks) work — once this clicks, hooks stop feeling like
   magic.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Scope — where a variable is visible
// -------------------------------------------------------------
// Java has block scope for locals (a variable declared inside an
// `if` isn't visible outside it) — `let`/`const` work the same way.
// Function scope is the other kind: a variable is visible anywhere
// inside the function it was declared in, no matter how deeply
// nested the blocks are.

function scopeDemo() {
  let outer = "I'm in the function scope";

  if (true) {
    let inner = "I'm in the block scope";
    console.log(outer); // visible — function-scoped vars reach into blocks
    console.log(inner); // visible — we're inside the block
  }

  // console.log(inner); // ReferenceError — inner doesn't exist out here
  console.log(outer); // still visible
}
scopeDemo();

// -------------------------------------------------------------
// 2. Closures — a function "remembers" the variables from where
//    it was CREATED, not where it's called
// -------------------------------------------------------------
// Java has nothing quite like this by default (anonymous inner
// classes / lambdas capturing effectively-final variables are the
// closest cousin — and that restriction hints at what's going on
// here too). A closure is just: an inner function + the outer
// variables it references, bundled together and kept alive.

function makeCounter() {
  let count = 0; // this variable is "closed over" by the function below

  return function increment() {
    count++; // this inner function can still see and update `count`
    return count; // even though makeCounter() already finished running!
  };
}

const counterA = makeCounter();
const counterB = makeCounter(); // a completely separate `count`

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterA()); // 3
console.log(counterB()); // 1 -- independent from counterA, its own closure

// This is precisely what useState gives you in React: each
// component instance gets its own private, remembered value,
// via a closure — not a class field, a closure.

// -------------------------------------------------------------
// 3. The classic closure bug: var vs let inside a loop
// -------------------------------------------------------------
// This is a genuinely famous interview question. Read it carefully.

console.log("--- var loop ---");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 0);
}
// Prints "var i: 3" three times! Because `var` is function-scoped,
// there's only ONE `i` shared by every iteration. By the time the
// setTimeout callbacks actually run, the loop has already finished
// and `i` is 3.

console.log("--- let loop ---");
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 0);
}
// Prints "let j: 0", "let j: 1", "let j: 2". Because `let` is
// block-scoped, EACH iteration gets its own fresh `j` — each
// callback closes over a different one.
// (This exact bug class is why React warns about "stale closures"
// in useEffect when you forget to list a dependency.)

// -------------------------------------------------------------
// 4. `this` — determined by HOW a function is called
// -------------------------------------------------------------
// In Java, `this` inside a method always refers to the object the
// method belongs to. In JS, a regular function's `this` depends
// on the call site, not where the function was defined. There are
// four rules, roughly in order of how often you'll meet them:

// (a) Implicit binding — called as obj.method() -> `this` is obj
const dog = {
  name: "Bruno",
  bark() {
    console.log(`${this.name} says woof`);
  },
};
dog.bark(); // "Bruno says woof" — this === dog

// (b) Default binding — called as a bare function -> `this` is
//     undefined (in strict mode / modules) or the global object
const bark = dog.bark;
// bark(); // would throw: "Cannot read properties of undefined"
//         // because `this` is no longer `dog` — it was detached!
// This exact trap is why passing `this.handleClick` around as a
// callback in React class components needed `.bind(this)`.

// (c) Explicit binding — call/apply/bind force what `this` is
bark.call(dog); // "Bruno says woof" — this === dog, forced
const boundBark = bark.bind(dog);
boundBark(); // "Bruno says woof" — permanently bound now

// (d) Arrow functions — no `this` of their own, so they use
//     whatever `this` was in the ENCLOSING scope at creation time.
//     (This is the one you already saw in Day 2's this.count demo.)
const cat = {
  name: "Whiskers",
  meowLater() {
    setTimeout(() => {
      console.log(`${this.name} says meow`); // this === cat, inherited
    }, 0);
  },
};
cat.meowLater(); // "Whiskers says meow"

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Write a `makeBankAccount(startingBalance)` function
//         (like makeCounter above) that returns an object with
//         two methods: `deposit(amount)` and `getBalance()`.
//         The balance should be a closed-over variable, not
//         attached to the returned object directly.
function makeBankAccount(startingBalance) {
  let balance = startingBalance;

  return {
    deposit(amount) {
      balance += amount;
    },

    getBalance() {
      return balance;
    },
  };
}

// TODO 2: Create two separate accounts with makeBankAccount and
//         prove they don't share state (deposit into one, check
//         the other is unaffected).

const account1 = makeBankAccount(1000);
const account2 = makeBankAccount(500);

account1.deposit(200);

console.log(account1.getBalance());
console.log(account2.getBalance());

// TODO 3: Predict, then test: rewrite the "var loop" example above
//         but wrap the body in an IIFE (immediately invoked
//         function expression) to fix it WITHOUT changing var to
//         let:
//         for (var i = 0; i < 3; i++) {
//           (function (i) { setTimeout(() => console.log(i), 0); })(i);
//         }
//         Why does this fix it? (Write your answer as a comment —
//         hint: think about what creates a new scope.)

for (var i = 0; i < 3; i++) {
  (function (i) {
    setTimeout(() => console.log(i), 0);
  })(i);
}

// TODO 4: Take the `dog` object above. Extract `dog.bark` into a
//         standalone variable, then use .bind() to permanently
//         attach it to `dog` and call it. Confirm it still logs
//         "Bruno says woof" even though it's no longer called as
//         dog.bark().

const bark1 = dog.bark.bind(dog);

// TODO 5 (the payoff): In one or two sentences, explain in a
//         comment why a closure is the right mental model for
//         React's useState — specifically, why each component
//         "remembers" its own state between re-renders without
//         a class or an instance field.

// React's useState works like a closure because each component keeps
// its own private state between renders. Every component instance gets
// its own state, just like each call to makeCounter() or makeBankAccount()
// gets its own independent closed-over variables.
