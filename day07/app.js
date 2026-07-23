/* ============================================================
   DAY 7 MILESTONE — Vanilla JS To-Do App
   ============================================================

   Open index.html in a browser to run this (double-click it, or
   use a "Live Server" extension in VS Code — plain double-click
   works fine too for this app).

   This deliberately reuses everything from Days 1–6:
     - closures (Day 5)   -> the whole app is wrapped in an IIFE
       so `todos`, `nextId` etc. are private, not global variables
     - array methods (Day 3) -> map/filter/reduce drive all the
       list logic, no manual for-loops
     - destructuring/spread (Day 4) -> immutable-style updates,
       exactly like you'll do with React state later
     - async/await (Day 6) -> a FAKE "sync to server" call shows
       the same await/try-catch pattern you'll use for real API
       calls to your Spring Boot backend
     - DOM basics (new today) -> querySelector, addEventListener,
       event delegation, template-literal-based rendering
   ------------------------------------------------------------ */

(function () {
  // Everything in here is a closure over these variables — nothing
  // leaks into the global scope, same idea as Day 5's makeCounter.
  const STORAGE_KEY = "day07-todos";

  // ---- persistence (localStorage) ----
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveTodos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ---- fake "server sync", same shape as a real fetch() call ----
  function fakeSyncToServer(list) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, count: list.length }), 250);
    });
  }

  // ---- state ----
  let todos = loadTodos();
  let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1; // Day 3: reduce
  let currentFilter = "all"; // "all" | "active" | "completed" — TODO 2
  let editingId = null; // id of the todo currently showing an <input> — TODO 3

  // ---- DOM references ----
  const listEl = document.getElementById("todo-list");
  const formEl = document.getElementById("todo-form");
  const inputEl = document.getElementById("todo-input");
  const statsEl = document.getElementById("todo-stats");
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  const filtersEl = document.getElementById("todo-filters");

  // Every mutation goes through this one function: replace the whole
  // `todos` array (never mutate in place), save it, re-render, then
  // "sync" it — mirrors exactly how you'll call setTodos(...) in React.
  async function persistAndSync(updatedTodos) {
    todos = updatedTodos;
    saveTodos(todos);
    render();

    try {
      const result = await fakeSyncToServer(todos); // Day 6: await
      console.log(`Synced ${result.count} todo(s) with server (simulated)`);
    } catch (err) {
      console.log("Sync failed (simulated):", err.message);
    }
  }

  function addTodo(text) {
    const todo = { id: nextId++, text, completed: false };
    persistAndSync([...todos, todo]); // Day 4: spread — add without mutating
  }

  function toggleTodo(id) {
    const updated = todos.map(
      (
        todo // Day 3: map
      ) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo) // Day 4: spread
    );
    persistAndSync(updated);
  }

  function deleteTodo(id) {
    if (id === editingId) editingId = null;
    persistAndSync(todos.filter((todo) => todo.id !== id)); // Day 3: filter
  }

  function editTodo(id, newText) {
    const text = newText.trim();
    editingId = null;

    if (!text) return render(); // empty edit: bail out, keep the old text

    const updated = todos.map(
      (todo) => (todo.id === id ? { ...todo, text } : todo) // Day 4: spread
    );
    persistAndSync(updated);
  }

  function clearCompleted() {
    persistAndSync(todos.filter((todo) => !todo.completed)); // Day 3: filter
  }

  // ---- rendering ----
  function render() {
    const visibleTodos = todos.filter((todo) => {
      // Day 3: filter — narrows which todos render without touching data
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

    listEl.innerHTML = visibleTodos
      .map(
        (todo) => `
        <li data-id="${todo.id}" class="${todo.completed ? "completed" : ""}">
          ${
            todo.id === editingId
              ? `<input class="edit-input" type="text" data-action="edit-input" value="${todo.text}" />`
              : `<span class="todo-text" data-action="edit-text">${todo.text}</span>`
          }
          <button class="toggle-btn" data-action="toggle">${
            todo.completed ? "Undo" : "Done"
          }</button>
          <button class="delete-btn" data-action="delete">Delete</button>
        </li>`
      )
      .join(""); // Day 3: map + join, no manual string concatenation loop

    if (editingId !== null) {
      const editInput = listEl.querySelector(".edit-input");
      if (editInput) editInput.focus();
    }

    const remaining = todos.filter((todo) => !todo.completed).length; // Day 3: filter
    statsEl.textContent = `${remaining} of ${todos.length} remaining`; // Day 1: template literal

    // Highlight whichever filter button matches currentFilter.
    [...filtersEl.children].forEach((btn) => {
      // Day 4: spread — turn the HTMLCollection into an array to use forEach
      btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
  }

  // ---- events ----
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    addTodo(text);
    inputEl.value = "";
    inputEl.focus();
  });

  // Event delegation: ONE listener on the list instead of one per
  // button. `e.target.dataset` + destructuring pulls out the action.
  listEl.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);
    const { action } = e.target.dataset; // Day 4: destructuring

    if (action === "toggle") toggleTodo(id);
    if (action === "delete") deleteTodo(id);
  });

  // Double-click the text to start editing; re-render swaps in an <input>.
  listEl.addEventListener("dblclick", (e) => {
    if (e.target.dataset.action !== "edit-text") return;
    const li = e.target.closest("li");
    editingId = Number(li.dataset.id);
    render();
  });

  // "focusout" (unlike "blur") bubbles, so one delegated listener on
  // listEl can catch it leaving any of the dynamically-created inputs.
  listEl.addEventListener("focusout", (e) => {
    if (e.target.dataset.action !== "edit-input") return;
    if (editingId === null) return; // Escape already exited edit mode below
    const li = e.target.closest("li");
    editTodo(Number(li.dataset.id), e.target.value);
  });

  listEl.addEventListener("keydown", (e) => {
    if (e.target.dataset.action !== "edit-input") return;
    if (e.key === "Enter") e.target.blur(); // triggers the focusout handler above
    if (e.key === "Escape") {
      editingId = null; // focusout will fire during render() but the guard above skips it
      render();
    }
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  // Same event-delegation pattern as listEl: one listener for all
  // three filter buttons instead of one each.
  filtersEl.addEventListener("click", (e) => {
    const { filter } = e.target.dataset; // Day 4: destructuring
    if (!filter) return;
    currentFilter = filter;
    render();
  });

  render(); // initial paint on page load
})();

