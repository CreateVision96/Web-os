export function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function showNotification(title, message, duration = 2500) {
  const container = document.getElementById("notifContainer");
  if (!container) return;

  const notif = document.createElement("div");

  notif.className = "notification";

  notif.innerHTML = `
    <div class="notification-title">
      ${escapeHTML(title)}
    </div>
    <div class="notification-message">
      ${escapeHTML(message)}
    </div>
  `;

  container.appendChild(notif);

  requestAnimationFrame(() => {
    notif.classList.add("show");
  });

  setTimeout(() => {
    notif.classList.remove("show");

    setTimeout(() => {
      notif.remove();
    }, 300);
  }, duration);
}
