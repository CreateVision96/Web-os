/* -----------------------------
   Theme controls
   
----------------------------- */
const theme = {
    accent: "#0a84ff",
    accentStrong: "#399cff",
    backgroundImage: "images/bgimage.jpg",
    windowGlass: "rgba(255, 255, 255, 0.62)",
    dockGlass: "rgba(255, 255, 255, 0.16)",
    textMain: "#1c1c1e",
    textSoft: "#333333"
};

function applyTheme() {
    document.documentElement.style.setProperty("--bg-image", `url("${theme.backgroundImage}")`);
    document.documentElement.style.setProperty("--app-accent", theme.accent);
    document.documentElement.style.setProperty("--app-accent-strong", theme.accentStrong);
    document.documentElement.style.setProperty("--window-glass", theme.windowGlass);
    document.documentElement.style.setProperty("--dock-glass", theme.dockGlass);
    document.documentElement.style.setProperty("--text-main", theme.textMain);
    document.documentElement.style.setProperty("--text-soft", theme.textSoft);
}

applyTheme();

/* -----------------------------
   App registry
   
----------------------------- */
const appRegistry = [
    {
        id: "notes",
        label: "Notes",
        icon: "images/notes.png",
        windowId: "notes"
    },
    {
        id: "calculator",
        label: "Calc",
        icon: "images/calculator.png",
        windowId: "calculator"
    }
];

