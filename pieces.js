import { ajoutListenerAvis } from "./avis.js";

// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();

function genererPieces(pieces){
    for (let i = 0; i < pieces.length; i++) {
        
        const article = pieces[i];
        // Récupération de lélément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");

        // Création d’une balise dédiée à une pièce automobile
        const pieceElement = document.createElement("article");

        // Création des éléments spécifiques pour chaque propriété de la pièce
        const imageElement = document.createElement("img");
        const nomElement = document.createElement("h2");
        const prixElement = document.createElement("p");
        const categorieElement = document.createElement("p");
        const descriptionElement = document.createElement("p");
        const disponibiliteElement = document.createElement("p");

        // Configuration des éléments avec les données de la pièce actuelle
        imageElement.src = pieces[i].image;
        nomElement.innerText = pieces[i].nom;
        prixElement.innerText = `Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;
        categorieElement.innerText = pieces[i].categorie;
        descriptionElement.innerText = pieces[i].description ?? "Pas de description pour le moment.";
        disponibiliteElement.innerText = pieces[i].disponibilite ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        // Rattachement de la balise article à la section Fiches
        sectionFiches.appendChild(pieceElement);

        // Ajout des éléments à la balise article pour la pièce actuelle
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(disponibiliteElement);
        pieceElement.appendChild(avisBouton);
    }

    // Ajout des listeners sur les boutons des avis
    ajoutListenerAvis();
}

genererPieces(pieces);

// Sélection de l'élément HTML correspondant à un bouton avec la classe CSS '.btn-trier'
const boutonTrier = document.querySelector(".btn-trier");

// Ajout d'un écouteur d'événements 'click' sur le bouton identifié par '.btn-trier'
boutonTrier.addEventListener("click", function () {
    // Création d'une copie du tableau 'pieces' en utilisant Array.from()
    const piecesOrdonnees = Array.from(pieces);

    // Tri du tableau 'piecesOrdonnees' en fonction de la propriété 'prix' de chaque élément
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });

    // Affichage du tableau trié 'piecesOrdonnees' dans la console du navigateur
    console.log(piecesOrdonnees);
});


//Ajout du listener pour trier les pièces par ordre de prix décroissant
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    console.log(piecesFiltrees)
})


const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    console.log(piecesOrdonnees);
});


//Ajout du listener pour filtrer les pièces sans description
const boutonNoDescription = document.querySelector(".btn-nodesc");
boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        // Boolean (undefined) -> false
        // Boolean (bla bla) -> true
        return Boolean(piece.description);
    });
    console.log(piecesFiltrees)
});


// Récupération du nom des pièces
const noms = pieces.map(piece => piece.nom);

// Boucle for de la fin vers le début
for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        noms.splice(i, 1);
    }
}

// Création de l'élément ul
const abordablesElement = document.createElement("ul");

// Création et rattachement des éléments li
for (let i = 0; i < noms.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = noms[i];
    abordablesElement.appendChild(nomElement);
}

// Rattachement de toute la liste à la page
document.querySelector(".abordables").appendChild(abordablesElement);

 
// Resumé des pieces disponibles
const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);

for (let i = pieces.length - 1; i >= 0; i-- ) {
    if (pieces[i].disponibilite === false) {
        nomsDisponibles.splice(i, 1);
        prixDisponibles.splice(i, 1);
    }
}

const disponibiliteElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
    const nomElement = document.createElement('li');
    nomElement.innerText = nomsDisponibles[i] + " - " + prixDisponibles[i] + " €";
    disponibiliteElement.appendChild(nomElement);
}

document.querySelector(".disponibles").appendChild(disponibiliteElement);


// Ajout du listener pour filtrer les pièces non abordables
const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
    });

    // Effacement de l'écran et récupération de la page avec les pièces filtrées uniquement
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});
