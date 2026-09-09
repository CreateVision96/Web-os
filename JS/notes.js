import { showNotification, escapeHTML } from "./notifs.js";

let activeNoteIndex = 0;
let notesData;

try {
  notesData = JSON.parse(localStorage.getItem("piko-notes")) || [
    {
      title: "Welcome Note",
      date: new Date().toLocaleDateString(),
      content: "Welcome to Piko Notes!\nClick '+ New Note' to create your own.",
    },
  ];
} catch (e) {
  notesData = [
    {
      title: "Welcome Note",
      date: new Date().toLocaleDateString(),
      content: "Welcome to Piko Notes!\nClick '+ New Note' to create your own.",
    },
  ];
}

function saveNotes() {
  localStorage.setItem("piko-notes", JSON.stringify(notesData));
}

function autoResizeNoteEditor() {
  const contentInput = document.querySelector("#noteContentInput");
  if (!contentInput) return;

  contentInput.style.height = "auto";
  contentInput.style.height = `${Math.max(140, contentInput.scrollHeight)}px`;
}

export function setNotesContent(index) {
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

export function addNewNote() {
  const newNote = {
    title: "Untitled Note",
    date: new Date().toLocaleDateString(),
    content: "",
  };

  notesData.push(newNote);
  saveNotes();
  setNotesContent(notesData.length - 1);

  showNotification("Notes", "New note created");
}

function deleteActiveNote() {
  if (notesData.length <= 1) {
    notesData[0] = {
      title: "Untitled Note",
      date: new Date().toLocaleDateString(),
      content: "",
    };

    saveNotes();
    setNotesContent(0);

    showNotification("Notes", "Note cleared");

    return;
  }

  notesData.splice(activeNoteIndex, 1);
  saveNotes();

  const nextIndex = Math.max(0, activeNoteIndex - 1);
  setNotesContent(nextIndex);
}

export function populateSidebar() {
  const sidebar = document.querySelector("#sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = "";

  notesData.forEach(function (note, index) {
    const item = document.createElement("div");

    item.className =
      "sidebar-item" + (index === activeNoteIndex ? " active-note" : "");

    item.innerHTML = `<strong>${escapeHTML(note.title)}</strong><br><small>${escapeHTML(note.date)}</small>`;

    item.addEventListener("click", function () {
      setNotesContent(index);
    });

    sidebar.appendChild(item);
  });
}
