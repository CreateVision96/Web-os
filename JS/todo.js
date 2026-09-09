import { showNotification, escapeHTML } from "./notifs.js";
import { openAppWindowById } from "./windows.js";

let todoData = [];

try {
  todoData = JSON.parse(localStorage.getItem("piko-todo")) || [];
} catch (e) {
  todoData = [];
}

function saveTodos() {
  localStorage.setItem("piko-todo", JSON.stringify(todoData));
}

export function renderTodoList() {
  const list = document.getElementById("todoList");
  if (!list) return;

  list.innerHTML = "";

  todoData.forEach((task, index) => {
    const item = document.createElement("div");

    item.className = "todo-item";

    if (task.done) {
      item.classList.add("todo-done");
    }

    item.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span class="todo-text">${escapeHTML(task.text)}</span>
      <button class="button todo-remove-btn">Remove</button>
    `;

    const checkbox = item.querySelector("input");
    const btn = item.querySelector("button");

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        task.done = !task.done;

        saveTodos();
        renderTodoList();
        renderTodoWidget();

        showNotification(
          "Todo",
          task.done ? "Task complete" : "Task marked incomplete",
        );
      });
    }

    if (btn) {
      btn.addEventListener("click", () => {
        todoData.splice(index, 1);

        saveTodos();
        renderTodoList();
        renderTodoWidget();

        showNotification("Todo", "Task Removed");
      });
    }

    list.appendChild(item);
  });
}

export function addTodoTask() {
  const input = document.getElementById("todoInput");

  if (!input || !input.value.trim()) return;

  todoData.push({
    text: input.value.trim(),
    done: false,
  });

  saveTodos();

  input.value = "";

  renderTodoList();
  renderTodoWidget();

  showNotification("Todo", "New Task Added");
}

export function renderTodoWidget() {
  const widgetList = document.getElementById("todoWidgetList");

  if (!widgetList) return;

  widgetList.innerHTML = "";

  if (todoData.length === 0) {
    const empty = document.createElement("div");

    empty.className = "todo-widget-empty";
    empty.textContent = "Add more in the app";

    empty.addEventListener("click", function () {
      openAppWindowById("todo");
    });

    widgetList.appendChild(empty);

    return;
  }

  todoData.slice(0, 3).forEach(function (task) {
    const item = document.createElement("div");

    item.className = "todo-widget-item";

    if (task.done) {
      item.classList.add("todo-done");
    }

    item.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span class="todo-text">${escapeHTML(task.text)}</span>
    `;

    const checkbox = item.querySelector("input");

    checkbox.addEventListener("change", function (e) {
      e.stopPropagation();

      task.done = checkbox.checked;

      saveTodos();
      renderTodoList();
      renderTodoWidget();
    });

    item.addEventListener("click", function () {
      openAppWindowById("todo");
    });

    widgetList.appendChild(item);
  });
}

export function initTodo() {
  const addButton = document.querySelector('#todo [data-action="add-todo"]');

  if (addButton) {
    addButton.addEventListener("click", addTodoTask);
  }
}
