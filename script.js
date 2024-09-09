const gameGrid = document.querySelector('.game-grid');
const restartButton = document.querySelector('.restart-button');
const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🦌', '🦆'];
let cardValues = [...icons, ...icons];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let correctGuesses = 0;
let timeoutID;

function shuffleCards() {
    cardValues.sort(() => 0.5 - Math.random());
}

function createBoard() {
    gameGrid.innerHTML = '';
    shuffleCards();
    cardValues.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${icon}</div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameGrid.appendChild(card);
    });
    showAllCardsTemporarily();
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const firstCardValue = firstCard.querySelector('.card-back').textContent;
    const secondCardValue = secondCard.querySelector('.card-back').textContent;

    const isMatch = firstCardValue === secondCardValue;

    if (isMatch) {
        correctGuesses++;
        disableCards();
        if (correctGuesses === 3) {
            setTimeout(() => alert('You made 3 correct matches! You won!'), 500);
        }
    } else {
        endGame();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matches++;
    console.log("disable cards")
}

function endGame() {
    lockBoard = true;
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flip'));
        setTimeout(() => alert('Game Over!'), 500);
    }, 500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function showAllCardsTemporarily() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('flip'));
    timeoutID = setTimeout(() => {
        cards.forEach(card => card.classList.remove('flip'));
    }, 10000);
}

restartButton.addEventListener('click', () => {
    matches = 0;
    correctGuesses = 0;
    clearTimeout(timeoutID);
    resetBoard(); // Reset board variables including lockBoard
    createBoard(); // Recreate the game board
});

