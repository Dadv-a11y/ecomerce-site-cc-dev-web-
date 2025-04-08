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


let title = document.getElementById('title');
let carteProduit = document.getElementById('carteProduit');
let resultat = JSON.parse(sessionStorage.getItem('resultatRecherche'));

function fillpageResultat() {
    carteProduit.innerHTML = '';
    let p1 = document.createElement('p');
    p1.appendChild(document.createTextNode(`Nombre de résultats: ${resultat.length}`));
    p1.style.position ='absolute';
    p1.style.zIndex ='1'
    p1.style.top ='8rem'
    p1.style.right='45%'
    carteProduit.style.marginTop='30px'
    carteProduit.appendChild(p1);
    let id = 30 ;
    resultat.forEach((element) => {
                const button = `   <button class="add_cart" 
                data-id="${id}"
                data-title="${element.nom}"
                data-image="/${element.src}"
                data-price="${element.prix}"
                onclick="ajout(${id}, '${element.nom}', '/${element.src}', ${element.prix})"
                >Ajouter au panier</buttoen>`;

let card =`<div class="swiper-slide">  
<div class="card">
<div class="card_area">
<img src="../${element.src}" alt="${element.nom}" class="card_image">
</div>
<div class="card_body">
<h3 class="card_title">${element.nom}</h3>
<p class="price">${element.prix}$</p>
${button}
</div>
</div>
</div>
</div>`           
 id++ ;  
 carteProduit.insertAdjacentHTML('beforeend',card);
                }
       
    )};


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

function ajout(id , title , image , price){
    const cartItem = {id, title, image ,price};
    const cart = JSON.parse(localStorage.getItem('cart'))|| [];
    cart.push(cartItem);
    localStorage.setItem("cart",JSON.stringify(cart));
    console.log('ajout');
  };
  

document.addEventListener('DOMContentLoaded', fillpageResultat);



const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleButton = document.querySelector('.sidebar-toggle');
let isdisplay = true
toggleButton.addEventListener('click', () => {
     if(!isdisplay){
      mainContent.style.marginLeft ='0' ;
      sidebar.style.visibility ='hidden';
      console.log('bon:', isdisplay)
      isdisplay= true ;
     }
     else{
      mainContent.style.marginLeft = '250px' ;
      sidebar.style.visibility ='visible';
      console.log('mauvais:', isdisplay)
      isdisplay=false;
     }
});
let sidebarMenu = document.getElementById('sidebar-menu')
async function fillMenu() {
      const data = await catalogue;
      const categoriesAdded = new Set();
      let p = `<p>CATEGORIES</p>`;
      sidebarMenu.insertAdjacentHTML('beforeend',p);
      data.forEach((produit) => {
          const categories = produit.categorie;
          if (!categoriesAdded.has(categories)) {
              categoriesAdded.add(categories);
              const button = createButton(categories, '../page produit/pageproduit.html',categories);
              sidebarMenu.appendChild(button);
              sidebarMenu.appendChild(document.createElement('br'));
          }

      });
}
function createButton(text, href, produit) {
  const button = document.createElement('button');
  button.textContent = text;
  
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

let admin  = JSON.parse(sessionStorage.getItem('session')) || {};
 if(admin.email== "admin" && admin.password ==  "admin" && admin.length != 0 ){
  let DASHBOARD = document.getElementById('DASHBOARD'); 
  DASHBOARD.style.display='inline';
 }
 else{
    let DASHBOARD = document.getElementById('DASHBOARD');
    DASHBOARD.style.display ='none';
 }

document.addEventListener('DOMContentLoaded',fillMenu)