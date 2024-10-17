/*this is the same as the class
function Deck(){
}
Deck.prototype.draw = () => {
    }
*/

class Deck {
    constructor(cartes) {
        this.cartes = Array.from(cartes);
        this.melange = [];
    }

    melanger() {
        this.melange = [...this.cartes];
        for (let i = this.melange.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.melange[i], this.melange[j]] = [this.melange[j], this.melange[i]];
        }
    }

    distribuerCarte() {
        if (this.melange.length === 0) {
            alert("Le paquet est vide !");
            return null;
        }
        return this.melange.pop();
    }
}

class Joueur {
    constructor() {
        this.main = [];
        this.carteCachee = true;
    }

    ajouterCarte(carte) {
        this.main.push(carte);
    }

    calculerValeur() {
        let valeur = 0;
        let nombreAs = 0;

        this.main.forEach(carte => {
            const valeurCarte = carte.getAttribute('data-value');
            if (['J', 'Q', 'K'].includes(valeurCarte)) {
                valeur += 10;
            } else if (valeurCarte === 'A') {
                nombreAs++;
                valeur += 11;
            } else {
                valeur += parseInt(valeurCarte);
            }
        });

        while (valeur > 21 && nombreAs > 0) {
            valeur -= 10;
            nombreAs--;
        }

        return valeur;
    }

    afficherMain(divId, montrerCarteCachee = true) {
        const divMain = document.getElementById(divId);
        divMain.innerHTML = this.main.map((carte, index) => {
            // Cacher la deuxième carte si c'est le croupier et la carte doit être cachée
            if (index === 1 && !montrerCarteCachee && this.carteCachee) {
                return '<div class="card back"></div>'; // Affiche le dos de la carte
            }
            carte.style.display = 'flex';
            return carte.outerHTML;
        }).join('');
    }
}

const cartes = document.querySelectorAll('.card');
let deck = new Deck(cartes);
let joueur = new Joueur();
let croupier = new Joueur();

function afficherMains() {
    joueur.afficherMain('main-joueur');
    croupier.afficherMain('main-croupier', false);  // Cache la deuxième carte du croupier
}

function arreter() {
    croupier.carteCachee = false;  // Révèle la carte cachée
    afficherMains();
    tourCroupier();
}


function tirerCarte() {
    const carte = deck.distribuerCarte();
    if (carte) {
        joueur.ajouterCarte(carte);
        afficherMains();

        afficherValeur(); 

        const totalJoueur = joueur.calculerValeur();
        if (totalJoueur > 21) {
            afficherMessage("Vous avez dépassé 21. Vous avez perdu !");
        }
    }
}

function tourCroupier() {
    let valeurCroupier = croupier.calculerValeur();

    while (valeurCroupier < 17) {
        const carte = deck.distribuerCarte();
        if (carte) {
            croupier.ajouterCarte(carte);
            afficherMains();
            valeurCroupier = croupier.calculerValeur();
        }
    }

    determinerVainqueur();
}

function determinerVainqueur() {
    const valeurJoueur = joueur.calculerValeur();
    const valeurCroupier = croupier.calculerValeur();

    if (valeurCroupier > 21) {
        afficherMessage("Le croupier a dépassé 21. Vous gagnez !");
    } else if (valeurJoueur > valeurCroupier) {
        afficherMessage("Vous gagnez !");
    } else if (valeurJoueur === valeurCroupier) {
        afficherMessage("Égalité !");
    } else {
        afficherMessage("Le croupier gagne !");
    }
}

function afficherValeur() {
    const totalJoueur = joueur.calculerValeur();  // Calculer la valeur de la main du joueur
    const divValeur = document.getElementById('valeur');
    divValeur.innerText = `Valeur totale de la main : ${totalJoueur}`;  // Afficher la valeur calculée
}


function afficherMessage(message) {
    const divMessage = document.getElementById('message');
    divMessage.innerText = message;
}

function redemarrer() {
    joueur = new Joueur();
    croupier = new Joueur();
    document.getElementById('message').innerText = '';
    demarrerJeu();
}

function demarrerJeu() {
    deck = new Deck(cartes);
    deck.melanger();
    joueur.ajouterCarte(deck.distribuerCarte());
    joueur.ajouterCarte(deck.distribuerCarte());
    croupier.ajouterCarte(deck.distribuerCarte());
    croupier.ajouterCarte(deck.distribuerCarte());
    afficherMains();
    afficherValeur();
}

document.getElementById('tirer').addEventListener('click', tirerCarte);
document.getElementById('arreter').addEventListener('click', arreter);
document.getElementById('redemarrer').addEventListener('click', redemarrer);

demarrerJeu();
