import { stopMusicPlayback } from "./music.js";

let biggestIndex = 10;
let selectedIcon;

function updateTime() {
  const now = new Date();

  const timeText = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const clockElement = document.querySelector("#timeeElement");

  if (clockElement) {
    clockElement.textContent = timeText;
  }
}

setInterval(updateTime, 1000);
updateTime();

function dragElement(element) {
  if (!element) return;

  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;

  const header = document.getElementById(element.id + "header");
  const dragTarget = header || element;

  dragTarget.onmousedown = startDragging;

  function startDragging(e) {
    if (element.classList.contains("maximized")) return;

    e = e || window.event;
    e.preventDefault();

    element.style.transition = "none";

    initialX = e.clientX;
    initialY = e.clientY;
    currentX = element.offsetLeft;
    currentY = element.offsetTop;

    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }

  function moveElement(e) {
    e = e || window.event;
    e.preventDefault();

    const deltaX = e.clientX - initialX;
    const deltaY = e.clientY - initialY;

    const nextLeft = currentX + deltaX;
    const nextTop = currentY + deltaY;

    const desktop = element.parentElement;
    if (!desktop) return;

    const edgePadding = 16;
    const menuHeight = 72;
    const dockHeight = 92;

    const maxLeft = Math.max(
      edgePadding,
      desktop.clientWidth - element.offsetWidth - edgePadding,
    );

    const maxTop = Math.max(
      menuHeight,
      desktop.clientHeight - element.offsetHeight - dockHeight - edgePadding,
    );

    element.style.left = `${Math.min(maxLeft, Math.max(edgePadding, nextLeft))}px`;

    element.style.top = `${Math.min(maxTop, Math.max(menuHeight, nextTop))}px`;
  }

  function stopDragging() {
    element.style.transition = "";

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function bringWindowToFront(element) {
  if (!element) return;

  biggestIndex += 1;
  element.style.zIndex = biggestIndex;
}

function handleWindowTap(element) {
  bringWindowToFront(element);
}

function syncDockItemState(element) {
  if (!element) return;

  const dockItem = document.querySelector(
    `.dock-item[data-window-id="${element.id}"]`,
  );

  if (!dockItem) return;

  const isVisible =
    element.style.display === "block" && element.classList.contains("is-open");

  dockItem.classList.toggle("active", isVisible);
}

function clampWindowToViewport(element) {
  if (!element) return;

  const desktop = element.parentElement;
  if (!desktop) return;

  const edgePadding = 16;
  const menuHeight = 72;
  const dockHeight = 92;

  const fallbackTop = Math.max(
    menuHeight + 16,
    Math.min(
      120,
      (desktop.clientHeight - element.offsetHeight - dockHeight) / 2,
    ),
  );

  const fallbackLeft = Math.max(
    edgePadding,
    (desktop.clientWidth - element.offsetWidth) / 2,
  );

  const parsedTop = parseFloat(element.style.top);
  const parsedLeft = parseFloat(element.style.left);

  const nextTop = Number.isFinite(parsedTop) ? parsedTop : fallbackTop;
  const nextLeft = Number.isFinite(parsedLeft) ? parsedLeft : fallbackLeft;

  const maxLeft = Math.max(
    edgePadding,
    desktop.clientWidth - element.offsetWidth - edgePadding,
  );

  const maxTop = Math.max(
    menuHeight,
    desktop.clientHeight - element.offsetHeight - dockHeight - edgePadding,
  );

  element.style.left = `${Math.min(maxLeft, Math.max(edgePadding, nextLeft))}px`;

  element.style.top = `${Math.min(maxTop, Math.max(menuHeight, nextTop))}px`;
}

function openWindow(element) {
  if (!element) return;

  element.style.display = "block";
  clampWindowToViewport(element);

  element.classList.remove("is-closing");

  void element.offsetWidth;

  element.classList.add("is-open");

  bringWindowToFront(element);
  syncDockItemState(element);
}

function closeWindow(element) {
  if (!element) return;
  if (element.style.display === "none") return;

  if (element.id === "music") {
    stopMusicPlayback();
  }

  element.classList.remove("is-open");
  element.classList.add("is-closing");

  window.setTimeout(function () {
    if (element.classList.contains("is-closing")) {
      element.style.display = "none";
      element.classList.remove("is-closing");
      syncDockItemState(element);
    }
  }, 180);
}

export function toggleWindowVisibility(element) {
  if (!element) return;

  if (
    element.style.display === "block" &&
    element.classList.contains("is-open")
  ) {
    closeWindow(element);
  } else {
    openWindow(element);
  }
}

function toggleMaximize(element) {
  if (!element) return;

  element.style.transition = `
    top 0.3s ease,
    left 0.3s ease,
    right 0.3s ease,
    bottom 0.3s ease,
    width 0.3s ease,
    height 0.3s ease
  `;

  void element.offsetWidth;

  element.classList.toggle("maximized");

  setTimeout(() => {
    element.style.transition = "";
  }, 320);
}

export function bindWindowControls() {
  document.querySelectorAll(".window").forEach(function (win) {
    dragElement(win);

    win.addEventListener("mousedown", function () {
      handleWindowTap(win);
    });

    const closeBtn = win.querySelector(".control-button.close");
    const minimizeBtn = win.querySelector(".control-button.minimize");
    const zoomBtn = win.querySelector(".control-button.zoom");

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeWindow(win);
      });
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeWindow(win);
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleMaximize(win);
      });
    }
  });
}

export function openAppWindowById(id) {
  const windowElement = document.getElementById(id);

  if (!windowElement) return;

  openWindow(windowElement);
}

const welcomeScreen = document.querySelector("#welcome");
const welcomeOpenBtn = document.querySelector("#welcomeopen");

if (welcomeOpenBtn) {
  welcomeOpenBtn.addEventListener("click", function () {
    openWindow(welcomeScreen);
  });
}

if (welcomeScreen) {
  openWindow(welcomeScreen);
}
