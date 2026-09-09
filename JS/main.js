import { initThemeSettings } from "./theme.js";
import { renderDock, initDesktopContextMenu } from "./desk.js";
import { renderCalendar } from "./calendar.js";
import { initWeather } from "./weather.js";
import { bindWindowControls } from "./windows.js";
import { populateSidebar, setNotesContent } from "./notes.js";
import { renderGallery } from "./gallery.js";
import { initTodo, renderTodoList, renderTodoWidget } from "./todo.js";
import { initMusic } from "./music.js";

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
}

init();
