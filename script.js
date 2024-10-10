// Créer le paquet des cartes en utilisant les cartes de HTML/CSS
const cartes = Array.from(document.querySelectorAll('.card')); 
// Cela va sélectionner tous les éléments de classe "card"

let tableDeJeu = [];
let deckMelange = [];

// Fonction dédiée à mélanger le deck des cartes 
function melangerDeck() {
    const melange = [...cartes]; // Mettre le tableau des cartes dans une variable à manipuler
    for (let i = melange.length - 1; i > 0; i--) {
        // De la fin au début, on fait le parcours et à chaque fois on substitue avec une carte aléatoire (algo Fisher-Yates)
        const j = Math.floor(Math.random() * (i + 1));
        [melange[i], melange[j]] = [melange[j], melange[i]];
    }
    return melange;
}

// Après le shuffle, on attribue les cartes 
function distribuerCarte() {
    if (deckMelange.length === 0) {
        alert("Le paquet est vide !");
        return null;
    }
    return deckMelange.pop(); // Récupérer le dernier élément dans le tableau (stack)
}

// Fonction pour mettre à jour l'affichage
function Affichage() {
    const divJoueur = document.getElementById('main-joueur');
    divJoueur.innerHTML = ''; // Clear previous cards

    tableDeJeu.forEach(carte => {
        carte.style.display = 'flex'; // Show the card
        divJoueur.appendChild(carte); // Add the card to the player's hand
    });

    // Mettre à jour la valeur totale de la main
    const totalValue = calculerValeurMain(tableDeJeu);
    afficherValeur(totalValue);
}

// Fonction pour démarrer le jeu 
function demarrerJeu() {
    // Mélanger le deck à chaque nouvelle partie
    deckMelange = melangerDeck(); 
    // Commencer par distribuer deux cartes
    tableDeJeu = [distribuerCarte(), distribuerCarte()];
    Affichage(); // Mise à jour de l'interface
}

// Fonction pour tirer une carte supplémentaire
function tirerCarte() {
    const carte = distribuerCarte();
    if (carte) { // Si le paquet n'est pas vide
        tableDeJeu.push(carte);
        Affichage();
        // Vérifier si le joueur a dépassé 21
        const totalValue = calculerValeurMain(tableDeJeu);
        if (totalValue > 21) {
            afficherMessage("Vous avez dépassé 21 !");
        }
    }
}

// Calculer la valeur de la main du joueur
function calculerValeurMain(main) {
    let valeur = 0;
    let nombreAs = 0; 

    main.forEach(carte => {
        const valeurCarte = carte.dataset.value; // Assurez-vous que chaque carte a un data-value
        if (['J', 'Q', 'K'].includes(valeurCarte)) {
            valeur += 10;
        } else if (valeurCarte === 'A') {
            nombreAs++;
            valeur += 11;
        } else {
            valeur += parseInt(valeurCarte);
        }
    });

    // Ajuster la valeur des As si nécessaire
    while (valeur > 21 && nombreAs > 0) {
        valeur -= 10; // Le As devient 1 au lieu de 11
        nombreAs--;
    }

    return valeur;
}

// Fonction pour afficher la valeur de la main
function afficherValeur(valeur) {
    const divValeur = document.getElementById('valeur-main');
    divValeur.innerText = `Valeur totale de la main : ${valeur}`;
}

// Fonction pour redémarrer le jeu 
function redemarrer() {
    tableDeJeu = []; // Réinitialiser la main du joueur
    document.getElementById('message').innerText = ''; // Réinitialiser les messages
    demarrerJeu(); // Relancer le jeu
}

// Fonction pour afficher un message 
function afficherMessage(message) {
    const divMsg = document.getElementById('message');
    divMsg.innerText = message;
}

// Ajouter des écouteurs d'événements pour les boutons
document.getElementById('demarrerJeu').addEventListener('click', demarrerJeu);
document.getElementById('tirer').addEventListener('click', tirerCarte);
document.getElementById('redemarrer').addEventListener('click', redemarrer);
