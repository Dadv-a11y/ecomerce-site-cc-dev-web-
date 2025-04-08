


// Mobile Nav
const hamburger = document.querySelector(".hamburger");
const Nav = document.querySelector(".mob_nav");

hamburger.addEventListener("click", () => {
  Nav.classList.toggle("mob_hidden");
});

// Cart Menu- Add to cart
const AddCart = document.querySelectorAll(".add_cart");
console.log('addcart:', AddCart);
AddCart.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.getAttribute("data-id");
    const title = button.getAttribute("data-title");
    const image = button.getAttribute("data-image");
    const  price= button.getAttribute("data-price");

    const cartItem = {id,title,image,price};
    const cart = JSON.parse(localStorage.getItem('cart'))|| [];
    cart.push(cartItem);
    localStorage.setItem("cart",JSON.stringify(cart));
    console.log('ajout');
  });
});

const catalogue = fetch('catalogue.json').then((response) => {
  if (!response.ok) {
      return console.log('Oops! Something went wrong.');
  }
  return response.json();
}).then((data) => {
  return data;
});

let menu = document.getElementById('menu');
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
              const button = createButton(categories, 'page produit/pageproduit.html',categories);
              const button2 = createButton(categories, 'page produit/pageproduit.html',categories);
              button.classList.add('categ')
              menu.appendChild(button);
               console.log('menu:',menu)
              sidebarMenu.appendChild(button2);
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



let categorieSection = document.getElementById('categories');
async function fillProduit() {
  const data = await catalogue;
  const categories = [...new Set(data.map(produit => produit.categorie))];
  let id = 11;
  categories.forEach(categorie => {
  
let div1 = document.createElement('div');
div1.classList.add('swiper' ,'mySwiper');
let cards = document.createElement('div');
cards.classList.add('swiper-wrapper');
let div3 = document.createElement('div');
div3.classList.add('swiper-pagination');
const buttonPlus = createButton('plus', 'page produit/pageproduit.html', categorie);
buttonPlus.classList.add('btn');
      data.forEach(produit => {
          if (produit.categorie === categorie) {
            const button = `   <button class="add_cart" 
                                data-id="${id}"
                                data-title="${produit.nom}"
                                data-image="${produit.src}"
                                data-price="${produit.prix}"
                                onclick="ajout(${id}, '${produit.nom}', '${produit.src}', ${produit.prix})"
                                >Ajouter au panier</button>`;
   
   let card =`<div class="swiper-slide">  
           <div class="card">
            <div class="card_area">
                <img src="${produit.src}" alt="${produit.nom}" class="card_image">
            </div>
            <div class="card_body">
                <h3 class="card_title">${produit.nom}</h3>
                <p class="price">${produit.prix}$</p>
                ${button}
                </div>
            </div>
        </div>
        </div>`          
          cards.insertAdjacentHTML('beforeend', card);  
          id++ ;  
          }
         
      });
      div1.appendChild(cards);
       div1.appendChild(div3);
      

      let container =` <div class="container">
        <div class="category">
        <span class="para"></span>
        <p class="category_p">Apercu de produit </p>
        </div>
        <div class="section_head">
        <h3 class="title">${categorie}</h3>
        </div>

        <!-- Swiper -->
        ${div1.outerHTML}
        </div>`
    // categories.appendChild(container);
    categorieSection.insertAdjacentHTML('beforeend', container);
    console.log(categorieSection); 
  });
}

function ajout(id , title , image , price){
  const cartItem = {id, title, image ,price};
  const cart = JSON.parse(localStorage.getItem('cart'))|| [];
  cart.push(cartItem);
  localStorage.setItem("cart",JSON.stringify(cart));
  console.log('ajout');
};

async function ResultatRecherche() {
  let rechercher = document.getElementById('rechercher');
  const data = await catalogue;
  console.log(rechercher.value);
  const resultat = rechercher.value.toLowerCase(); // Convertir en minuscules pour une recherche insensible à la casse
  const filteredProducts = data.filter(produit => {
      return produit.nom.toLowerCase().includes(resultat) || produit.categorie.toLowerCase().includes(resultat);
  });
   if(filteredProducts.length == 0||rechercher.value==''){
      alert('pas de resultat')
   }
   else{
      sessionStorage.setItem('resultatRecherche', JSON.stringify(filteredProducts))
      window.location.href='page de resultat/pageresultat.html'
   }
  
  console.log(filteredProducts); // Affiche les produits qui correspondent à la recherche
}

document.addEventListener('DOMContentLoaded', async () => {
  await fillMenu();
  await fillProduit();
});
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleButton = document.querySelector('.sidebar-toggle');
let isdisplay = true
toggleButton.addEventListener('click', () => {
     if(isdisplay){
      mainContent.style.marginLeft ='0' ;
      sidebar.style.visibility ='hidden';
      console.log('bon:', isdisplay)
      isdisplay= false ;
     }
     else{
      mainContent.style.marginLeft = '250px' ;
      sidebar.style.visibility ='visible';
      console.log('mauvais:', isdisplay)
      isdisplay= true;
     }
});


 let admin  = JSON.parse(sessionStorage.getItem('session')) || {};
 if(admin.email== "admin" && admin.password ==  "admin" && admin.length != 0 ){
  let DASHBOARD = document.getElementById('DASHBOARD'); 
  DASHBOARD.style.display='inline';
 }
 else{
    let DASHBOARD = document.getElementById('DASHBOARD');
    DASHBOARD.style.display ='none';
 }