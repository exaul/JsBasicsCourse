// Declaración de variables para el lienzo, contexto del lienzo, posición de la pelota, velocidad de la pelota,
// puntuaciones de los jugadores, puntaje necesario para ganar, estado de la pantalla de victoria, posición de las paletas,
// y dimensiones de las paletas.
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 5;
const PADDLE_HEIGHT = 100;

// Función para calcular la posición del ratón en relación con el lienzo.
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

// Función para manejar el clic del ratón, reinicia el juego si se muestra la pantalla de victoria.
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

// Función que se ejecuta cuando la ventana se carga, inicializa el lienzo y define la función de actualización del juego.
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  // Actualiza la posición de la paleta del jugador en función del movimiento del ratón.
  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

// Función para restablecer la posición de la pelota y comprobar si se ha alcanzado el puntaje de victoria.
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.width / 2;
}

// Función para controlar el movimiento de la paleta controlada por la computadora.
function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;

  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

// Función principal que actualiza la posición de la pelota y las paletas en cada fotograma del juego.
function moveEverything() {
  if (showingWinScreen == true) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Lógica para colisiones de la pelota con las paletas y los bordes del lienzo.
  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score += 1;
      ballReset();
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  }

  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

// Función para dibujar la red en el centro del lienzo.
function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "gray");
  }
}

// Función para dibujar todos los elementos del juego en el lienzo.
function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  // Si se muestra la pantalla de victoria, muestra el mensaje correspondiente.
  if (showingWinScreen) {
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillStyle = "white";
      canvasContext.fillText("Left player WON!", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillStyle = "white";
      canvasContext.fillText("Right player WON!", 350, 200);
    }

    canvasContext.fillStyle = "white";
    canvasContext.fillText("Click to continue", 350, 500);
    return;
  }

  // Dibuja la red, las paletas, la pelota y las puntuaciones de los jugadores.
  drawNet();

  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  colorCircle(ballX, ballY, 10, "white");

  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

// Función para dibujar un círculo coloreado en el lienzo.
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

// Función para dibujar un rectángulo coloreado en el lienzo.
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