/* -----------------------------
   Desktop and dock rendering
----------------------------- */
function renderDockApps() {
    const dock = document.querySelector("#dock");
    if (!dock) return;

    dock.innerHTML = "";

    appRegistry.forEach(function (app) {
        const item = document.createElement("div");
        item.className = "dock-item";
        item.title = app.label;

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

/* -----------------------------
   Widgets section
----------------------------- */
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

/* -----------------------------
   Weather Widget
----------------------------- */

function weatherDescription(code){

    const map = {

        0:"Clear",

        1:"Mainly Clear",

        2:"Partly Cloudy",

        3:"Cloudy",

        45:"Fog",

        48:"Fog",

        51:"Light Drizzle",

        53:"Drizzle",

        55:"Heavy Drizzle",

        61:"Rain",

        63:"Rain",

        65:"Heavy Rain",

        71:"Snow",

        73:"Snow",

        75:"Heavy Snow",

        95:"Thunderstorm",

        96:"Thunderstorm",

        99:"Thunderstorm"

    };

    return map[code] || "Unknown";

}

async function loadWeather(latitude, longitude) {
    const locationElement = document.getElementById("weatherLocation");
    const tempElement = document.getElementById("weatherTemp");
    const conditionElement = document.getElementById("weatherCondition");
    const highLowElement = document.getElementById("weatherHighLow");

    if (!locationElement || !tempElement || !conditionElement || !highLowElement) return;

    try {
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const weather = await weatherResponse.json();

        let city = "";

        try {
            const geoResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const place = await geoResponse.json();
            city = place.city || place.locality || place.principalSubdivision || place.countryName || "";
        } catch (geoError) {
            console.warn("Reverse geocoding failed, leaving city empty.", geoError);
        }

        const currentTemp = weather.current?.temperature_2m;
        const weatherCode = weather.current?.weather_code;
        const maxTemp = weather.daily?.temperature_2m_max?.[0];
        const minTemp = weather.daily?.temperature_2m_min?.[0];

        locationElement.textContent = city || "Unknown location";
        tempElement.textContent = currentTemp !== undefined ? `${Math.round(currentTemp)}°` : "--°";
        conditionElement.textContent = weatherCode !== undefined ? weatherDescription(weatherCode) : "Weather unavailable";
        highLowElement.textContent =
            maxTemp !== undefined && minTemp !== undefined
                ? `H:${Math.round(maxTemp)}°  L:${Math.round(minTemp)}°`
                : "H:--° L:--°";
    } catch (error) {
        console.error(error);
        if (locationElement) locationElement.textContent = "Weather unavailable";
        if (tempElement) tempElement.textContent = "--°";
        if (conditionElement) conditionElement.textContent = "Unable to load weather";
        if (highLowElement) highLowElement.textContent = "H:--° L:--°";
    }
}

function updateWeatherClock(){

    document.getElementById("weatherTime").textContent =
        new Date().toLocaleTimeString([],{

            hour:"numeric",
            minute:"2-digit"
        });

}

function initWeather() {
    const locationElement = document.getElementById("weatherLocation");
    const tempElement = document.getElementById("weatherTemp");
    const conditionElement = document.getElementById("weatherCondition");
    const highLowElement = document.getElementById("weatherHighLow");

    if (!locationElement || !tempElement || !conditionElement || !highLowElement) return;

    // Indicate that we are attempting to resolve the user's city
    locationElement.textContent = "Locating…";

    if (!navigator.geolocation) {
        locationElement.textContent = "Location Unsupported";
        tempElement.textContent = "--°";
        conditionElement.textContent = "Weather unavailable";
        highLowElement.textContent = "H:--° L:--°";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            loadWeather(lat, lon);
            updateWeatherClock();
            setInterval(updateWeatherClock, 1000);
            setInterval(function () {
                loadWeather(lat, lon);
            }, 600000);
        },
        function () {
            locationElement.textContent = "Location Denied";
            tempElement.textContent = "--°";
            conditionElement.textContent = "Weather unavailable";
            highLowElement.textContent = "H:--° L:--°";
        }
    );
}
/* -----------------------------
   Clock functionality
----------------------------- */
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

/* -----------------------------
   Window drag and focus logic
----------------------------- */
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
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = moveElement;
    }

    function moveElement(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        const desktop = element.parentElement;
        const minTop = 40;
        const maxLeft = Math.max(0, desktop.clientWidth - element.offsetWidth);
        const maxTop = Math.max(minTop, desktop.clientHeight - element.offsetHeight - 12);

        const nextTop = Math.min(maxTop, Math.max(minTop, element.offsetTop - currentY));
        const nextLeft = Math.min(maxLeft, Math.max(0, element.offsetLeft - currentX));

        element.style.top = nextTop + "px";
        element.style.left = nextLeft + "px";
    }

    function stopDragging() {
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

function openWindow(element) {
    if (!element) return;

    element.style.display = "block";
    element.classList.remove("is-closing");
    void element.offsetWidth;
    element.classList.add("is-open");
    bringWindowToFront(element);
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
    element.classList.toggle("maximized");
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

/* -----------------------------
   Welcome window
----------------------------- */
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

/* -----------------------------
   Notes app logic
----------------------------- */
let activeNoteIndex = 0;
const notesData = [
    {
        title: "Welcome Note",
        date: new Date().toLocaleDateString(),
        content: "Welcome to MentOS Notes!\nClick '+ New Note' to create your own."
    }
];

function setNotesContent(index) {
    activeNoteIndex = index;
    const titleInput = document.querySelector("#noteTitleInput");
    const contentInput = document.querySelector("#noteContentInput");

    if (titleInput && contentInput && notesData[index]) {
        titleInput.value = notesData[index].title;
        contentInput.value = notesData[index].content;
    }

    populateSidebar();
}

function updateActiveNoteTitle(val) {
    notesData[activeNoteIndex].title = val || "Untitled Note";
    populateSidebar();
}

function updateActiveNoteContent(val) {
    notesData[activeNoteIndex].content = val;
}

function addNewNote() {
    const newNote = {
        title: "Untitled Note",
        date: new Date().toLocaleDateString(),
        content: ""
    };

    notesData.push(newNote);
    setNotesContent(notesData.length - 1);
}

function deleteActiveNote() {
    if (notesData.length <= 1) {
        notesData[0] = { title: "Untitled Note", date: new Date().toLocaleDateString(), content: "" };
        setNotesContent(0);
        return;
    }

    notesData.splice(activeNoteIndex, 1);
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

/* -----------------------------
   Calculator logic
----------------------------- */
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

/* -----------------------------
   Initialization
----------------------------- */
function init() {
    renderDockApps();
    renderCalendar();
    initWeather(); 
    bindWindowControls();
    populateSidebar();
    setNotesContent(0);
}

init();