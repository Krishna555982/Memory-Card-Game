const fruits = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 'aa', 'bb', 'cc', 'dd', 'ee', 'ff'
];

const gameContainer = document.getElementById('game-container');
const timerDisplay = document.getElementById('timer');
const movesCounter = document.getElementById('moves-counter');
const congratsMessage = document.getElementById('congrats-message');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');
const finalScore = document.getElementById('final-score');
const resetButton = document.getElementById('reset-button');

let cardImages = [];
let totalPairs = 8;
let gridColumns = 4;
let gridRows = 4;
let timer;
let seconds = 0;
let moves = 0;
let matchedPairs = 0;

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Time: ${seconds} seconds`;
    }, 1000);
}

function shuffleCards() {
    cardImages.sort(() => 0.5 - Math.random());
}

function generateCards() {
    gameContainer.innerHTML = '';
    congratsMessage.style.display = 'none';
    gameContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 80px)`;
    gameContainer.style.gridTemplateRows = `repeat(${gridRows}, 80px)`;
    matchedPairs = 0;
    moves = 0;
    movesCounter.textContent = `Moves: ${moves}`;
    cardImages.forEach(fruit => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.fruit = fruit;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="./assets/${fruit}.png" alt="${fruit}">
                </div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameContainer.appendChild(card);
    });
    startTimer();
}

function shuffleGame() {
    const selectedImages = fruits.sort(() => 0.5 - Math.random()).slice(0, totalPairs);
    cardImages = selectedImages.flatMap(fruit => [fruit, fruit]);
    shuffleCards();
    generateCards();
}

function setLevel(level) {
    switch (level) {
        case 'easy':
            gridColumns = 4;
            gridRows = 4;
            totalPairs = 8;
            break;
        case 'medium':
            gridColumns = 6;
            gridRows = 6;
            totalPairs = 18;
            break;
        case 'hard':
            gridColumns = 6;
            gridRows = 6;
            totalPairs = 18;
            break;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    gameContainer.style.gridTemplateRows = `repeat(${gridRows}, 1fr)`;
    shuffleGame();
}

let flippedCards = [];

function flipCard(card) {
    if (
        flippedCards.length < 2 && 
        !card.querySelector('.card-inner').classList.contains('flipped') &&
        !card.querySelector('.card-inner').classList.contains('matched')
    ) {
        const cardInner = card.querySelector('.card-inner');
        cardInner.classList.add('flipped');
        flippedCards.push(card);
        moves++;
        movesCounter.textContent = `Moves: ${moves}`;
    }
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.fruit === card2.dataset.fruit) {
        card1.querySelector('.card-inner').classList.add('matched');
        card2.querySelector('.card-inner').classList.add('matched');
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            clearInterval(timer);
            setTimeout(() => {
                showCongratulations();
            }, 500);
        }
    } else {
        const card1Inner = card1.querySelector('.card-inner');
        const card2Inner = card2.querySelector('.card-inner');
        card1Inner.classList.remove('flipped');
        card2Inner.classList.remove('flipped');
    }
    flippedCards = [];
}

function showCongratulations() {
    finalTime.textContent = `${seconds} seconds`;
    finalMoves.textContent = `${moves}`;
    finalScore.textContent = `${Math.max(1000 - (seconds * 10) - (moves * 5), 0)}`;
    congratsMessage.style.display = 'block';
}

resetButton?.addEventListener('click', () => {
    setLevel('easy');
});

setLevel('easy');
