
// Create a deck of cards
const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];
suits.forEach(suit => {
    values.forEach(value => {
        deck.push({ suit, value });
    });
});

// Shuffle the deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal a card
function dealCard() {
    return deck.pop();
}

// Get card value
function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value, 10);
}

// Update the display of hands
function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
    hand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.suit}`;
        cardDiv.innerHTML = `
            <div class="value top-left">${card.value}</div>
            <div class="center multiple">
                <span>${card.suit === 'hearts' ? '♥' : card.suit === 'spades' ? '♠' : card.suit === 'clubs' ? '♣' : '♦'}</span>
            </div>
            <div class="value bottom-right">${card.value}</div>
        `;
        handElement.appendChild(cardDiv);
    });
}

// Initialize game
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;

function startGame() {
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });
    shuffleDeck();

    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];
    
    playerScore = playerHand.reduce((sum, card) => sum + getCardValue(card), 0);
    dealerScore = dealerHand.reduce((sum, card) => sum + getCardValue(card), 0);

    displayHand(playerHand, 'player-hand');
    displayHand(dealerHand, 'dealer-hand');
    document.getElementById('message').textContent = '';
}

function hit() {
    playerHand.push(dealCard());
    playerScore += getCardValue(playerHand[playerHand.length - 1]);
    displayHand(playerHand, 'player-hand');

    if (playerScore > 21) {
        document.getElementById('message').textContent = 'Player busts! Dealer wins.';
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
    }
}

function stand() {
    while (dealerScore < 17) {
        dealerHand.push(dealCard());
        dealerScore += getCardValue(dealerHand[dealerHand.length - 1]);
    }
    displayHand(dealerHand, 'dealer-hand');

    if (dealerScore > 21) {
        document.getElementById('message').textContent = 'Dealer busts! Player wins.';
    } else if (playerScore > dealerScore) {
        document.getElementById('message').textContent = 'Player wins!';
    } else if (playerScore < dealerScore) {
        document.getElementById('message').textContent = 'Dealer wins.';
    } else {
        document.getElementById('message').textContent = 'It\'s a tie!';
    }
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
}

// Event listeners
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);

// Start game
startGame();
