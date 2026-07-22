/* ============================================================
   DAY 6 — Promises, async/await, and the event loop
   ============================================================

   Run with: node lesson.js

   Why this day  : every single API call you make from
   React to your Spring Boot backend goes through this. Java's
   concurrency model is threads; JS's is a single thread + an
   event loop. This file uses a FAKE delayed API call (fakeFetch)
   instead of a real network request, so the output is
   deterministic and doesn't depend on network access — the
   pattern is identical to using the real `fetch()`, shown at
   the bottom in a comment.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. The event loop, in one demo
// -------------------------------------------------------------
// JS runs on ONE thread. There's no "blocking" the way a Java
// thread blocks on I/O — instead, slow things (timers, network
// calls, file reads) are handed off, and their callbacks run
// LATER, only once all currently-running synchronous code is done.

console.log("1: start");

setTimeout(() => {
  console.log("3: this runs AFTER all synchronous code, even with delay 0");
}, 0);

console.log("2: end");

// Output order is 1, 2, 3 — NOT 1, 3, 2 — even though the timeout
// has a 0ms delay. The event loop always finishes the current
// synchronous run before touching the timer/callback queue.
// This is the single most important mental model shift from Java.

// -------------------------------------------------------------
// 2. A fake "API call" — simulates a real network request
// -------------------------------------------------------------
// This mimics what fetch() does: something slow happens, and you
// get a Promise back immediately (not the data itself).
function fakeFetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error(`Invalid user id: ${id}`));
        return;
      }
      resolve({ id, name: `User${id}`, role: "developer" });
    }, 200); // pretend this takes 200ms, like a real network call
  });
}

// -------------------------------------------------------------
// 3. Promises — .then / .catch / .finally
// -------------------------------------------------------------
// A Promise is an object representing "a value that will exist
// later." It's in one of three states: pending, fulfilled, or
// rejected. Closest Java cousin: CompletableFuture.

console.log("4: calling fakeFetchUser(1)");
fakeFetchUser(1)
  .then((user) => {
    console.log("5: got user via .then:", user);
    return user.name; // whatever you return here becomes the next .then's input
  })
  .then((name) => {
    console.log("6: chained .then, got just the name:", name);
  })
  .catch((err) => {
    console.log("this only runs if something above rejected:", err.message);
  })
  .finally(() => {
    console.log("7: .finally runs either way (success or failure)");
  });

// A rejected promise, handled with .catch:
fakeFetchUser(-1).catch((err) => {
  console.log("caught expected error:", err.message);
});

// -------------------------------------------------------------
// 4. async/await — the same thing, written to look synchronous
// -------------------------------------------------------------
// `async function` always returns a Promise. `await` pauses THAT
// function (not the whole program) until the Promise settles.
// This is purely syntax sugar over .then() — same event loop
// underneath — but it reads top-to-bottom like Java, which is
// why almost all real code uses this style instead of .then chains.

async function loadUserProfile(id) {
  console.log(`8: loadUserProfile(${id}) starting`);
  try {
    const user = await fakeFetchUser(id); // pauses here until resolved
    console.log("9: got user via await:", user);
    return user;
  } catch (err) {
    // this catches a REJECTED promise, same job as .catch()
    console.log("10: caught via try/catch:", err.message);
    return null;
  }
}

loadUserProfile(2);
loadUserProfile(-5); // will hit the catch block

// -------------------------------------------------------------
// 5. Running things in parallel — Promise.all
// -------------------------------------------------------------
// Awaiting one call at a time is sequential (slow, adds up).
// Promise.all runs them concurrently and waits for all of them —
// similar in spirit to Java's CompletableFuture.allOf(...).

async function loadMultipleUsers() {
  const [userA, userB, userC] = await Promise.all([
    fakeFetchUser(10),
    fakeFetchUser(11),
    fakeFetchUser(12),
  ]);
  console.log(
    "11: all three loaded together:",
    userA.name,
    userB.name,
    userC.name,
  );
}
loadMultipleUsers();

// -------------------------------------------------------------
// 6. What this looks like with a REAL API (reference only —
//    not run here, since it needs network access)
// -------------------------------------------------------------
// async function getPost(id) {
//   const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
//   if (!response.ok) {
//     throw new Error(`Request failed: ${response.status}`);
//   }
//   const data = await response.json(); // this itself returns a Promise too
//   return data;
// }
// This exact pattern — await fetch(url), check response.ok, await response.json() —
// is what you'll write constantly to call your Spring Boot endpoints from React.

/* ============================================================
   EXERCISES — use fakeFetchUser() above, don't write real network
   calls for these
   ============================================================ */

// TODO 1: Call fakeFetchUser(3) with .then/.catch and log the
//         user's name.
fakeFetchUser(3)
  .then((xyz) => {
    console.log("task", xyz.name);
  })
  .catch((err) => {
    console.log(err.message);
  });

// TODO 2: Write an async function `getUserName(id)` that awaits
//         fakeFetchUser(id) and returns just the name, with a
//         try/catch that returns "unknown" if it fails. Call it
//         with both a valid and an invalid id and log both results.
//         (Remember: calling an async function gives you a Promise
//         back, so you'll need .then or another await to see the
//         result — try both ways.)

async function getUserName(id) {
  try {
    const ans = await fakeFetchUser(id);
    if (ans !== null) {
      console.log("todo2", ans.name);
      return ans.name;
    }
  } catch (err) {
    return "unknown";
  }
}

const ans1 = await getUserName(1);
console.log("test", ans1);
getUserName(-1);

// TODO 3: Predict the print order, then run it to check:
//         console.log("A");
//         setTimeout(() => console.log("B"), 0);
//         Promise.resolve().then(() => console.log("C"));
//         console.log("D");
//         (Hint: resolved promises jump the queue ahead of
//         setTimeout callbacks — this is a level deeper than
//         today's main event-loop demo, just observe it for now.)

//-> A C D B

// TODO 4: Use Promise.all to fetch users 20, 21, and 22 at the
//         same time and log all three names once they're ready.

async function loadMulUser() {
  const [user20, user21, user22] = await Promise.all([
    fakeFetchUser(20),
    fakeFetchUser(21),
    fakeFetchUser(22),
  ]);
  console.log(user20.name, user21.name, user22.name);
}

loadMulUser();

// TODO 5 (the payoff): In a comment, explain why `await
//         fetch(...)` inside a React component's useEffect needs
//         to be wrapped in its OWN async function rather than
//         making the effect callback itself `async` (this is a
//         real rule you'll hit in Phase 3 — for now, just reason
//         about it: what does useEffect expect its callback to
//         return, vs what does an async function always return?).

// useEffect expects its callback to return either nothing (undefined)
// or a cleanup function. An async function always returns a Promise,
// so making the effect callback async would return a Promise instead
// of a cleanup function. That's why we create and call an inner async
// function inside useEffect.
