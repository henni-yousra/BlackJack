const cards = Array.from(document.querySelectorAll('.card'));
let playerHand = [];
let dealerHand = [];
let shuffledDeck = [];

// Function to shuffle the deck
function shuffleDeck() {
    const shuffled = [...cards]; // Copy the cards array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to deal a card
function dealCard() {
    return shuffledDeck.pop();
}

function updateUI() {
    const playerDiv = document.getElementById('player-hand');
    const dealerDiv = document.getElementById('dealer-hand');

    playerDiv.innerHTML = '<h2>Cartes du Joueur</h2>';
    dealerDiv.innerHTML = '<h2>Cartes du Croupier</h2>';

    // Afficher la main du joueur
    playerHand.forEach(card => playerDiv.appendChild(card));

    // Afficher la première carte du dealer (visible) et une carte cachée (par exemple, avec une classe 'hidden')
    if (dealerHand.length > 0) {
        dealerDiv.appendChild(dealerHand[0]); // Carte visible
        const hiddenCard = document.createElement('div');
        hiddenCard.className = 'card hidden'; // Classe pour la carte cachée
        dealerDiv.appendChild(hiddenCard); // Ajouter la carte cachée
    }
}


// Function to start the game
function startGame() {
    shuffledDeck = shuffleDeck();
    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];
    updateUI();
}

// Function to hit (deal a card to player)
function hit() {
    const card = dealCard();
    if (card) {
        playerHand.push(card);
        updateUI();
    }
}

function stand() {
    // Révéler la carte cachée
    const dealerDiv = document.getElementById('dealer-hand');
    const hiddenCard = dealerDiv.querySelector('.card.hidden');
    if (hiddenCard) {
        dealerHand[1].style.display = 'block'; // Afficher la carte cachée
        dealerDiv.removeChild(hiddenCard); // Enlever la carte cachée
    }

    // Logique du tour du croupier
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
    }
    updateUI();
    // Vérifiez le gagnant et affichez le message
}


// Function to calculate hand value (simplified for example)
function calculateHandValue(hand) {
    let value = 0;
    hand.forEach(card => {
        const cardValue = card.dataset.value;
        if (['J', 'Q', 'K'].includes(cardValue)) {
            value += 10;
        } else if (cardValue === 'A') {
            value += (value + 11 > 21) ? 1 : 11; // Ace logic
        } else {
            value += parseInt(cardValue);
        }
    });
    return value;
}

// Function to restart the game
function restart() {
    playerHand = [];
    dealerHand = [];
    startGame();
}

// Event listeners for buttons
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);
document.getElementById('restart').addEventListener('click', restart);
