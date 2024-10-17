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
let soldeJoueur = 1000; 
let mise = 0;

function placerMise() {
    const miseInput = document.getElementById('mise');
    const montantMise = parseInt(miseInput.value);

    if (montantMise > 0 && montantMise <= soldeJoueur) {
        mise = montantMise;
        soldeJoueur -= mise; // Déduire la mise du solde
        document.getElementById('solde').innerText = soldeJoueur; // Mettre à jour l'affichage du solde
        document.getElementById('mise-courante').innerText = mise; // Mettre à jour l'affichage de la mise courante
        demarrerJeu(); // Démarrer le jeu
    } else {
        alert("La mise doit être supérieure à 0 et inférieure ou égale à votre solde.");
    }
}




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
        soldeJoueur += mise * 2; // Gagner double mise
    } else if (valeurJoueur > valeurCroupier) {
        afficherMessage("Vous gagnez !");
        soldeJoueur += mise * 2; // Gagner double mise
    } else if (valeurJoueur === valeurCroupier) {
        afficherMessage("Égalité !");
        soldeJoueur += mise; // Remboursement de la mise
    } else {
        afficherMessage("Le croupier gagne !");
        soldeJoueur -= mise; // Perdre la mise
    }

    // Réinitialiser la mise courante après la partie
    mise = 0; 
    document.getElementById('mise-courante').innerText = mise; // Mettre à jour l'affichage de la mise courante
    
    document.getElementById('solde').innerText = soldeJoueur; // Mettre à jour l'affichage du solde
    
    // Vérifier si le joueur a de l'argent pour continuer
    if (soldeJoueur <= 0) {
        afficherMessage("Vous n'avez plus d'argent pour jouer !");
        document.getElementById('tirer').disabled = true; // Désactiver le bouton de tirage
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
    if (soldeJoueur <= 0) {
        soldeJoueur = 1000; // Réinitialiser le solde à 1000 unités
        document.getElementById('solde').innerText = soldeJoueur; // Mettre à jour l'affichage du solde
    }
    
    joueur = new Joueur();
    croupier = new Joueur();
    document.getElementById('message').innerText = '';
    document.getElementById('tirer').disabled = false; // Réactiver le bouton de tirage
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
document.getElementById('placer-mise').addEventListener('click', placerMise);



