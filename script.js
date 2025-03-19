const gameGrid = document.querySelector('.game-grid');
const restartButton = document.querySelector('.restart-button');
const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🦌', '🦆'];
let cardValues = [...icons, ...icons];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let correctGuesses = 0;
let timeoutID;
let confetti; // To track confetti and stop it later

const bgMusic = new Audio('assets/gametheme.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

const flipSound = new Audio('assets/cardpress.mp3');
const winSound = new Audio('assets/win.mp3');
const loseSound = new Audio('assets/loose.mp3');

function startConfetti() {
    let confettiCanvas = document.getElementById('confetti-canvas');

    if (!confettiCanvas) {
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confetti-canvas';
        document.body.appendChild(confettiCanvas);
    }

    confettiCanvas.style.position = 'absolute';
    confettiCanvas.style.top = document.querySelector('.game-container').offsetTop + 'px';
    confettiCanvas.style.left = document.querySelector('.game-container').offsetLeft + 'px';
    confettiCanvas.style.width = document.querySelector('.game-container').offsetWidth + 'px';
    confettiCanvas.style.height = document.querySelector('.game-container').offsetHeight + 'px';
    confettiCanvas.style.pointerEvents = 'none';

    confetti = new ConfettiGenerator({ target: 'confetti-canvas' });
    confetti.render();
}



function stopConfetti() {
    if (confetti) {
        confetti.clear();
        document.getElementById('confetti-canvas')?.remove();
    }
}

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
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');
    flipSound.play();

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

    if (firstCardValue === secondCardValue) {
        correctGuesses++;
        disableCards();

        if (correctGuesses === 4) {
            setTimeout(() => {
                winSound.play().catch(error => console.log("Sound error:", error));
                startConfetti();
                alert('You made 4 correct matches! You won!');
            }, 500);
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
}

function endGame() {
    lockBoard = true;
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('flip'));
        setTimeout(() => {
            loseSound.play();
            alert('Game Over!');
        }, 500);
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
    }, 5000);
}

restartButton.addEventListener('click', () => {
    matches = 0;
    correctGuesses = 0;
    clearTimeout(timeoutID);
    resetBoard();
    createBoard();

    if (bgMusic.paused) {
        bgMusic.play().catch(error => console.log("Autoplay blocked:", error));
    }

    stopConfetti();
});

document.addEventListener('DOMContentLoaded', createBoard);
