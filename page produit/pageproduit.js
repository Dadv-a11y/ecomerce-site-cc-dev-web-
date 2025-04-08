
let menuicon = document.getElementById('menu-icon')
let displaymenu = 1
const catalogue= fetch('../catalogue.json').then((response)=>{
    if(!response.ok){
        return console.log('Oops! Something went wrong.')
    }
    return response.json()
}).then((data)=>{
    return data 
})



let displayuser = 1 ;
let userInformation = document.getElementById('user-data')
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let session = JSON.parse(sessionStorage.getItem('session'))

function login() {
    if(displayuser==1){
       userInformation.style.display='block';
       displayuser = 0;
       for (const user of userData) {
           if(user.username === session.email||user.email === session.email && user.password === session.password){
             for (const key in user) {
                   let element = user[key];
                   if(key=='password'){ element = '.......'}
                   let p = document.createElement('p');
                   p.appendChild(document.createElement('span')).appendChild(document.createTextNode(key));
                   p.appendChild(document.createElement('span')).appendChild(document.createTextNode(element));
                   p.appendChild(document.createElement('br'));
                   userInformation.appendChild(p);
             }
           }
       }
    }
    else{
       userInformation.innerHTML='';
       userInformation.style.display='none';
       displayuser = 1 ;
    }
   }

  
   let title = document.getElementById('title')
   let carteProduit = document.getElementById('carteProduit')
   // pour recuperer la categorie selectionner dans le menu
   let produitAafficher = sessionStorage.getItem('pageproduit')
     title.textContent = produitAafficher 

     // fonction pour crrer le contenu de page produit
    async function fillpageproduit(){
        let id = 20 ;
        const data = await catalogue;
        data.forEach((produit)=>{
            let p = document.createElement('p');
            if( produit.categorie == produitAafficher){
                const caracteristiques = produit.caracteristiques
                for (const key in caracteristiques) {
                    p.appendChild(document.createTextNode(`${key}: ${caracteristiques[key]}`));
                    p.appendChild(document.createElement('br')); 
                }
                const button = `   <button class="add_cart" 
                data-id="${id}"
                data-title="${produit.nom}"
                data-image="/${produit.src}"
                data-price="${produit.prix}"
                onclick="ajout(${id}, '${produit.nom}', '/${produit.src}', ${produit.prix})"
                >Ajouter au panier</button>`;

let card =`<div class="swiper-slide">  
<div class="card">
<div class="card_area">
<img src="../${produit.src}" alt="${produit.nom}" class="card_image">
</div>
<div class="card_body">
<h3 class="card_title">${produit.nom}</h3>
<p class="price">${produit.prix}$</p>
${p.outerHTML}
${button}
</div>
</div>
</div>
</div>`           
 id++ ;  
 carteProduit.insertAdjacentHTML('beforeend',card);
                }
        })
    }
  
    document.addEventListener('DOMContentLoaded', fillpageproduit)
    
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
            window.location.href='../page de resultat/pageresultat.html'
         }
        
        console.log(filteredProducts); // Affiche les produits qui correspondent à la recherche
    }
    
function ajout(id , title , image , price){
    const cartItem = {id, title, image ,price};
    const cart = JSON.parse(localStorage.getItem('cart'))|| [];
    cart.push(cartItem);
    localStorage.setItem("cart",JSON.stringify(cart));
    console.log('ajout');
  };
   
  const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleButton = document.querySelector('.sidebar-toggle');
let isdisplay = true ;
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
              const button = createButton(categories, 'pageproduit.html',categories);
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