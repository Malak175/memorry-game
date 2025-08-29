const gameContainer = document.querySelector(".game");
const winnerText = document.querySelector(".winner");
const restartBtn = document.querySelector(".restart");

let moves = 0, matches = 0, totalPairs = 8;
let firstCard = null, secondCard = null;
let countdown, timeLeft = 5 * 60;


const images = [
  "img/cpp.png",
  "img/css.png",
  "img/html.png",
  "img/js.jpg",
  "img/next.webp",
  "img/python.webp",
  "img/react.png",
  "img/vue.jpg"
];
let cardsArray = [...images, ...images]; 

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function buildBoard() {
  gameContainer.innerHTML = "";
  shuffle(cardsArray).forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = img;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back"><img src="${img}" alt=""></div>
      </div>
    `;
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });
}

function startGame() {
  moves = 0; matches = 0;
  firstCard = null; secondCard = null;
  timeLeft = 5 * 60;
  document.getElementById("moves").innerText = moves;
  updateTimer();
  buildBoard();
  winnerText.innerText = "Good Luck!";

  clearInterval(countdown);
  countdown = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").innerText =
    `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function flipCard() {
  if (this.classList.contains("flipped") || this.classList.contains("matched")) return;
  if (firstCard && secondCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    moves++;
    document.getElementById("moves").innerText = moves;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matches++;
    resetSelection();

    if (matches === totalPairs) {
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetSelection();
    }, 1000);
  }
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
}

function endGame() {
  clearInterval(countdown);
  let stars = calculateRating(moves, totalPairs);
  winnerText.innerText = `Game Over! 🎉 Moves: ${moves}, Rating: ${"⭐".repeat(stars)}`;
}

function calculateRating(playerMoves, pairs) {
  const minMoves = pairs; // best case: one move per pair
  const extraMoves = playerMoves - minMoves;
  if (extraMoves <= 0) return 5;
  else if (extraMoves <= 2) return 4;
  else if (extraMoves <= 4) return 3;
  else if (extraMoves <= 6) return 2;
  else return 1;
}

restartBtn.addEventListener("click", startGame);

startGame();
