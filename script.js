const availableThemes = [
    "default",
    "pink",
    "lavender",
    "mint",
    "sky",
    "luca",
];

function updateThemeSelection(themeName) {
    document.querySelectorAll(".theme-option").forEach(function (option) {
        option.classList.toggle("active", option.dataset.theme === themeName);
    });
}

function setTheme(themeName) {
    if (!availableThemes.includes(themeName)) {
        themeName = "default";
    }

    if (themeName === "default") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", themeName);
    }

    localStorage.setItem("piko-theme", themeName);
    updateThemeSelection(themeName);
}
function loadSavedTheme(){
    const savedTheme=localStorage.getItem("piko-theme") || "default";
    setTheme(savedTheme);
}
function initThemeSettings(){
    document.querySelectorAll(".theme-option").forEach(function(option){
        option.addEventListener("click", function(){
            setTheme(option.dataset.theme);
        });
    });
    loadSavedTheme();
}

const availableWallpapers = [
    "wall0",
    "wall1",
    "wall2",
    "wall3",
    "wall4",
    "wall5"
];

let currentWallpaperName = "wall0";
let displayedWallpaperName = "wall0";
let wallpaperTransitionTimer = null;
let wallpaperTransitionVersion = 0;

const wallpaperFiles = {
    wall0: "images/wallpaper/wall0.png",
    wall1: "images/wallpaper/wall1.png",
    wall2: "images/wallpaper/wall2.jpg",
    wall3: "images/wallpaper/wall3.png",
    wall4: "images/wallpaper/wall4.jpg",
    wall5: "images/wallpaper/wall5.png",
};

function setWallpaper(wallpaperName, animate = true) {
    if (!availableWallpapers.includes(wallpaperName)) {
        wallpaperName = "wall0";
    }

    const wallpaperFile = wallpaperFiles[wallpaperName];
    const body = document.body;
    const transitionId = ++wallpaperTransitionVersion;
    const startWallpaperName = animate && wallpaperName !== displayedWallpaperName
        ? displayedWallpaperName
        : wallpaperName;

    if (animate && wallpaperName !== displayedWallpaperName) {
        if (wallpaperTransitionTimer) {
            window.clearTimeout(wallpaperTransitionTimer);
        }

        document.documentElement.style.setProperty(
            "--bg-image",
            `url("${wallpaperFiles[startWallpaperName]}")`
        );
        document.documentElement.style.setProperty(
            "--next-bg-image",
            `url("${wallpaperFile}")`
        );

        body.classList.remove("wallpaper-changing");
        void body.offsetWidth;
        body.classList.add("wallpaper-changing");

        wallpaperTransitionTimer = window.setTimeout(function () {
            if (transitionId !== wallpaperTransitionVersion) {
                return;
            }

            document.documentElement.style.setProperty(
                "--bg-image",
                `url("${wallpaperFile}")`
            );
            document.documentElement.style.setProperty(
                "--next-bg-image",
                `url("${wallpaperFile}")`
            );
            body.classList.remove("wallpaper-changing");
            currentWallpaperName = wallpaperName;
            displayedWallpaperName = wallpaperName;
            wallpaperTransitionTimer = null;
        }, 250);
    } else {
        document.documentElement.style.setProperty(
            "--bg-image",
            `url("${wallpaperFile}")`
        );
        document.documentElement.style.setProperty(
            "--next-bg-image",
            `url("${wallpaperFile}")`
        );
        body.classList.remove("wallpaper-changing");
        currentWallpaperName = wallpaperName;
        displayedWallpaperName = wallpaperName;
    }

    displayedWallpaperName = wallpaperName;
    localStorage.setItem("piko-wallpaper", wallpaperName);

    document.querySelectorAll(".wallpaper-option").forEach(function(option) {
        option.classList.toggle(
            "active",
            option.dataset.wallpaper === wallpaperName
        );
    });
}

function loadSavedWallpaper() {
    const savedWallpaper =
        localStorage.getItem("piko-wallpaper") || "wall0";

    setWallpaper(savedWallpaper, false);
}

