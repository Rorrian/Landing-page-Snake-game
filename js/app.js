let scoreBlock = document.querySelector(".game-score .score-count"); // Блок со счетом
let score = 0; // Текущий счет

// Настройки игры
const config = {
  step: 0, // Переменая для игрового цикла
  maxStep: 6, // Переменная для игрового цикла

  sizeCell: 16,
  sizeBerry: 16 / 4,
};

const snake = {
  // Стартовые координаты змейки
  x: 160,
  y: 160,

  // Заданное направление движения(скорость) по горизонтали и вертикали
  dx: config.sizeCell,
  dy: 0,

  tails: [], // Массив ячеек - дочерних элементов змейки
  maxTails: 3, // Первоначальное количество ячеек, из которых состоит змейка
};

let berry = {
  x: 0,
  y: 0,
};

// -------------------------------
// ----- Работа с canvas -----

const canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
drawScore(); // При запуске страницы сразу обновляем счет

// Игровой цикл
function gameLoop() {
  // Метод для выполнения операций перед вычислением стилей  и формированием документа браузером
  // Он сообщает браузеру, что необходимо выполнить анимацию и вызывает заданную ф-ю для обновления анимации перед следующей перерисовкой
  requestAnimationFrame(gameLoop);
  if (++config.step < config.maxStep) {
    return; // Ранний выход для управления скоростью отрисовки на экране
  }

  // ! Каждый кадр мы очищаем canvas и отрисовываем все заново
  config.step = 0;
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawBerry();
  drawSnake();
}
requestAnimationFrame(gameLoop);

// -------------------------------
// ----- Вспомогательные ф-и -----

// Перезапуск игры
function restartGame() {
  score = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  setPositionBerry();
}

// Ф-я для увеличения счета
function increaseScore() {
  score++;
  drawScore();
}

// Ф-я для отрисовки обновленного счета
function drawScore() {
  scoreBlock.innerHTML = score;
}

// Ф-я для генерации случайных координат ягоды
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Ф-я для назначения координат ягоды
function setPositionBerry() {
  // Второй аргумент - вычисляемое кол-во ячеек в canvas
  berry.x =
    getRandomInt(0, canvas.clientWidth / config.sizeCell) * config.sizeCell;
  berry.y =
    getRandomInt(0, canvas.clientHeight / config.sizeCell) * config.sizeCell;
}

function drawBerry() {
  // Метод beginPath() начинает контур
  context.beginPath();
  context.fillStyle = "#d60047";
  // Рисуем окружность
  context.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  context.fill();
}

function drawSnake() {
  // Меняем координаты змейки в зависимости от заданного направления
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Обработка коллизий(столкновений) с краями поля
  collisionBorder();

  //Добавляем в начало массива ячеек-тела змейки элемент
  snake.tails.unshift({ x: snake.x, y: snake.y });

  // Если кол-во элементов в теле змейки больше, чем разрешено - удалаяем последний элемент
  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  // Проверяем все дочерние элементы змейки и отрисовываем их заново
  snake.tails.forEach((el, index) => {
    // Красим голову змейки в травяной цвет
    if (index === 0) {
      context.fillStyle = "#50ac0e";
    } else {
      // Остальное тело в ярко зеленый
      context.fillStyle = "#58c20d";
    }
    context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

    // Проверяем соприкосновение змейки с ягодой
    if (el.x === berry.x && el.y === berry.y) {
      // Если совпадают - увеличиваем хвост у змейки
      snake.maxTails++;
      increaseScore();
      setPositionBerry();
    }

    // Проверяем на соприкосновение головы змейки с телом
    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) {
        // Если совпадают - перезапускаем игру
        restartGame();
      }
    }
  });
}

// Ф-я для обработки столкновений змейки с краями поля
function collisionBorder() {
  // При пересечении границ поля нужно отрисовывать змейку на противоположной стороне
  if (snake.x < 0) {
    snake.x = canvas.clientWidth - config.sizeCell;
  } else if (snake.x > canvas.clientWidth) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.clientHeight - config.sizeCell;
  } else if (snake.y > canvas.clientHeight) {
    snake.y = 0;
  }
}

// -------------------------------
// ----- Управление -----

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") {
    console.log(snake.dy);
    if (snake.dy != 16) {
      snake.dx = 0;
      snake.dy = -config.sizeCell;
    }
  } else if (e.code === "KeyA") {
    if (snake.dx != 16) {
      snake.dx = -config.sizeCell;
      snake.dy = 0;
    }
  } else if (e.code === "KeyS") {
    if (snake.dy != -16) {
      snake.dx = 0;
      snake.dy = config.sizeCell;
    }
  } else if (e.code === "KeyD") {
    if (snake.dx != -16) {
      snake.dx = config.sizeCell;
      snake.dy = 0;
    }
  }
});
