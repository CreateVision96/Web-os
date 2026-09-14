let gamesBody;
let launcher;

let snakeScreen;
let snakeBoard;
let snakeScore;

let memoryScreen;
let memoryBoard;
let memoryMoves;
let memoryTime;

let snake = [];
let food = { x: 0, y: 0 };
let direction = "right";
let nextDir = "right";
let snakeGame;
let snakeGameOver = false;
let snakeSpeed = 120;

const tileSymbols = [
  "★",
  "★",
  "●",
  "●",
  "◆",
  "◆",
  "▲",
  "▲",
  "■",
  "■",
  "♥",
  "♥",
  "✦",
  "✦",
  "✚",
  "✚",
];

let memoryTiles = [];
let selectedTiles = [];
let matchedTiles = [];
let memoryCursor = 0;
let memoryMoveCount = 0;
let memoryLocked = false;
let memoryGameOver = false;
let memoryTimer;
let memoryTimeLeft = 60;

export function initGames() {
  gamesBody = document.querySelector(".games-body");
  launcher = document.querySelector(".games-grid");

  if (!gamesBody || !launcher) return;

  const gameCards = document.querySelectorAll(".game-card");

  gameCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const game = card.dataset.game;

      if (game === "snake") {
        openSnake();
      }

      if (game === "memory") {
        openMemory();
      }
    });
  });

  createSnakeScreen();
  createMemoryScreen();

  document.addEventListener("keydown", handleGameKeys);
}

function createSnakeScreen() {
  snakeScreen = document.createElement("div");
  snakeScreen.className = "game-screen snake-screen";

  snakeScreen.innerHTML = `
    <div class="game-topbar">
      <div>Score: <span class="snake-score">0</span></div>
    </div>

    <div class="snakeBoard"></div>

    <div class="game-controls">
      <button class="button game-back">← Back</button>
      <button class="button game-restart">Restart</button>
    </div>
  `;

  gamesBody.appendChild(snakeScreen);

  snakeBoard = snakeScreen.querySelector(".snakeBoard");
  snakeScore = snakeScreen.querySelector(".snake-score");

  snakeScreen.querySelectorAll(".game-back").forEach(function (button) {
    button.addEventListener("click", function () {
      closeSnake();
    });
  });

  snakeScreen.querySelectorAll(".game-restart").forEach(function (button) {
    button.addEventListener("click", function () {
      startSnake();
    });
  });

  createSnakeBoard();
}

function createSnakeBoard() {
  snakeBoard.innerHTML = "";

  for (let i = 0; i < 900; i++) {
    const cell = document.createElement("div");
    cell.classList.add("snakeCell");
    snakeBoard.appendChild(cell);
  }
}

function openSnake() {
  launcher.classList.add("game-hidden");
  memoryScreen.classList.remove("game-active");
  snakeScreen.classList.add("game-active");

  startSnake();
}

function closeSnake() {
  clearInterval(snakeGame);
  snakeGameOver = true;

  snakeScreen.classList.remove("game-active");
  launcher.classList.remove("game-hidden");
}

function startSnake() {
  clearInterval(snakeGame);

  const oldGameOver = snakeScreen.querySelector(".snakeGameOver");

  if (oldGameOver) {
    oldGameOver.remove();
  }

  snake = [
    { x: 15, y: 15 },
    { x: 14, y: 15 },
    { x: 13, y: 15 },
  ];

  direction = "right";
  nextDir = "right";
  snakeGameOver = false;
  snakeSpeed = 120;

  snakeScore.textContent = "0";

  createFood();
  drawSnake();

  snakeGame = setInterval(updateSnake, snakeSpeed);
}

function createFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * 30),
      y: Math.floor(Math.random() * 30),
    };
  } while (
    snake.some(function (part) {
      return part.x === newFood.x && part.y === newFood.y;
    })
  );

  food = newFood;
}

