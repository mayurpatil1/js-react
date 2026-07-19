/* ============================================================
   DAY 3 — Arrays & array methods
            (map, filter, reduce, forEach, find, some/every)
   ============================================================

   Run with: node lesson.js

   Why this day matters more than it looks: React components
   render lists by transforming arrays with .map(), not with
   for-loops. If you're comfortable with Java Streams
   (list.stream().filter(...).map(...).collect(...)), this will
   feel very familiar — JS just does it without the stream()/
   collect() ceremony, directly on the array.
   ------------------------------------------------------------ */

const people = [
  { name: "Asha", age: 29, city: "Pune" },
  { name: "Rohit", age: 17, city: "Mumbai" },
  { name: "Priya", age: 34, city: "Pune" },
  { name: "Karan", age: 15, city: "Delhi" },
  { name: "Neha", age: 41, city: "Mumbai" },
];

// -------------------------------------------------------------
// 1. forEach — just "do something for each item", no new array
// -------------------------------------------------------------
// Java equivalent: people.forEach(p -> System.out.println(p.getName()));
people.forEach((person) => {
  console.log(person.name);
});

// -------------------------------------------------------------
// 2. map — transform EVERY item, get back a NEW array, same length
// -------------------------------------------------------------
// Java equivalent: people.stream().map(Person::getName).collect(toList())
const names = people.map((person) => person.name);
console.log(names); // ["Asha", "Rohit", "Priya", "Karan", "Neha"]

// map is the one you'll use constantly in React:
// items.map(item => <li key={item.id}>{item.name}</li>)

// -------------------------------------------------------------
// 3. filter — keep only items that pass a test, new array,
//    possibly SHORTER
// -------------------------------------------------------------
// Java equivalent: people.stream().filter(p -> p.getAge() >= 18).collect(toList())
const adults = people.filter((person) => person.age >= 18);
console.log(adults.map((p) => p.name)); // ["Asha", "Priya", "Neha"]

// map and filter chain together, same idea as a Java stream pipeline:
const adultNamesInPune = people
  .filter((person) => person.age >= 18)
  .filter((person) => person.city === "Pune")
  .map((person) => person.name);
console.log(adultNamesInPune); // ["Asha", "Priya"]

// -------------------------------------------------------------
// 4. find — the FIRST item that matches, or undefined
// -------------------------------------------------------------
// Java equivalent: people.stream().filter(...).findFirst().orElse(null)
const firstMinor = people.find((person) => person.age < 18);
console.log(firstMinor); // { name: "Rohit", age: 17, city: "Mumbai" }

const nobody = people.find((person) => person.name === "Zaid");
console.log(nobody); // undefined — always check for this before using the result

// -------------------------------------------------------------
// 5. some / every — boolean checks across the array
// -------------------------------------------------------------
// Java equivalent: people.stream().anyMatch(...) / allMatch(...)
console.log(people.some((p) => p.age < 18)); // true  — at least one minor
console.log(people.every((p) => p.age >= 18)); // false — not everyone is an adult

// -------------------------------------------------------------
// 6. reduce — the flexible one, boils an array down to ONE value
// -------------------------------------------------------------
// Java equivalent: people.stream().mapToInt(Person::getAge).sum()
// reduce(callback, startingValue) — callback gets (accumulator, currentItem)
const totalAge = people.reduce((sum, person) => sum + person.age, 0);
console.log(totalAge); // 29+17+34+15+41 = 136

// reduce can build far more than numbers — here it groups people by city,
// which is a very common real-world use (Java's equivalent would be
// Collectors.groupingBy):
const byCity = people.reduce((groups, person) => {
  const key = person.city;
  if (!groups[key]) {
    groups[key] = [];
  }
  groups[key].push(person.name);
  return groups;
}, {});
console.log(byCity);
// { Pune: ["Asha", "Priya"], Mumbai: ["Rohit", "Neha"], Delhi: ["Karan"] }

/* ============================================================
   EXERCISES — use the `people` array above for all of these
   ============================================================ */

// TODO 1: Use .map() to get an array of just the ages:
//         [29, 17, 34, 15, 41]

const ages = people.map((people) => people.age);
console.log(ages);

// TODO 2: Use .filter() to get everyone from "Mumbai".
let onlyMumbai = people.filter((people) => people.city === "Mumbai");
console.log(onlyMumbai);

// TODO 3: Use .find() to get the first person over age 30.
//         What do you get back if NO ONE matches — and what type
//         is it? (Try it and log the result.)

let first30 = people.find((person) => person.age >= 30);
console.log(first30);
//undefined

// TODO 4: Use .some() to check: "is there anyone under 16?"
//         Use .every() to check: "is everyone from Pune or Mumbai?"

console.log(people.some((p) => p.age <= 16));
console.log(people.every((p) => p.city === "Mumbai" || p.city === "Pune"));

// TODO 5 (the important one): Use .reduce() to count how many
//         people are minors (age < 18) vs adults (age >= 18),
//         producing a single object like:
//         { minors: 2, adults: 3 }
const minorsAndAdults = people.reduce(
  (group, person) => {
    if (person.age >= 18) {
      group.adults++;
    } else {
      group.minors++;
    }
    return group;
  },
  {
    minors: 0,
    adults: 0,
  },
);

console.log(minorsAndAdults);
