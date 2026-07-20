/* ============================================================
   DAY 4 — Objects, destructuring, spread/rest operators
   ============================================================

   Run with: node lesson.js

   Why this day matters: this exact syntax (destructuring +
   spread) is what almost every React component and every state
   update is written with. If today feels natural, a huge chunk
   of React code will just look like plain JS to you.
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. Object literals — similar to a Java Map, but with dot access
// -------------------------------------------------------------
// There's no "class" required to make a bag of fields like there
// is in Java — an object literal is just `{ key: value, ... }`.
const user = {
  name: "Mayur",
  role: "developer",
  yearsExperience: 4,
  skills: ["Java", "Spring Boot", "SQL"],
};

console.log(user.name); // dot access
console.log(user["role"]); // bracket access — needed when the key is dynamic
const key = "yearsExperience";
console.log(user[key]); // this is why bracket access exists — dynamic keys

// Adding/changing fields — no getters/setters required (though you
// can add them if you want validation logic; not needed for plain data):
user.email = "mayur@example.com"; // add a new field, just like that
user.role = "senior developer"; // overwrite an existing one
console.log(user);

// -------------------------------------------------------------
// 2. Destructuring — pulling fields out of an object into variables
// -------------------------------------------------------------
// Java equivalent: manually doing `String name = user.getName();`
// for every field you need. JS lets you do it in one line.
const { name, role } = user;
console.log(name, role); // "Mayur" "senior developer"

// Rename while destructuring:
const { name: userName } = user;
console.log(userName); // "Mayur"

// Default values if the field doesn't exist:
const { nickname = "no nickname set" } = user;
console.log(nickname); // "no nickname set"

// This is EXACTLY how React components receive props:
//   function UserCard({ name, role }) { return <p>{name} - {role}</p>; }
// instead of writing `props.name` and `props.role` everywhere.

// Destructuring works on arrays too, by position instead of by key:
const scores = [90, 85, 77];
const [first, second, third] = scores;
console.log(first, second, third); // 90 85 77

const [topScore, ...restScores] = scores; // combine with rest, see below
console.log(topScore, restScores); // 90 [85, 77]

// -------------------------------------------------------------
// 3. Spread (...) — copy/expand an object or array into a new one
// -------------------------------------------------------------
// This is the closest JS gets to Java's "immutable update" pattern
// (like building a new record from an old one). Spread copies all
// fields into a NEW object rather than mutating the original.
const updatedUser = { ...user, role: "tech lead" };
console.log(updatedUser.role); // "tech lead"
console.log(user.role); // "senior developer" — original untouched

// This pattern is THE core idea behind React state updates:
//   setUser(prevUser => ({ ...prevUser, role: "tech lead" }));
// You never mutate state directly — you spread the old state into
// a new object with just the fields you want to change.

// Spread also works on arrays, e.g. to add an item without mutating:
const moreSkills = [...user.skills, "React"];
console.log(moreSkills); // ["Java", "Spring Boot", "SQL", "React"]
console.log(user.skills); // unchanged — still 3 items

// Merging two objects (later spreads override earlier ones on conflict):
const defaults = { theme: "light", fontSize: 14 };
const overrides = { fontSize: 18 };
const settings = { ...defaults, ...overrides };
console.log(settings); // { theme: "light", fontSize: 18 }

// -------------------------------------------------------------
// 4. Rest (...) — the same three dots, opposite job: GATHER
//    leftover values instead of spreading them out
// -------------------------------------------------------------
// In a function parameter list — like Java varargs (String... args):
function logAll(first, ...others) {
  console.log("first:", first);
  console.log("others:", others);
}
logAll("a", "b", "c", "d"); // first: "a"   others: ["b", "c", "d"]

// In destructuring — "give me these specific fields, and everything
// else as a leftover object":
const { name: n, ...otherFields } = user;
console.log(n); // "Mayur"
console.log(otherFields); // everything except `name`

/* ============================================================
   EXERCISES
   ============================================================ */

const product = {
  id: 101,
  title: "Wireless Mouse",
  price: 799,
  inStock: true,
  tags: ["electronics", "accessories"],
};

// TODO 1: Destructure `title` and `price` out of `product` into
//         variables and log a sentence using a template literal:
//         "Wireless Mouse costs 799"
const { title, price } = product;
console.log(`${title} cost ${price}`);

// TODO 2: Use spread to create `discountedProduct`, a copy of
//         `product` with price changed to 699. Confirm the
//         original `product.price` is still 799.

const discountedProduct = { ...product, price: 699 };
console.log(product.price);
console.log(discountedProduct.price);

// TODO 3: Destructure `product` to get `tags` and everything else
//         separately (like the rest example above).

const { tags, ...others } = product;
console.log(tags);
console.log(others);

// TODO 4: Write a function `describe(...items)` using rest
//         parameters that logs how many items were passed and
//         then logs each one on its own line.
function describe(...items) {
  console.log(`Number of items: ${items.length}`);
  for (const item of items) {
    console.log(item);
  }
}
describe("a", "b", "c", "d");

// TODO 5 (the "why this matters" one): Given this nested object,
//         destructure `city` directly out of the nested `address`
//         field in ONE line (hint: { address: { city } } = ...):
const order = {
  id: 1,
  address: { city: "Pune", zip: "411001" },
};

const {
  address: { city },
} = order;
console.log(city);
