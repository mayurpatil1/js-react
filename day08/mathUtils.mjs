/* ============================================================
   mathUtils.mjs — demonstrates named exports AND a default export
   in the same file (a file can have both, though many files just
   pick one style).
   ------------------------------------------------------------ */

// Named exports — import these with { curly braces }, and the
// name must match exactly (unless you rename on import).
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI_APPROX = 3.14159;

// A DEFAULT export — at most ONE per file. Import it with any
// name you like, no curly braces. Common for "this file's main
// thing" — e.g. a React component file's default export is
// usually the component itself.
export default function formatCurrency(amount) {
  return `₹${amount.toFixed(2)}`; // ₹ is the Rupee sign
}
