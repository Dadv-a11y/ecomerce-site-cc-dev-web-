const CartItems = document.querySelector(".cart-items");

let cartTotal = 0;
function displayCartItems() {
  const items = JSON.parse(localStorage.getItem("cart"));
  items.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart_item";
    cartItem.innerHTML = `
    <p class="cart_id">${item.id}</p>
              <p class="cart_title">${item.title}</p>
              <img src="${item.image}" alt="${item.title}" class="cart_img" />
              <p class="cart_price">${item.price}</p>
              <p class="cart_delete">Delete</p>
    `;
    CartItems.appendChild(cartItem);
  });
}

const catalogue = fetch('catalogue.json').then((response) => {
  if (!response.ok) {
      return console.log('Oops! Something went wrong.');
  }
  return response.json();
}).then((data) => {
  return data;
});


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

displayCartItems();
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