/* ============================================================
   STRETCH EXERCISES — once the base app works, try these:
   ============================================================ */

// TODO 1: Add a "Clear completed" button that removes every
//         completed todo at once (hint: .filter(), same pattern
//         as deleteTodo but for ALL completed items).

// TODO 2: Add three filter buttons — All / Active / Completed —
//         that change which todos render, without deleting any
//         data (keep a separate `currentFilter` variable and
//         apply it inside render() before the .map()).

// TODO 3: Add inline editing: double-click a todo's text to turn
//         it into an <input>, and save the new text on blur or
//         Enter.

// TODO 4: Right now nextId just increments forever. What would
//         break if you reloaded the page after deleting every
//         todo, then added a new one — would its id collide with
//         anything? (Trace through loadTodos() + the reduce line
//         above and write your answer as a comment.)
//
// ANSWER: nextId isn't persisted on its own — it's recomputed on
// every page load from whatever's still in `todos` (the reduce
// line). Delete every todo, and localStorage now holds `[]`. On
// reload, loadTodos() returns [], so
// `todos.reduce((max, t) => Math.max(max, t.id), 0) + 1` collapses
// back down to 1, and the next todo you add gets id 1 again — the
// exact id an earlier, now-deleted todo once had. Nothing breaks
// visibly here because the DOM only ever renders `todos`, and the
// old id-1 todo is gone from that array, so there's no on-screen
// collision. But the id is only unique *within the current list*,
// not globally over the todo's lifetime — anything that remembers
// an id outside of `todos` (a backend row from fakeSyncToServer,
// browser history/undo, another open tab that hasn't reloaded yet)
// could easily end up pointing at the wrong todo. A real backend
// would hand out ids itself (auto-increment / UUID) precisely to
// avoid this.

// TODO 5 (the one that matters for what's coming next): Everything
//         here — persistAndSync, render(), event delegation — is
//         about to be replaced by React's own re-rendering system
//         in Phase 3. Write 2-3 sentences: which parts of this file
//         do you think React will do FOR you automatically, and
//         which parts (the actual todo logic: add/toggle/delete)
//         do you think will stay basically the same?
//
// ANSWER: React takes over everything in the "rendering" and
// "events" sections — render()'s manual innerHTML rebuild, the
// single delegated listEl click/dblclick/focusout/keydown
// listeners, and the by-hand "highlight the active filter button"
// DOM class toggling. Calling setTodos(...) will just re-run the
// component function and React diffs the result for you; JSX
// event props (onClick, onDoubleClick) replace the dataset-action
// delegation trick entirely. What stays basically the same is the
// actual todo logic: addTodo/toggleTodo/deleteTodo/clearCompleted/
// editTodo will still be functions that take the current todos
// array and return a new one via map/filter/spread — that's the
// same immutable-update shape setTodos will expect — and
// persistAndSync's async/await around a server call is the same
// pattern a real fetch() to the Spring Boot backend will use.