function initWallpaperSettings() {
    document.querySelectorAll(".wallpaper-option").forEach(function(option) {
        option.addEventListener("click", function() {
            setWallpaper(option.dataset.wallpaper);
        });
    });

    loadSavedWallpaper();
}
const appRegistry = [
    {
        id: "notes",
        label: "Notes",
        icon: "images/icons/notes.svg",
        windowId: "notes"
    },
    {
        id: "calculator",
        label: "Calculator",
        icon: "images/icons/calculator.svg",
        windowId: "calculator"
    },
    {
        id: "gallery",
        label: "Gallery",
        icon: "images/icons/gallery.svg",
        windowId: "gallery"
    },
    {
        id: "browser",
        label: "Browser",
        icon: "images/icons/browser.svg",
        windowId: "browser"
    },
    {
        id: "todo",
        label:"Todo",
        icon:"images/icons/todo.svg",
        windowId: "todo"
    },
    {
        id: "settings",
        label: "Settings",
        icon: "images/icons/settings.svg",
        windowId: "settings"
    }
];

function renderDockApps() {
    const dock = document.querySelector("#dock");
    if (!dock) return;

    dock.innerHTML = "";

    appRegistry.forEach(function (app) {
        const item = document.createElement("div");
        item.className = "dock-item";
        item.dataset.label = app.label;
        item.dataset.windowId = app.windowId;

        item.innerHTML = `
            <img src="${app.icon}" class="dock-icon-image" alt="${app.label}">
        `;

        item.addEventListener("click", function () {
            const targetWindow = document.querySelector(`#${app.windowId}`);
            toggleWindowVisibility(targetWindow);
        });

        dock.appendChild(item);
    });
}

function renderCalendar() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const today = now.getDate();

    const monthElement = document.getElementById("calendarMonth");
    const yearElement = document.getElementById("calendarYear");
    const todayElement = document.getElementById("calendarToday");
    const grid = document.getElementById("calendarGrid");

    if (monthElement) {
        monthElement.textContent = now.toLocaleString("default", { month: "long" });
    }

    if (yearElement) {
        yearElement.textContent = String(year);
    }

    if (todayElement) {
        todayElement.textContent = String(today);
    }

    if (!grid) return;

    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i += 1) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day empty";
        grid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const dayElement = document.createElement("div");
        dayElement.className = `calendar-day${day === today ? " today" : ""}`;
        dayElement.textContent = String(day);
        grid.appendChild(dayElement);
    }
}


function setWeatherUnavailable() {
    const locationElement = document.getElementById("weatherLocation");
    const tempElement = document.getElementById("weatherTemp");
    const conditionElement = document.getElementById("weatherCondition");
    const highLowElement = document.getElementById("weatherHighLow");
    const timeElement = document.getElementById("weatherTime");

    if (locationElement) locationElement.textContent = "New York";
    if (tempElement) tempElement.textContent = "--°";
    if (conditionElement) conditionElement.textContent = "";
    if (highLowElement) highLowElement.textContent = "";
    if (timeElement) timeElement.textContent = "--:--";
}

async function loadWeather() {
    try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FNew_York";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather request failed");
        }

        const data = await response.json();
        const current = data.current_weather || null;
        const daily = data.daily || null;

        const locationElement = document.getElementById("weatherLocation");
        const tempElement = document.getElementById("weatherTemp");
        const conditionElement = document.getElementById("weatherCondition");
        const highLowElement = document.getElementById("weatherHighLow");
        const timeElement = document.getElementById("weatherTime");

        function weatherCodeToText(code) {
            const map = {
                0: "Clear",
                1: "Mainly clear",
                2: "Partly cloudy",
                3: "Overcast",
                45: "Fog",
                48: "Depositing rime fog",
                51: "Light drizzle",
                53: "Moderate drizzle",
                55: "Dense drizzle",
                56: "Freezing drizzle",
                57: "Dense freezing drizzle",
                61: "Light rain",
                63: "Moderate rain",
                65: "Heavy rain",
                66: "Freezing rain",
                67: "Heavy freezing rain",
                71: "Light snow",
                73: "Moderate snow",
                75: "Heavy snow",
                77: "Snow grains",
                80: "Slight rain showers",
                81: "Moderate rain showers",
                82: "Violent rain showers",
                85: "Slight snow showers",
                86: "Heavy snow showers",
                95: "Thunderstorm",
                96: "Thunderstorm with slight hail",
                99: "Thunderstorm with heavy hail"
            };
            return map[code] || "";
        }

        if (locationElement) locationElement.textContent = "New York";

        if (current && tempElement) {
            tempElement.textContent = `${Math.round(current.temperature)}°`;
        } else if (tempElement) {
            tempElement.textContent = "--°";
        }

        if (conditionElement) {
            conditionElement.textContent = current ? weatherCodeToText(current.weathercode) : "";
        }

        if (highLowElement && daily && Array.isArray(daily.temperature_2m_max) && daily.temperature_2m_max.length > 0) {
            const hi = Math.round(daily.temperature_2m_max[0]);
            const lo = Math.round(daily.temperature_2m_min[0]);
            highLowElement.textContent = `${hi}° / ${lo}°`;
        } else if (highLowElement) {
            highLowElement.textContent = "N/A";
        }

        if (timeElement) {
           
            if (current && current.time) {
                const t = new Date(current.time);
                if (!isNaN(t)) {
                    timeElement.textContent = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                } else {
                    timeElement.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                }
            } else {
                timeElement.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            }
        }
    } catch (error) {
        console.error("Weather fetch failed:", error);
        setWeatherUnavailable();
    }
}

