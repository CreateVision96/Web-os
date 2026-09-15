export function renderCalendar() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const today = now.getDate();

  const monthElement = document.getElementById("calendarMonth");
  const yearElement = document.getElementById("calendarYear");
  const todayElement = document.getElementById("calendarToday");
  const grid = document.getElementById("calendarGrid");

  if (monthElement) {
    monthElement.textContent = now.toLocaleString("default", {
      month: "long",
    });
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
