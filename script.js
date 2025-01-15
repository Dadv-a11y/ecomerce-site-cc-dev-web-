let menu = document.getElementById('menu');
let menuicon = document.getElementById('menu-icon');
let produits = document.getElementById('categorie');
let bestProduct = document.getElementById('best-product');
let Description = document.getElementById('description');
let changerbouton = document.querySelectorAll('.change');

console.log(changerbouton, 'bouton');
console.log(menu);
console.log(menuicon);

let displaymenu = 1;

const catalogue = fetch('/catalogue.json').then((response) => {
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
        src = 'image/icon/fermer.png';
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
                const button = createButton(categories, 'page produit/pageproduit.html');
                li.appendChild(button);
                ul.appendChild(li);
            }
        });
        menu.appendChild(ul);
        displaymenu = 0;
    } else {
        src = 'image/icon/menu.png';
        menuicon.src = src;
        menu.style.display = 'none';
        displaymenu = 1;
        menu.innerHTML = null;
    }
}

let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
let quantite = sessionStorage.getItem('quantite') || 0;
panier.textContent = quantite;

async function fillProduit() {
    const data = await catalogue;
    const categories = [...new Set(data.map(produit => produit.categorie))];
    categories.forEach(categorie => {
        const categorieiDiv = document.createElement('div');
        categorieiDiv.classList.add('categoriei');
        const p = document.createElement('p');
        p.textContent = categorie;
        produits.appendChild(p);

        const produitsDiv = document.createElement('div');
        produitsDiv.classList.add('produits');

        data.forEach(produit => {
            if (produit.categorie === categorie) {
                const div = document.createElement('div');
                div.classList.add('produit');
                const p = document.createElement('p');
                p.textContent = produit.nom;
                const br = document.createElement('br');
                const prix = document.createElement('p');
                prix.textContent = produit.prix * 624 + 'fcfa';
                const img = document.createElement('img');
                img.src = produit.src;
                img.alt = produit.nom;
                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(br);
                div.appendChild(prix);
                const button = createButton('Ajouter au panier', '', produit);
                div.appendChild(button);
                produitsDiv.appendChild(div);
            }
        });

        const buttonPlus = createButton('plus', 'page produit/pageproduit.html', categorie);
        produits.appendChild(categorieiDiv).appendChild(produitsDiv);
        produits.appendChild(categorieiDiv).appendChild(buttonPlus);
    });
}

document.addEventListener('DOMContentLoaded', fillProduit);

fillbestProduct(0);

async function fillbestProduct(i) {
    const imageElement = document.querySelector('#best-product .image');
    Description.innerHTML = '';
    if (imageElement) {
        imageElement.remove();
    }
    let bestProducts = localStorage.getItem('bestProduct') || [];
    const data = await catalogue;
   if(bestProducts.length !=0 ){
  const video = document.querySelector('#best-product .video');
  if(video){
    video.remove();
  }
    const div = document.createElement('div');
    div.classList.add('image');

    const bestProductDetails = data.filter(item =>
        bestProducts.includes(item.nom)
    );
    const img = document.createElement('img');
    img.src = bestProductDetails[i].src;
    const nom = bestProductDetails[i].nom;
    const caracteristiques = bestProductDetails[i].caracteristiques;
    const prix = bestProductDetails[i].prix * 624 + ' fcfa';

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(nom));
    p.appendChild(document.createElement('br'));
    for (const key in caracteristiques) {
        p.appendChild(document.createTextNode(`${key}: ${caracteristiques[key]}`));
        p.appendChild(document.createElement('br'));
    }
    p.appendChild(document.createElement('br'));
    p.appendChild(document.createTextNode(prix));

    div.appendChild(img);
    Description.appendChild(p);
    bestProduct.appendChild(div);
   }

}

document.addEventListener('DOMContentLoaded', fillbestProduct);

changerbouton.forEach(button => {
    button.addEventListener('click', function () {
        changerbouton.forEach(btn => {
            btn.style.backgroundColor = 'gray';
        });

        button.style.backgroundColor = 'black';

        let numero = button.id;
        fillbestProduct(numero);
    });
});

let currentIndex = 0;
const totalbouton = 3;

function autoChangeProduct() {
    fillbestProduct(currentIndex);
    changerbouton.forEach(button => {
        if (button.id == currentIndex) {
            button.style.backgroundColor = 'black';
        } else {
            button.style.backgroundColor = 'gray';
        }
    });
    currentIndex = (currentIndex + 1) % totalbouton;
}

let ischange = localStorage.getItem('bestProduct') || [];
if(ischange.length !=0){
    setInterval(autoChangeProduct, 5000);
}else{
    div= document.createElement('div');
    div.classList.add('video');
    bestProduct.innerHTML =` <video controls autoplay loop>
     <source src="VIDEO/presentation.mp4" type="video/mp4"></source>
     </video>`
    //  bestProduct.appendChild(div);
}

let displayuser = 1;
let userInformation = document.getElementById('user-data');
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let session = JSON.parse(sessionStorage.getItem('session'));

function login() {
    if (displayuser == 1) {
        userInformation.style.display = 'block';
        displayuser = 0;
        for (const user of userData) {
            if (user.username === session.email || user.email === session.email && user.password === session.password) {
                for (const key in user) {
                    let element = user[key];
                    if (key == 'password') { element = '.......' }
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

let rechercher = document.getElementById('rechercher');

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
        window.location.href = 'page de resultat/pageresultat.html';
    }
}

function paniers() {
    window.location.href = 'page du panier/panier.html';
}

function ajoutpanier(button, produit) {
    let i = 0;
    button.addEventListener('click', function () {
        let exist = false;
        let data = {};
        data.nom = produit.nom;
        data.prix = produit.prix;
        data.quantite = ++i;
        if (panierData.length != 0) {
            for (const key in panierData) {
                if (panierData[key].nom == data.nom) {
                    panierData[key].quantite++;
                    exist = true;
                }
            }
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

function createButton(text, href, produit) {
    const button = document.createElement('button');
    button.textContent = text;
    
    if (text.toLowerCase() === 'plus') {
        button.classList.add('plus');
    }

    if (href) {
        button.addEventListener('click', function () {
            sessionStorage.setItem('pageproduit', produit);
            window.location.href = href;
        });
    } else if (produit) {
        ajoutpanier(button, produit);
    }
    return button;
}

 