/* ============================================================
   DAY 9 — Error handling (try/catch/finally, custom errors)
            and JSON (the format every API call speaks)
   ============================================================

   Run with: node lesson.js
   ------------------------------------------------------------ */

// -------------------------------------------------------------
// 1. try/catch/finally — same shape as Java, one big difference
// -------------------------------------------------------------
// Java has CHECKED exceptions (the compiler forces you to catch
// or declare `throws`) and unchecked ones. JS has NO checked
// exceptions at all — nothing forces you to handle anything,
// ever. An uncaught error just crashes the program (in Node) or
// gets logged to the console (in a browser). This is exactly why
// disciplined error handling is something YOU have to remember to
// do, not something the language nags you about.

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero"); // `throw` — same keyword as Java
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // 5
  console.log(divide(10, 0)); // throws
} catch (error) {
  console.log("caught:", error.message); // Error objects have .message, .name, .stack
} finally {
  console.log("finally always runs, whether it threw or not");
}

// -------------------------------------------------------------
// 2. You can throw ANYTHING in JS — but don't
// -------------------------------------------------------------
// throw "just a string";  // legal, but throws away .stack, .message, etc.
// throw 42;               // also legal, also a bad idea.
// Always throw `new Error(...)` (or a subclass, below) so whatever
// catches it can rely on .message and .stack existing.

// -------------------------------------------------------------
// 3. Custom error types — extending Error (uses Day 8's `extends`)
// -------------------------------------------------------------
// Java: create a custom exception class extending Exception.
// JS: extend the built-in Error class the exact same way.
class ValidationError extends Error {
  constructor(message, field) {
    super(message); // sets this.message, same as Java's super(message)
    this.name = "ValidationError"; // shows up in stack traces / error.name
    this.field = field; // custom errors can carry extra data
  }
}

function validateAge(age) {
  if (typeof age !== "number") {
    throw new ValidationError("Age must be a number", "age");
  }
  if (age < 0 || age > 150) {
    throw new ValidationError("Age must be between 0 and 150", "age");
  }
  return age;
}

try {
  validateAge(-5);
} catch (error) {
  // instanceof works on custom error classes just like Java's catch (ValidationException e)
  if (error instanceof ValidationError) {
    console.log(
      `validation failed on field "${error.field}": ${error.message}`,
    );
  } else {
    throw error; // re-throw anything you didn't expect — don't silently swallow it
  }
}

// -------------------------------------------------------------
// 4. try/catch with async/await (Day 6 connection)
// -------------------------------------------------------------
async function riskyAsyncCall(shouldFail) {
  if (shouldFail) {
    throw new Error("simulated network failure");
  }
  return "simulated success";
}

async function demoAsyncErrors() {
  try {
    const result = await riskyAsyncCall(true);
    console.log(result);
  } catch (error) {
    // this is the SAME try/catch you already know — await just lets
    // a rejected promise be caught with catch, exactly like a thrown error
    console.log("caught async error:", error.message);
  }
}
demoAsyncErrors();

// -------------------------------------------------------------
// 5. JSON — the format every REST API speaks
// -------------------------------------------------------------
// JSON.stringify: JS object/array -> JSON string (for sending data)
// JSON.parse:     JSON string -> JS object/array (for reading a response)
// Java equivalent: Jackson's ObjectMapper.writeValueAsString / readValue

const userObj = {
  name: "DON",
  age: 20,
  skills: ["Java", "Spring Boot", "JavaScript"],
  isActive: true,
  managerId: null,
};

const jsonString = JSON.stringify(userObj);
console.log(jsonString);
// {"name":"DON","age":20,"skills":["Java","Spring Boot","JavaScript"],"isActive":true,"managerId":null}

const prettyJson = JSON.stringify(userObj, null, 2); // 3rd arg = indentation
console.log(prettyJson);

const parsedBack = JSON.parse(jsonString);
console.log(parsedBack.name, parsedBack.skills[0]);

// Gotchas worth knowing:
const withExtras = {
  name: "test",
  greet: function () {
    return "hi";
  }, // functions are SILENTLY dropped
  missing: undefined, // undefined fields are SILENTLY dropped too
  count: NaN, // NaN becomes null
};
console.log(JSON.stringify(withExtras)); // {"name":"test","count":null}
// This matters a lot: if a field in your React state is `undefined`,
// it won't even show up when you JSON.stringify it to send to your
// Spring Boot API — easy to be confused by a "missing" field later.

// JSON.parse throws a SyntaxError on invalid JSON — always wrap it:
try {
  JSON.parse("{ this is not valid json }");
} catch (error) {
  console.log("JSON.parse failed as expected:", error.name, "-", error.message);
}
// This exact pattern (try/catch around JSON.parse) is what you'll
// use when reading a malformed or unexpected API response.

/* ============================================================
   EXERCISES
   ============================================================ */

// TODO 1: Write a function `safeDivide(a, b)` that uses try/catch
//         around the `divide` function above and returns null
//         instead of throwing when dividing by zero (log a message
//         in the catch block too).

function safeDivide(a, b) {
  try {
    return divide(a, b);
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

console.log(safeDivide(10, 2));
console.log(safeDivide(10, 0));

// TODO 2: Create a custom error class `NotFoundError extends Error`
//         that takes an `id` in its constructor and sets a message
//         like `User ${id} not found`. Throw and catch one.

class NotFoundError extends Error {
  constructor(id) {
    super(`User ${id} not found`);
    this.name = "NotFoundError";
    this.id = id;
  }
}

// TODO 3: Write an async function `fetchUserOrThrow(id)` that
//         throws your NotFoundError from TODO 2 if id <= 0,
//         otherwise returns { id, name: `User${id}` }. Call it
//         with both a valid and invalid id inside a try/catch
//         (remember: you're inside an async function, so you can
//         use await directly — see demoAsyncErrors above for the
//         pattern).

async function fetchUserOrThrow(id) {
  if (id <= 0) {
    throw new NotFoundError(id);
  }
  return {
    id: id,
    name: `User ${id}`,
  };
}

async function demoFetchUserOrThrow(id) {
  try {
    const result = await fetchUserOrThrow(id);
    console.log(result);
  } catch (error) {
    console.log("caught error:", error.message);
  }
}
demoFetchUserOrThrow(12);
demoFetchUserOrThrow(-12);

// TODO 4: Take this object and JSON.stringify it, then JSON.parse
//         the result back. Log both the string and the parsed
//         object. What happened to the `undefined` field?
const settings = {
  theme: "dark",
  fontSize: 16,
  betaFeature: undefined,
};

const jsonString1 = JSON.stringify(settings);
console.log(jsonString1);
const parsedObject = JSON.parse(jsonString1);
console.log(parsedObject);

//The betaFeature property is dropped because undefined is not a valid value in JSON.

// TODO 5 (the payoff): Write a function `parseJsonSafely(str)` that
//         tries to JSON.parse(str) and returns the parsed value, but
//         returns `null` (and logs the error) if the string isn't
//         valid JSON. Test it with both a valid JSON string and a
//         broken one like "{not valid}".
function parseJsonSafely(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.log(err);
    return null;
  }
}
const valid = '{"name":"DON","age":25}';
const result1 = parseJsonSafely(valid);
console.log(result1);

const invalid = "{not valid}";
const result2 = parseJsonSafely(invalid);
console.log(result2);
