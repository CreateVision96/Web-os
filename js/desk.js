import { toggleWindowVisibility, openAppWindowById } from "./windows.js";

import { addNewNote } from "./notes.js";

const appRegistry = [
  {
    id: "notes",
    label: "Notes",
    icon: "images/icons/notes.svg",
    windowId: "notes",
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: "images/icons/calculator.svg",
    windowId: "calculator",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: "images/icons/gallery.svg",
    windowId: "gallery",
  },
  {
    id: "games",
    label: "Games",
    icon: "images/icons/game.svg",
    windowId: "games",
  },
  {
    id: "music",
    label: "Music",
    icon: "images/icons/music.svg",
    windowId: "music",
  },
  {
    id: "vid",
    label: "PikoTok",
    icon: "images/icons/vid.svg",
    windowId: "vid",
  },
  {
    id: "browser",
    label: "Browser",
    icon: "images/icons/browser.svg",
    windowId: "browser",
  },
  {
    id: "todo",
    label: "Todo",
    icon: "images/icons/todo.svg",
    windowId: "todo",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "images/icons/settings.svg",
    windowId: "settings",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: "images/icons/terminal.svg",
    windowId: "terminal",
  },
];

export function renderDock() {
  const dock = document.querySelector("#dock");
  if (!dock) return;

  dock.innerHTML = "";

  appRegistry.forEach(function (app) {
    const item = document.createElement("div");

    item.className = "dock-item";
    item.dataset.label = app.label;
    item.dataset.windowId = app.windowId;

    item.innerHTML = `
  <img src="${app.icon}" class="dock-iconImage" alt="${app.label}">
`;

    item.addEventListener("click", function () {
      const targetWindow = document.querySelector(`#${app.windowId}`);
      toggleWindowVisibility(targetWindow);
    });

    dock.appendChild(item);
  });
}

export function initDesktopContextMenu() {
  const menu = document.getElementById("desktopContextMenu");
  if (!menu) return;

  document.addEventListener("contextmenu", function (e) {
    if (
      e.target.closest(".window") ||
      e.target.closest(".dock") ||
      e.target.closest(".widget") ||
      e.target.closest(".menubar")
    ) {
      return;
    }

    e.preventDefault();

    menu.style.display = "block";

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 8;
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 8;
    }

    x = Math.max(8, x);
    y = Math.max(8, y);

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.style.animation = "none";

    requestAnimationFrame(function () {
      menu.style.animation = "contextMenuIn 0.15s ease-out";
    });
  });

  document.addEventListener("click", function () {
    menu.style.display = "none";
  });

  const newNoteBtn = menu.querySelector('[data-action="new-note"]');
  const todoBtn = menu.querySelector('[data-action="todo"]');
  const settingsBtn = menu.querySelector('[data-action="settings"]');
  const aboutBtn = menu.querySelector('[data-action="about"]');

  if (newNoteBtn) {
    newNoteBtn.onclick = function () {
      menu.style.display = "none";
      openAppWindowById("notes");
      addNewNote();
    };
  }

  if (todoBtn) {
    todoBtn.onclick = function () {
      menu.style.display = "none";
      openAppWindowById("todo");
    };
  }

  if (settingsBtn) {
    settingsBtn.onclick = function () {
      menu.style.display = "none";
      openAppWindowById("settings");
    };
  }

  if (aboutBtn) {
    aboutBtn.onclick = function () {
      menu.style.display = "none";
      openAppWindowById("about");
    };
  }
}