function initWeather() {
    loadWeather();
    setInterval(loadWeather, 10 * 60 * 1000);
}
/*Clock functionality */
function updateTime() {
    const now = new Date();
    const timeText = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
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
            desktop.clientWidth - element.offsetWidth - edgePadding
        );

        const maxTop = Math.max(
            menuHeight,
            desktop.clientHeight -
            element.offsetHeight -
            dockHeight -
            edgePadding
        );

        element.style.left =
            `${Math.min(maxLeft, Math.max(edgePadding, nextLeft))}px`;

        element.style.top =
            `${Math.min(maxTop, Math.max(menuHeight, nextTop))}px`;
    }

    function stopDragging() {
    element.style.transition = "";

    document.onmouseup = null;
    document.onmousemove = null;
}
}

let biggestIndex = 10;
let selectedIcon;

function handleIconTap(element) {
    if (selectedIcon && selectedIcon !== element) {
        selectedIcon.classList.remove("selected");
    }
    element.classList.add("selected");
    selectedIcon = element;
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

    const dockItem = document.querySelector(`.dock-item[data-window-id="${element.id}"]`);
    if (!dockItem) return;

    const isVisible = element.style.display === "block" && element.classList.contains("is-open");
    dockItem.classList.toggle("active", isVisible);
}

