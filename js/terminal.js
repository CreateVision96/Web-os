import { openAppWindowById } from "./windows.js";

const terminalOutput = document.getElementById("terminalOutput");
const terminalInput = document.getElementById("terminalInput");

let terminalHistory = [];
let terminalHistoryIndex = -1;

const terminalApps = {
  notes: "notes",
  calculator: "calculator",
  gallery: "gallery",
  games: "games",
  music: "music",
  pikotok: "vid",
  vid: "vid",
  browser: "browser",
  todo: "todo",
  settings: "settings",
  about: "about",
  terminal: "terminal",
};

function terminalPrint(text = "", type = "response") {
  if (!terminalOutput) return;

  const line = document.createElement("div");

  line.className = `terminal-line terminal-${type}`;

  line.textContent = text;

  terminalOutput.appendChild(line);

  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function terminalPrintMultiline(text, type = "response") {
  String(text)
    .split("\n")
    .forEach(function (line) {
      terminalPrint(line, type);
    });
}

function terminalPrintCommand(command) {
  terminalPrint(`user@piko:~$ ${command}`, "command");
}

function terminalHelp() {
  terminalPrintMultiline(
    `Available commands:

help        Show this help message
clear       Clear the terminal
date        Show the current date
time        Show the current time
about       About Piko
version     Show Piko version
apps        List installed apps
open <app>  Open an app
echo <text> Print text
history     Show command history`,
  );
}

function terminalShowApps() {
  terminalPrintMultiline(
    `Installed apps:

Notes
Calculator
Gallery
Games
Music
PikoTok
Browser
Terminal
Todo
Settings`,
  );
}

function terminalOpenApp(appName) {
  const normalizedName = appName.toLowerCase();

  const appId = terminalApps[normalizedName];

  if (!appId) {
    terminalPrint(`open: app "${appName}" was not found`, "error");

    return;
  }

  const targetWindow = document.getElementById(appId);

  if (!targetWindow) {
    terminalPrint(`open: app "${appName}" is unavailable`, "error");

    return;
  }

  openAppWindowById(appId);

  terminalPrint(`Opening ${appName}...`);
}

function terminalRunCommand(rawCommand) {
  const command = rawCommand.trim();

  if (!command) return;

  terminalPrintCommand(command);

  terminalHistory.push(command);
  terminalHistoryIndex = terminalHistory.length;

  const parts = command.split(/\s+/);
  const baseCommand = parts[0].toLowerCase();
  const argument = parts.slice(1).join(" ");

  switch (baseCommand) {
    case "help":
      terminalHelp();
      break;

    case "clear":
      terminalOutput.innerHTML = "";
      break;

    case "date":
      terminalPrint(
        new Date().toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      break;

    case "time":
      terminalPrint(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      break;

    case "about":
      terminalPrintMultiline(
        `Piko

Version 1.0
Kawai Web OS
Created by Element`,
      );
      break;

    case "version":
      terminalPrint("Piko Web OS v1.0");
      break;

    case "apps":
      terminalShowApps();
      break;

    case "open":
      if (!argument) {
        terminalPrint("Usage: open <app>", "error");
      } else {
        terminalOpenApp(argument);
      }
      break;

    case "echo":
      terminalPrint(argument);
      break;

    case "history":
      if (terminalHistory.length === 0) {
        terminalPrint("No commands in history.");
      } else {
        terminalHistory.forEach(function (item, index) {
          terminalPrint(`${index + 1}  ${item}`);
        });
      }
      break;

    default:
      terminalPrint(`command not found: ${baseCommand}`, "error");

      terminalPrint('Type "help" to see available commands.');
  }
}

function focusTerminal() {
  const terminalWindow = document.getElementById("terminal");

  if (!terminalWindow) return;
  if (
    terminalWindow.style.display === "block" &&
    terminalWindow.classList.contains("is-open")
  ) {
    terminalInput?.focus();
  }
}

export function initTerminal() {
  if (!terminalOutput || !terminalInput) return;

  terminalPrint("Piko Terminal v1.0");
  terminalPrint('Type "help" to see available commands');
  terminalPrint("");

  terminalInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const command = terminalInput.value;
      terminalInput.value = "";
      terminalRunCommand(command);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (terminalHistory.length === 0) return;
      terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
      terminalInput.value = terminalHistory[terminalHistoryIndex] || "";

      requestAnimationFrame(function () {
        terminalInput.setSelectionRange(
          terminalInput.value.length,
          terminalInput.value.length,
        );
      });
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (terminalHistory.length === 0) return;
      terminalHistoryIndex = Math.min(
        terminalHistory.length,
        terminalHistoryIndex + 1,
      );
      terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
      return;
    }
    if (event.key === "1" && event.ctrlKey) {
      event.preventDefault();
      terminalOutput.innerHTML = "";
      return;
    }
  });
  const terminalWindow = document.getElementById("terminal");
  if (terminalWindow) {
    terminalWindow.addEventListener("mousedown", function () {
      requestAnimationFrame(focusTerminal);
    });
  }
}
