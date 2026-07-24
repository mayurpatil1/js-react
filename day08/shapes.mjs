/* ============================================================
   shapes.mjs — a separate MODULE, imported by lesson.mjs
   ============================================================
   This is one file, exporting things another file will import —
   exactly the shape of every React project: components, hooks,
   and utils each live in their own file and get imported where
   they're needed.
   ------------------------------------------------------------ */

// `export` in front of a class/function/const makes it importable
// elsewhere. This is a NAMED export — there can be many per file.
export class Shape {
  constructor(name) {
    this.name = name;
  }

  area() {
    // Java equivalent: an abstract method on an abstract class.
    // JS doesn't have a real `abstract` keyword — this is the
    // conventional way to say "subclasses MUST override this."
    throw new Error(`area() must be implemented by a subclass of Shape`);
  }

  describe() {
    return `${this.name} has area ${this.area().toFixed(2)}`;
  }

  // `static` — same meaning as Java: belongs to the class itself,
  // not to any instance. Called as Shape.compareByArea(...), never
  // on an instance.
  static compareByArea(a, b) {
    return a.area() - b.area();
  }
}

// `extends` + `super(...)` — identical concept to Java inheritance.
// JS only supports single inheritance too (one `extends`), same as Java.
export class Circle extends Shape {
  constructor(radius) {
    super("Circle"); // must call super() before using `this` — same rule as Java
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

export class Rectangle extends Shape {
  constructor(width, height) {
    super("Rectangle");
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

export class Triangle extends Shape {
  constructor(base, height) {
    super("Triangle");
    this.base = base;
    this.height = height;
  }

  area() {
    return 0.5 * this.base * this.height;
  }
}