function clampWindowToViewport(element) {
    if (!element) return;

    const desktop = element.parentElement;
    if (!desktop) return;

    const edgePadding = 16;
    const menuHeight = 72;
    const dockHeight = 92;
    const fallbackTop = Math.max(menuHeight + 16, Math.min(120, (desktop.clientHeight - element.offsetHeight - dockHeight) / 2));
    const fallbackLeft = Math.max(edgePadding, (desktop.clientWidth - element.offsetWidth) / 2);
    const parsedTop = parseFloat(element.style.top);
    const parsedLeft = parseFloat(element.style.left);
    const nextTop = Number.isFinite(parsedTop) ? parsedTop : fallbackTop;
    const nextLeft = Number.isFinite(parsedLeft) ? parsedLeft : fallbackLeft;
    const maxLeft = Math.max(edgePadding, desktop.clientWidth - element.offsetWidth - edgePadding);
    const maxTop = Math.max(menuHeight, desktop.clientHeight - element.offsetHeight - dockHeight - edgePadding);

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

function toggleWindowVisibility(element) {
    if (!element) return;

    if (element.style.display === "block" && element.classList.contains("is-open")) {
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

function bindWindowControls() {
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

let activeNoteIndex = 0;
let notesData;

try {
    notesData = JSON.parse(localStorage.getItem("piko-notes")) || [
        {
            title: "Welcome Note",
            date: new Date().toLocaleDateString(),
            content: "Welcome to Piko Notes!\nClick '+ New Note' to create your own."
        }
    ];
} catch (e) {
    notesData = [
        {
            title: "Welcome Note",
            date: new Date().toLocaleDateString(),
            content: "Welcome to Piko Notes!\nClick '+ New Note' to create your own."
        }
    ];
}

function saveNotes(){
    localStorage.setItem(
        "piko-notes",
        JSON.stringify(notesData)
    );
}

function autoResizeNoteEditor() {
    const contentInput = document.querySelector("#noteContentInput");
    if (!contentInput) return;

    contentInput.style.height = "auto";
    contentInput.style.height = `${Math.max(140, contentInput.scrollHeight)}px`;
}

function setNotesContent(index) {
    activeNoteIndex = index;
    const titleInput = document.querySelector("#noteTitleInput");
    const contentInput = document.querySelector("#noteContentInput");

    if (titleInput && contentInput && notesData[index]) {
        titleInput.value = notesData[index].title;
        contentInput.value = notesData[index].content;
    }

    populateSidebar();
    autoResizeNoteEditor();
}

function updateActiveNoteTitle(val) {
    notesData[activeNoteIndex].title = val || "Untitled Note";
    saveNotes();
    populateSidebar();
}

function updateActiveNoteContent(val) {
    notesData[activeNoteIndex].content = val;
    saveNotes();
    autoResizeNoteEditor();
}

function addNewNote() {
    const newNote = {
        title: "Untitled Note",
        date: new Date().toLocaleDateString(),
        content: ""
    };

    notesData.push(newNote);
    saveNotes();
    setNotesContent(notesData.length - 1);

    showNotification(
        "Notes",
        "New note created"
    );

}

function deleteActiveNote() {
    if (notesData.length <= 1) {
        notesData[0] = {
             title: "Untitled Note",
              date: new Date().toLocaleDateString(),
               content: "" 
            };
            saveNotes();
        setNotesContent(0);

        
        showNotification(
            "Notes",
            "Note cleared"
        );
        return;
    }

    notesData.splice(activeNoteIndex, 1);
    saveNotes();

    const nextIndex = Math.max(0, activeNoteIndex - 1);
    setNotesContent(nextIndex);
}

function populateSidebar() {
    const sidebar = document.querySelector("#sidebar");
    if (!sidebar) return;

    sidebar.innerHTML = "";

    notesData.forEach(function (note, index) {
        const item = document.createElement("div");
        item.className = "sidebar-item" + (index === activeNoteIndex ? " active-note" : "");
        item.innerHTML = `<strong>${escapeHtml(note.title)}</strong><br><small>${escapeHtml(note.date)}</small>`;

        item.addEventListener("click", function () {
            setNotesContent(index);
        });

        sidebar.appendChild(item);
    });
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

const calcDisplay = document.querySelector("#calcDisplay");

function pressCalc(val) {
    if (!calcDisplay) return;

    if (calcDisplay.value === "0" || calcDisplay.value === "Error") {
        calcDisplay.value = (val === ".") ? "0." : val;
    } else {
        calcDisplay.value += val;
    }
}

function backspaceCalc() {
    if (!calcDisplay) return;

    if (calcDisplay.value.length <= 1 || calcDisplay.value === "Error") {
        calcDisplay.value = "0";
    } else {
        calcDisplay.value = calcDisplay.value.slice(0, -1);
    }
}

function clearCalc() {
    if (calcDisplay) {
        calcDisplay.value = "0";
    }
}

function percentCalc() {
    if (!calcDisplay) return;
    const num = parseFloat(calcDisplay.value);

    if (!isNaN(num)) {
        calcDisplay.value = String(num / 100);
    }
}

function calculateResult() {
    if (!calcDisplay) return;

    const expression = calcDisplay.value;

    if (!/^[0-9+\-*/.]+$/.test(expression)) {
        calcDisplay.value = "Error";
        return;
    }

    try {
        const result = Function('"use strict"; return (' + expression + ")")();
        if (!isFinite(result)) {
            calcDisplay.value = "Error";
        } else {
            calcDisplay.value = String(result);
        }
    } catch (e) {
        calcDisplay.value = "Error";
    }
}
const galleryImages = [
    "images/gallery/1 (1).jpg",
    "images/gallery/1 (2).jpg",
    "images/gallery/1 (3).jpg",
    "images/gallery/1 (4).jpg",
    "images/gallery/1 (5).jpg",
    "images/gallery/1 (6).jpg",
    "images/gallery/1 (7).jpg",
    "images/gallery/1 (8).jpg",
    "images/gallery/1 (9).jpg",
    "images/gallery/1 (10).jpg",
    "images/gallery/1 (11).jpg",
    "images/gallery/1 (12).jpg",
    "images/gallery/1 (13).jpg",
    "images/gallery/1 (14).jpg",
];

function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    galleryImages.forEach(src => {
        const item = document.createElement("div");
        item.className = "gallery-item";

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Gallery Image";

        item.appendChild(img);
        grid.appendChild(item);
    });
}

let todoData = [];

try{
    todoData = JSON.parse(
        localStorage.getItem("piko-todo")
    ) || [];
} catch (e) {
    todoData = [];
}
function saveTodos() {
    localStorage.setItem(
        "piko-todo",
        JSON.stringify(todoData)
    );
}

function renderTodoList() {
    const list = document.getElementById("todoList");
    if (!list) return;

    list.innerHTML = "";

    todoData.forEach((task, index) => {
        const item = document.createElement("div");
        item.className = "todo-item";
        if (task.done) item.classList.add("todo-done");

        item.innerHTML = `
            <input type="checkbox" ${task.done ? "checked" : ""} >
            <span class="todo-text">${task.text}</span>
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
    task.done ? "Task complete" : "Task marked incomeplete"
);
            });
        }

        if (btn) {
            btn.addEventListener("click", () => {
                todoData.splice(index, 1);
                saveTodos();
renderTodoList();
renderTodoWidget();

showNotification(
    "Todo",
    "Task Removed"
);
            });
        }

        list.appendChild(item);
    });
}

function addTodoTask() {
    const input = document.getElementById("todoInput");
    if (!input || !input.value.trim()) return;

    todoData.push({
        text: input.value.trim(),
        done: false
    });
    saveTodos();
    input.value = "";
renderTodoList();
renderTodoWidget();

showNotification(
    "Todo",
    "New Task Added"
);
}
function renderTodoWidget(){
    const widgetList = document.getElementById("todoWidgetList");
    if (!widgetList) return;
    widgetList.innerHTML= "";
    if (todoData.length === 0){
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
        item.className= "todo-widget-item";
        if (task.done) {
            item.classList.add("todo-done");
        }
        item.innerHTML = `
            <input type="checkbox" ${task.done ? "checked" : ""} >
            <span class="todo-text">${escapeHtml(task.text)}</span>
        `;
        const checkbox = item.querySelector("input");
        checkbox.addEventListener("change", function(e){
            e.stopPropagation();

            task.done = checkbox.checked;
            saveTodos();
            renderTodoList();
            renderTodoWidget();
        });

        item.addEventListener("click", function (){
            openAppWindowById("todo");
        });
        widgetList.appendChild(item);
    });

}

    function openAppWindowById(id) {
    const windowElement = document.getElementById(id);
    if (!windowElement) return;
    openWindow(windowElement);
}

function initDesktopContextMenu() {
    const menu = document.getElementById("desktopContextMenu");
    if (!menu) return;

    document.addEventListener("contextmenu", e => {

        if (
            e.target.closest(".window") ||
            e.target.closest(".dock") ||
            e.target.closest(".widget") ||
            e.target.closest(".menubar")
        )
            return;

        e.preventDefault();
        menu.style.display = "block";
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
    });

    document.addEventListener("click", () => {
        menu.style.display = "none";
    });

    const newNoteBtn = menu.querySelector('[data-action="new-note"]');
    const todoBtn = menu.querySelector('[data-action="todo"]');
    const settingsBtn = menu.querySelector('[data-action="settings"]');
    const aboutBtn = menu.querySelector('[data-action="about"]');

    if (newNoteBtn) newNoteBtn.onclick = () => {
    menu.style.display = "none";
    openAppWindowById("notes");
    addNewNote();
};
    if (todoBtn) todoBtn.onclick = () => { openAppWindowById("todo"); };
    if (settingsBtn) settingsBtn.onclick = () => { openAppWindowById("settings"); };
    if (aboutBtn) aboutBtn.onclick = () => { openAppWindowById("about"); };
}

function showNotification(title, message, duration = 2500) {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
    <div class="notification-title">
    ${escapeHtml(title)}
    </div>
    <div class="notification-message">
    ${escapeHtml(message)}
    </div>
    `;

container.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    setTimeout(() => {
        notification.classList.remove("show");

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

function init() {
    initThemeSettings();
    initWallpaperSettings();
    renderDockApps();
    renderCalendar();
    initWeather();
    bindWindowControls();
    populateSidebar();
    setNotesContent(0);

    renderGallery();
    renderTodoList();
    renderTodoWidget();
    initDesktopContextMenu();
}

init();