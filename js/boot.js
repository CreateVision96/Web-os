const bootScreen = document.getElementById("bootScreen");
const bootMessages = document.getElementById("bootMessages");
const bootProgressBar = document.getElementById("bootProgressBar");
const bootProgressText = document.getElementById("bootProgressText");

const bootSteps = [
  "Initializing system...",
  "Loading Piko kernel...",
  "Mounting desktop...",
  "Loading applications...",
  "Loading widgets...",
  "Starting services...",
  "Launching Piko...",
];

let bootFinished = false;

function showBootMessage(text) {
  const message = document.createElement("div");

  message.className = "boot-message";

  message.innerHTML = `${text} <span class="ok">OK</span>`;

  bootMessages.appendChild(message);

  requestAnimationFrame(function () {
    message.classList.add("show");
  });
}

function finishBoot() {
  if (bootFinished) return;

  bootFinished = true;

  bootProgressBar.style.width = "100%";
  bootProgressText.textContent = "100%";

  setTimeout(function () {
    bootScreen.classList.add("hidden");

    setTimeout(function () {
      bootScreen.remove();
    }, 500);
  }, 250);
}

function runBoot() {
  let step = 0;
  let progress = 0;

  function nextStep() {
    if (bootFinished) return;

    if (step < bootSteps.length) {
      showBootMessage(bootSteps[step]);

      step++;

      progress = Math.min(100, Math.round((step / bootSteps.length) * 100));

      bootProgressBar.style.width = `${progress}%`;
      bootProgressText.textContent = `${progress}%`;

      setTimeout(nextStep, 280);
    } else {
      setTimeout(finishBoot, 450);
    }
  }

  setTimeout(nextStep, 700);
}

if (bootScreen) {
  runBoot();
}
