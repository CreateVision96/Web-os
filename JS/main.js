import { initThemeSettings } from "./theme.js";
import { renderDock, initDesktopContextMenu } from "./desk.js";
import { renderCalendar } from "./calendar.js";
import { initWeather } from "./weather.js";
import { bindWindowControls } from "./windows.js";
import {
  addNewNote,
  deleteActiveNote,
  populateSidebar,
  setNotesContent,
  updateActiveNoteContent,
  updateActiveNoteTitle,
} from "./notes.js";
import {
  backspaceCalc,
  calculateResult,
  clearCalc,
  percentCalc,
  pressCalc,
} from "./calculator.js";
import { renderGallery } from "./gallery.js";
import { initTodo, renderTodoList, renderTodoWidget } from "./todo.js";
import { initMusic } from "./music.js";
import { initVid } from "./pikotok.js";

Object.assign(window, {
  addNewNote,
  deleteActiveNote,
  updateActiveNoteContent,
  updateActiveNoteTitle,
  backspaceCalc,
  calculateResult,
  clearCalc,
  percentCalc,
  pressCalc,
});

function init() {
  initThemeSettings();
  renderDock();
  renderCalendar();
  initWeather();
  bindWindowControls();
  populateSidebar();
  setNotesContent(0);
  renderGallery();
  renderTodoList();
  renderTodoWidget();
  initTodo();
  initDesktopContextMenu();
  initMusic();
  initVid();
}

init();
