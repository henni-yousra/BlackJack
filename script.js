// Initialisation des variables
const cartes = Array.from(document.querySelectorAll('.card')); // Sélectionner toutes les cartes avec la classe 'card'
let mainJoueur = [];
let mainCroupier = [];
let deckMelange = [];

// Fonction pour mélanger le paquet de cartes
function melangerDeck() {
    const melange = [...cartes]; // Copier le tableau des cartes
    for (let i = melange.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [melange[i], melange[j]] = [melange[j], melange[i]];
    }
    return melange;
}

// Fonction pour distribuer une carte
function distribuerCarte() {
    if (deckMelange.length === 0) {
        alert("Le paquet est vide ! Redémarrez le jeu.");
        return null;
    }
    return deckMelange.pop();
}

// Fonction pour mettre à jour l'interface utilisateur (UI)
function mettreAJourUI() {
    const divJoueur = document.getElementById('main-joueur');
    const divCroupier = document.getElementById('main-croupier');

    divJoueur.innerHTML = '<h2>Cartes du Joueur</h2>';
    divCroupier.innerHTML = '<h2>Cartes du Croupier</h2>';

    // Afficher la main du joueur
    mainJoueur.forEach(carte => divJoueur.appendChild(carte));

    // Afficher la main du croupier avec une carte cachée
    if (mainCroupier.length > 0) {
        divCroupier.appendChild(mainCroupier[0]); // Carte visible
        const carteCachee = document.createElement('div');
        carteCachee.className = 'card hidden'; // Carte cachée
        divCroupier.appendChild(carteCachee); // Ajouter la carte cachée
    }
}

// Fonction pour démarrer le jeu
function demarrerJeu() {
    deckMelange = melangerDeck(); // Mélanger le paquet
    mainJoueur = [distribuerCarte(), distribuerCarte()]; // Distribuer deux cartes au joueur
    mainCroupier = [distribuerCarte(), distribuerCarte()]; // Distribuer deux cartes au croupier
    mettreAJourUI(); // Mettre à jour l'interface
}

// Fonction pour tirer une carte (ajouter une carte à la main du joueur)
function tirerCarte() {
    const carte = distribuerCarte();
    if (carte) {
        mainJoueur.push(carte);
        mettreAJourUI();
        // Vérifier si le joueur a dépassé 21
        if (calculerValeurMain(mainJoueur) > 21) {
            afficherMessage("Vous avez dépassé 21 ! Le croupier gagne.");
        }
    }
}

// Fonction pour rester (le joueur passe son tour)
function rester() {
    const divCroupier = document.getElementById('main-croupier');

    // Révéler la carte cachée du croupier
    if (mainCroupier.length > 1) {
        const carteCachee = divCroupier.querySelector('.card.hidden');
        if (carteCachee) {
            divCroupier.removeChild(carteCachee); // Retirer la carte cachée
            divCroupier.appendChild(mainCroupier[1]); // Afficher la deuxième carte du croupier
        }
    }

    // Tour du croupier : il doit tirer jusqu'à atteindre au moins 17
    while (calculerValeurMain(mainCroupier) < 17) {
        const carte = distribuerCarte();
        if (carte) {
            mainCroupier.push(carte);
            divCroupier.appendChild(carte); // Ajouter la nouvelle carte du croupier à l'UI
        }
    }

    // Vérifier qui est le gagnant
    verifierGagnant();
}

// Fonction pour calculer la valeur de la main
function calculerValeurMain(main) {
    let valeur = 0;
    let nombreAs = 0;

    main.forEach(carte => {
        const valeurCarte = carte.dataset.value;
        if (['J', 'Q', 'K'].includes(valeurCarte)) {
            valeur += 10;
        } else if (valeurCarte === 'A') {
            nombreAs++;
            valeur += 11;
        } else {
            valeur += parseInt(valeurCarte);
        }
    });

    // Ajuster la valeur des As
    while (valeur > 21 && nombreAs > 0) {
        valeur -= 10;  // Faire en sorte que l'As vaille 1 au lieu de 11
        nombreAs--;
    }

    return valeur;
}

// Fonction pour vérifier qui est le gagnant
function verifierGagnant() {
    const valeurJoueur = calculerValeurMain(mainJoueur);
    const valeurCroupier = calculerValeurMain(mainCroupier);

    if (valeurJoueur > 21) {
        afficherMessage("Vous avez dépassé 21 ! Le croupier gagne.");
    } else if (valeurCroupier > 21) {
        afficherMessage("Le croupier a dépassé 21 ! Vous gagnez !");
    } else if (valeurJoueur > valeurCroupier) {
        afficherMessage("Vous gagnez !");
    } else if (valeurJoueur < valeurCroupier) {
        afficherMessage("Le croupier gagne !");
    } else {
        afficherMessage("Égalité !");
    }
}

// Fonction pour redémarrer le jeu
function redemarrer() {
    mainJoueur = [];
    mainCroupier = [];
    document.getElementById('message').innerText = ''; // Effacer le message
    demarrerJeu();
}

// Fonction pour afficher un message
function afficherMessage(message) {
    const divMessage = document.getElementById('message');
    divMessage.innerText = message;
}

// Écouteurs d'événements pour les boutons
document.getElementById('demarrerJeu').addEventListener('click', demarrerJeu);
document.getElementById('tirer').addEventListener('click', tirerCarte);
document.getElementById('rester').addEventListener('click', rester);
document.getElementById('redemarrer').addEventListener('click', redemarrer);