function updateSnake() {
  direction = nextDir;

  const head = {
    x: snake[0].x,
    y: snake[0].y,
  };

  if (direction === "up") {
    head.y--;
  }

  if (direction === "down") {
    head.y++;
  }

  if (direction === "left") {
    head.x--;
  }

  if (direction === "right") {
    head.x++;
  }

  if (head.x < 0) {
    head.x = 29;
  }

  if (head.x > 29) {
    head.x = 0;
  }

  if (head.y < 0) {
    head.y = 29;
  }

  if (head.y > 29) {
    head.y = 0;
  }

  if (
    snake.some(function (part) {
      return part.x === head.x && part.y === head.y;
    })
  ) {
    endSnake();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore.textContent = Number(snakeScore.textContent) + 1;

    snakeSpeed = Math.max(50, snakeSpeed - 5);

    clearInterval(snakeGame);
    snakeGame = setInterval(updateSnake, snakeSpeed);

    createFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  const cells = snakeBoard.querySelectorAll(".snakeCell");

  cells.forEach(function (cell) {
    cell.classList.remove("snake", "food");
  });

  snake.forEach(function (part) {
    const cell = cells[part.y * 30 + part.x];

    if (cell) {
      cell.classList.add("snake");
    }
  });

  const foodCell = cells[food.y * 30 + food.x];

  if (foodCell) {
    foodCell.classList.add("food");
  }
}

function endSnake() {
  clearInterval(snakeGame);
  snakeGameOver = true;

  const gameOverScreen = document.createElement("div");
  gameOverScreen.className = "snakeGameOver";

  gameOverScreen.innerHTML = `
    <div>Game Over</div>
    <div class="finalScore">
      Score: ${snakeScore.textContent}
    </div>
    <div class="restartText">
      Press SPACE to Restart
    </div>
  `;

  snakeScreen.appendChild(gameOverScreen);
}

function createMemoryScreen() {
  memoryScreen = document.createElement("div");
  memoryScreen.className = "game-screen memory-screen";

  memoryScreen.innerHTML = `
    <div class="game-topbar">
      <div>Moves: <span class="memory-moves">0</span></div>
      <div>Time: <span class="memory-time">60</span></div>
    </div>

    <div class="memoryBoard"></div>

    <div class="game-controls">
      <button class="button memory-back">← Back</button>
      <button class="button memory-restart">Restart</button>
    </div>
  `;

  gamesBody.appendChild(memoryScreen);

  memoryBoard = memoryScreen.querySelector(".memoryBoard");
  memoryMoves = memoryScreen.querySelector(".memory-moves");
  memoryTime = memoryScreen.querySelector(".memory-time");

  memoryScreen
    .querySelector(".memory-back")
    .addEventListener("click", function () {
      closeMemory();
    });

  memoryScreen
    .querySelector(".memory-restart")
    .addEventListener("click", function () {
      startMemory();
    });

  memoryBoard.addEventListener("click", function (event) {
    const tile = event.target.closest(".memoryTile");

    if (!tile || memoryGameOver) return;

    memoryCursor = Number(tile.dataset.index);
    updateMemorySelection();
    flipTile(memoryCursor);
  });

  createMemoryBoard();
}

function openMemory() {
  launcher.classList.add("game-hidden");
  snakeScreen.classList.remove("game-active");
  memoryScreen.classList.add("game-active");

  startMemory();
}

function closeMemory() {
  clearInterval(memoryTimer);
  memoryGameOver = true;

  memoryScreen.classList.remove("game-active");
  launcher.classList.remove("game-hidden");
}

function startMemory() {
  clearInterval(memoryTimer);

  const oldWinScreen = memoryScreen.querySelector(".memoryWin");

  if (oldWinScreen) {
    oldWinScreen.remove();
  }

  memoryTiles = [...tileSymbols].sort(function () {
    return Math.random() - 0.5;
  });

  selectedTiles = [];
  matchedTiles = [];
  memoryCursor = 0;
  memoryMoveCount = 0;
  memoryLocked = false;
  memoryGameOver = false;
  memoryTimeLeft = 60;

  memoryMoves.textContent = "0";
  memoryTime.textContent = "60";

  createMemoryBoard();
  updateMemorySelection();

  memoryTimer = setInterval(updateMemoryTimer, 1000);
}

function updateMemoryTimer() {
  memoryTimeLeft--;

  memoryTime.textContent = memoryTimeLeft;

  if (memoryTimeLeft <= 0) {
    endMemory(false);
  }
}

function createMemoryBoard() {
  memoryBoard.innerHTML = "";

  memoryTiles.forEach(function (symbol, index) {
    const tile = document.createElement("div");

    tile.classList.add("memoryTile");
    tile.dataset.index = index;
    tile.textContent = "?";

    memoryBoard.appendChild(tile);
  });
}

function updateMemorySelection() {
  const tiles = memoryBoard.querySelectorAll(".memoryTile");

  tiles.forEach(function (tile, index) {
    tile.classList.toggle("selected", index === memoryCursor);
  });
}

function flipTile(index) {
  if (
    memoryLocked ||
    selectedTiles.includes(index) ||
    matchedTiles.includes(index)
  ) {
    return;
  }

  const tiles = memoryBoard.querySelectorAll(".memoryTile");

  tiles[index].textContent = memoryTiles[index];
  tiles[index].classList.add("flipped");

  selectedTiles.push(index);

  if (selectedTiles.length === 2) {
    memoryMoveCount++;
    memoryMoves.textContent = memoryMoveCount;

    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const first = selectedTiles[0];
  const second = selectedTiles[1];

  if (memoryTiles[first] === memoryTiles[second]) {
    matchedTiles.push(first, second);
    selectedTiles = [];

    if (matchedTiles.length === memoryTiles.length) {
      endMemory(true);
    }

    return;
  }

  memoryLocked = true;

  setTimeout(function () {
    const tiles = memoryBoard.querySelectorAll(".memoryTile");

    tiles[first].textContent = "?";
    tiles[second].textContent = "?";

    tiles[first].classList.remove("flipped");
    tiles[second].classList.remove("flipped");

    selectedTiles = [];
    memoryLocked = false;
  }, 700);
}

function endMemory(won) {
  clearInterval(memoryTimer);
  memoryGameOver = true;

  const winScreen = document.createElement("div");
  winScreen.className = "memoryWin";

  winScreen.innerHTML = `
    <div>${won ? "You Win!" : "Time's Up!"}</div>
    <div class="memoryFinalScore">
      Moves: ${memoryMoveCount}
    </div>
    <div class="memoryRestartText">
      Press SPACE to Restart
    </div>
  `;

  memoryScreen.appendChild(winScreen);
}

function handleGameKeys(event) {
  const key = event.key.toLowerCase();

  if (snakeScreen.classList.contains("game-active")) {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    if ((event.key === "ArrowUp" || key === "w") && direction !== "down") {
      nextDir = "up";
    }

    if ((event.key === "ArrowDown" || key === "s") && direction !== "up") {
      nextDir = "down";
    }

    if ((event.key === "ArrowLeft" || key === "a") && direction !== "right") {
      nextDir = "left";
    }

    if ((event.key === "ArrowRight" || key === "d") && direction !== "left") {
      nextDir = "right";
    }

    if (event.code === "Space" && snakeGameOver) {
      startSnake();
    }
  }

  if (memoryScreen.classList.contains("game-active")) {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    let newCursor = memoryCursor;

    if (event.key === "ArrowUp" || key === "w") {
      if (memoryCursor >= 4) {
        newCursor -= 4;
      }
    }

    if (event.key === "ArrowDown" || key === "s") {
      if (memoryCursor < 12) {
        newCursor += 4;
      }
    }

    if (event.key === "ArrowLeft" || key === "a") {
      if (memoryCursor % 4 !== 0) {
        newCursor--;
      }
    }

    if (event.key === "ArrowRight" || key === "d") {
      if (memoryCursor % 4 !== 3) {
        newCursor++;
      }
    }

    if (newCursor !== memoryCursor) {
      memoryCursor = newCursor;
      updateMemorySelection();
    }

    if (event.code === "Space") {
      if (memoryGameOver) {
        startMemory();
      } else {
        flipTile(memoryCursor);
      }
    }
  }
}
