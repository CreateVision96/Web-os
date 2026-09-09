const availableThemes = ["default", "pink", "lavender", "mint", "sky", "luca"];

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

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("piko-theme") || "default";
  setTheme(savedTheme);
}

const availableWallpapers = [
  "wall0",
  "wall1",
  "wall2",
  "wall3",
  "wall4",
  "wall5",
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

  const startWallpaperName =
    animate && wallpaperName !== displayedWallpaperName
      ? displayedWallpaperName
      : wallpaperName;

  if (animate && wallpaperName !== displayedWallpaperName) {
    if (wallpaperTransitionTimer) {
      window.clearTimeout(wallpaperTransitionTimer);
    }

    document.documentElement.style.setProperty(
      "--bg-image",
      `url("${wallpaperFiles[startWallpaperName]}")`,
    );

    document.documentElement.style.setProperty(
      "--next-bg-image",
      `url("${wallpaperFile}")`,
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
        `url("${wallpaperFile}")`,
      );

      document.documentElement.style.setProperty(
        "--next-bg-image",
        `url("${wallpaperFile}")`,
      );

      body.classList.remove("wallpaper-changing");

      currentWallpaperName = wallpaperName;
      displayedWallpaperName = wallpaperName;
      wallpaperTransitionTimer = null;
    }, 250);
  } else {
    document.documentElement.style.setProperty(
      "--bg-image",
      `url("${wallpaperFile}")`,
    );

    document.documentElement.style.setProperty(
      "--next-bg-image",
      `url("${wallpaperFile}")`,
    );

    body.classList.remove("wallpaper-changing");

    currentWallpaperName = wallpaperName;
    displayedWallpaperName = wallpaperName;
  }

  displayedWallpaperName = wallpaperName;

  localStorage.setItem("piko-wallpaper", wallpaperName);

  document.querySelectorAll(".wallpaper-option").forEach(function (option) {
    option.classList.toggle(
      "active",
      option.dataset.wallpaper === wallpaperName,
    );
  });
}

function loadSavedWallpaper() {
  const savedWallpaper = localStorage.getItem("piko-wallpaper") || "wall0";

  setWallpaper(savedWallpaper, false);
}

export function initThemeSettings() {
  document.querySelectorAll(".theme-option").forEach(function (option) {
    option.addEventListener("click", function () {
      setTheme(option.dataset.theme);
    });
  });

  document.querySelectorAll(".wallpaper-option").forEach(function (option) {
    option.addEventListener("click", function () {
      setWallpaper(option.dataset.wallpaper);
    });
  });

  loadSavedTheme();
  loadSavedWallpaper();
}
