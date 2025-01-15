let menuicon = document.getElementById('menu-icon');
let displaymenu = 1;
const catalogue = fetch('../catalogue.json').then((response) => {
    if (!response.ok) {
        return console.log('Oops! Something went wrong.');
    }
    return response.json();
}).then((data) => {
    return data;
});

async function fillMenu() {
    let src;
    if (displaymenu == 1) {
        src = '../image/icon/fermer.png';
        menuicon.src = src;
        menu.style.display = 'block';
        const data = await catalogue;
        const ul = document.createElement('ul');
        const categoriesAdded = new Set();
        data.forEach((produit) => {
            const categories = produit.categorie;
            if (!categoriesAdded.has(categories)) {
                categoriesAdded.add(categories);
                const li = document.createElement('li');
                const button = createButton(categories, '../page produit/pageproduit.html');
                li.appendChild(button);
                ul.appendChild(li);
            }
        });
        menu.appendChild(ul);
        displaymenu = 0;
    } else {
        src = '../image/icon/menu.png';
        menuicon.src = src;
        menu.style.display = 'none';
        displaymenu = 1;
        menu.innerHTML = null;
    }
}

function createButton(text, url) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(text));
    button.addEventListener('click', function () {
        sessionStorage.setItem('pageproduit', text);
        window.location.href = url;
    });
    return button;
}

let displayuser = 1;
let userInformation = document.getElementById('user-data');
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let session = JSON.parse(sessionStorage.getItem('session'));

function login() {
    if (displayuser == 1) {
        userInformation.style.display = 'block';
        displayuser = 0;
        userData.forEach((user) => {
            if ((user.username === session.email || user.email === session.email) && user.password === session.password) {
                for (const key in user) {
                    let element = user[key];
                    if (key == 'password') { element = '.......'; }
                    let p = createParagraph(key, element);
                    userInformation.appendChild(p);
                }
            }
        });
    } else {
        userInformation.innerHTML = '';
        userInformation.style.display = 'none';
        displayuser = 1;
    }
}

function createParagraph(key, value) {
    let p = document.createElement('p');
    p.appendChild(document.createElement('span')).appendChild(document.createTextNode(key));
    p.appendChild(document.createElement('span')).appendChild(document.createTextNode(value));
    p.appendChild(document.createElement('br'));
    return p;
}

let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
let quantite = sessionStorage.getItem('quantite') || 0;
panier.textContent = quantite;
let title = document.getElementById('title');
let carteProduit = document.getElementById('carteProduit');
let resultat = JSON.parse(sessionStorage.getItem('resultatRecherche'));

async function fillpageResultat() {
    const data = await catalogue;
    carteProduit.innerHTML = '';
    let p1 = document.createElement('p');
    p1.appendChild(document.createTextNode(`Nombre de résultats: ${resultat.length}`));
    carteProduit.appendChild(p1);

    resultat.forEach((element) => {
        const div3 = createProductCard(element);
        carteProduit.appendChild(div3);
    });
}

function createProductCard(element) {
    const div1 = document.createElement('div');
    div1.classList.add('imageproduit');
    let img = document.createElement('img');
    img.src = '../' + element.src;
    img.alt = element.nom;
    div1.appendChild(img);

    const div2 = document.createElement('div');
    div2.classList.add('descriptionproduit');
    const div3 = document.createElement('div');
    div3.classList.add('presentationduproduit');

    let p = document.createElement('p');
    p.appendChild(document.createTextNode(element.nom));
    p.appendChild(document.createElement('br'));
    p.appendChild(document.createTextNode('Couleur: ' + element.couleur));
    let prix = element.prix * 624;
    p.appendChild(document.createElement('br'));
    p.appendChild(document.createTextNode(prix + ' fcfa'));
    p.appendChild(document.createElement('br'));
    let button = document.createElement('button');
    button.classList.add('ajouteraupanier');
    button.textContent = 'Ajouter au panier';
    ajoutpanier(button, element);
    const caracteristiques = element.caracteristiques;
    for (const key in caracteristiques) {
        p.appendChild(document.createTextNode(`${key}: ${caracteristiques[key]}`));
        p.appendChild(document.createElement('br'));
    }
    p.appendChild(button);
    div2.appendChild(p);
    div3.appendChild(div1);
    div3.appendChild(div2);
    return div3;
}

async function ResultatRecherche() {
    const data = await catalogue;
    const resultat = rechercher.value.toLowerCase();
    const filteredProducts = data.filter(produit => {
        return produit.nom.toLowerCase().includes(resultat) || produit.categorie.toLowerCase().includes(resultat);
    });
    if (filteredProducts.length == 0 || rechercher.value == '') {
        alert('pas de resultat');
    } else {
        sessionStorage.setItem('resultatRecherche', JSON.stringify(filteredProducts));
        window.location.href = 'pageresultat.html';
    }
}

document.addEventListener('DOMContentLoaded', fillpageResultat);

function ajoutpanier(button, produit) {
    let i = 0;
    button.addEventListener('click', function () {
        let exist = false;
        let data = {};
        data.nom = produit.nom;
        data.prix = produit.prix;
        data.quantite = ++i;
        if (panierData.length != 0) {
            panierData.forEach((item) => {
                if (item.nom == data.nom) {
                    item.quantite++;
                    exist = true;
                }
            });
        }
        if (!exist) {
            panierData.push(data);
        }
        sessionStorage.setItem('panierdata', JSON.stringify(panierData));
        quantite++;
        panier.textContent = quantite;
        sessionStorage.setItem('quantite', quantite);
    });
}

function paniers() {
    window.location.href = '../page du panier/panier.html';
}
