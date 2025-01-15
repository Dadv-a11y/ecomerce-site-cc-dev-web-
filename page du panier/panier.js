let menuicon = document.getElementById('menu-icon');
let commande = document.getElementById('commande');
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
                const button = document.createElement('Button');
                button.appendChild(document.createTextNode(categories));
                button.addEventListener('click', function () {
                    let text = button.textContent;
                    sessionStorage.setItem('pageproduit', text);
                    window.location.href = '../page produit/pageproduit.html';
                });
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

let displayuser = 1;
let userInformation = document.getElementById('user-data');
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let session = JSON.parse(sessionStorage.getItem('session')) || [];

function login() {
    if (displayuser == 1) {
        userInformation.style.display = 'block';
        displayuser = 0;
        for (const user of userData) {
            if (user.username === session.email || user.email === session.email && user.password === session.password) {
                for (const key in user) {
                    let element = user[key];
                    if (key == 'password') { element = '.......'; }
                    let p = document.createElement('p');
                    p.appendChild(document.createElement('span')).appendChild(document.createTextNode(key));
                    p.appendChild(document.createElement('span')).appendChild(document.createTextNode(element));
                    p.appendChild(document.createElement('br'));
                    userInformation.appendChild(p);
                }
            }
        }
    } else {
        userInformation.innerHTML = '';
        userInformation.style.display = 'none';
        displayuser = 1;
    }
}

let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
let quantites = sessionStorage.getItem('quantite') || 0;
panier.textContent = quantites;
let title = document.getElementById('title');
let carteProduit = document.getElementById('carteProduit');

async function fillpagePanier() {
    if (panierData.length == 0) {
        carteProduit.innerText = ' pas de produit achete';
        carteProduit.style.fontSize = '25px';
        carteProduit.style.textAlign = 'center';
        carteProduit.style.color = 'red';
        commande.style.display = 'none';
    }
    const data = await catalogue;
    panierData.forEach(element => {
        const div1 = createDivWithClass('imageproduit');
        const img = document.createElement('img');
        const produit = data.find(p => p.nom === element.nom);
        img.src = '../' + produit.src;
        img.alt = element.nom;
        div1.appendChild(img);

        const div2 = createDivWithClass('descriptionproduit');
        const div3 = createDivWithClass('presentationduproduit');
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(element.nom));
        const prix = element.prix * 624;
        p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(prix + ' fcfa'));
        p.appendChild(document.createElement('br'));

        const quantite = document.createElement('p');
        quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;

        const decreaseButton = createButton('-', () => {
            if (element.quantite > 1) {
                element.quantite--;
                quantites--;
                panier.textContent = quantites;
                quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;
                updateSessionStorage();
            }
        });

        const increaseButton = createButton('+', () => {
            element.quantite++;
            quantites++;
            panier.textContent = quantites;
            quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;
            updateSessionStorage();
        });

        const removeButton = createButtonWithImage('/image/icon/icons8-supprimer-la-corbeille-48.png', () => {
            carteProduit.removeChild(div3);
            quantites -= element.quantite;
            panier.textContent = quantites;
            panierData = panierData.filter(item => item.nom !== element.nom);
            updateSessionStorage();
        });

        p.appendChild(decreaseButton);
        p.appendChild(increaseButton);
        p.appendChild(quantite);
        p.appendChild(removeButton);

        div2.appendChild(p);
        div3.appendChild(div1);
        div3.appendChild(div2);
        carteProduit.appendChild(div3);
    });
}

function createDivWithClass(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '0 10px';
    button.style.borderRadius = '10px';
    button.style.border = 'none';
    button.style.backgroundColor = 'orange';
    button.style.marginTop = '10px';
    button.addEventListener('click', onClick);
    return button;
}

function createButtonWithImage(src, onClick) {
    const button = document.createElement('button');
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '50px';
    button.style.border = 'none';
    button.style.backgroundColor = 'white';
    button.appendChild(img);
    button.addEventListener('click', onClick);
    return button;
}

function updateSessionStorage() {
    sessionStorage.setItem('panierdata', JSON.stringify(panierData));
    sessionStorage.setItem('quantite', quantites);
}

function paniers() {
    window.location.href = 'panier.html';
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
        window.location.href = '../page de resultat/pageresultat.html';
    }
}

document.addEventListener('DOMContentLoaded', fillpagePanier);

let recu = document.getElementById('recu');
let recuContent = document.getElementById('recuContent');

async function recus() {
    const data = await catalogue;
    let totalMontant = 0;
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    tr.innerHTML = `<th>nom</th><th>quantite</th><th>cout</th>`;
    table.appendChild(tr);

    panierData.forEach(element => {
        let produit = data.find(p => p.nom === element.nom);
        if (produit) {
            let cout = produit.prix * element.quantite * 624;
            totalMontant += cout;
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${element.nom}</td><td>${element.quantite}</td><td>${cout}</td>`;
            table.appendChild(tr);
        }
    });

    let total = document.createElement('p');
    total.textContent = `Montant total de la facture: ${totalMontant} fcfa`;

    recuContent.innerHTML = `<button onclick="showrecu()" class="fermer"><img src="../image/icon/fermer.png" alt="fermer"></button>
        <p>selectionner votre mode de paiement</p>
        <ul>
            <li><img src="/image/icon/mtn.png" alt="mtn"></li>
            <li><img src="/image/icon/orange.png" alt="orange"></li>
        </ul>
        <p>vos achats</p>`;
    recuContent.appendChild(table);
    recuContent.appendChild(total);

    let button = document.createElement('button');
    button.className = 'confirmer';
    button.textContent = 'confirmer l achat ';
    recuContent.appendChild(button);
    button.addEventListener('click', confirmPurchase);
}

async function confirmPurchase() {
    data = await catalogue ;
    let tableauStatistique = JSON.parse(localStorage.getItem('tableauStatistique')) || [];
    panierData.forEach(item => {
        let cat;
        for (const element of data) {
            if (element.nom == item.nom) {
                cat = element.categorie;
    
        tableauStatistique.push({
            categorie: cat,
            nom: item.nom,
            quantite: item.quantite,
            prix: item.prix,
            date: new Date().toISOString()
            });
        } }
    });

    sessionStorage.removeItem('panierdata');
    sessionStorage.setItem('quantite', 0);

    if (session.length == 0) {
        alert('creer un compte');
    } else {
        localStorage.setItem('tableauStatistique', JSON.stringify(tableauStatistique));
        window.location.href = '../index.html';
    }
}

let display = false;

async function showrecu() {
    if (!display) {
        await recus();
        recuContent.style.display = 'block';
        recu.style.display = 'flex';
        display = true;
    } else {
        recu.style.display = 'none';
        display = false;
    }
}
