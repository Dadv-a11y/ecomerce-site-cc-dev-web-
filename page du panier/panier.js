
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

async function fillMenu() {
    let src 
     //pour afficher le menu
    if(displaymenu ==1){
        src='../image/icon/fermer.png'
        menuicon.src = src
         menu.style.display='block'
        const data = await catalogue;
        const ul = document.createElement('ul');
        // Création d'un ensemble pour stocker les catégories déjà ajoutées
        const categoriesAdded = new Set();
          data.forEach((produit) => {
              const categories = produit.categorie;
              // Vérification si la catégorie n'a pas déjà été ajoutée
              if (!categoriesAdded.has(categories)) {
                categoriesAdded.add(categories);
                const li = document.createElement('li');
                const button = document.createElement('Button')
                button.appendChild(document.createTextNode(categories));
                  // pour generer la page lie au produit
                  button.addEventListener('click',function(){
                    let text = button.textContent
                     sessionStorage.setItem('pageproduit', text)
                     window.location.href='../page produit/pageproduit.html'
                })
                li.appendChild(button);
                ul.appendChild(li);
              }
            });
         menu.appendChild(ul);
         displaymenu=0
     }
     // pour cacher le menu
     else{
        src='../image/icon/menu.png'
        menuicon.src = src
        menu.style.display='none'
        displaymenu=1
        menu.innerHTML=null
     }  
}

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
   let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
   let quantite = sessionStorage.getItem('quantite')||0
   panier.textContent= quantite
   let title = document.getElementById('title')
   let carteProduit = document.getElementById('carteProduit')
 
    //  fonction pour creer le contenu de page produit
     async function fillpagePanier() {
        if(panierData.length == 0){
           carteProduit.innerText = ' pas de produit achete'
        }
        let src 
        const data = await catalogue;
        for (let element of panierData) {
            console.log(element)
                const div1 = document.createElement('div');
                div1.classList.add('imageproduit');
                let img = document.createElement('img');
                for (const key in data) {
                   if(data[key].nom == element.nom){
                    src = data[key].src
                   }
                }
                img.src = '../' + src;
                div1.appendChild(img);
                const div2 = document.createElement('div');
                div2.classList.add('descriptionproduit');
                const div3 = document.createElement('div');
                div3.classList.add('presentationduproduit');
                let p = document.createElement('p');
                p.appendChild(document.createTextNode(element.nom));
                let prix = element.prix * 624;
                p.appendChild(document.createElement('br'));
                p.appendChild(document.createTextNode(prix + ' fcfa'));
                p.appendChild(document.createElement('br'));
                let quantite = document.createElement('p');
                quantite.textContent = 'quantite:'+''+'x'+ element.quantite;
                p.appendChild(quantite);
                div2.appendChild(p)
                div3.appendChild(div1)
                div3.appendChild(div2)
                carteProduit.appendChild(div3)
            }
        }
        function paniers(){
            window.location.href='panier.html'
         }
    
        async function ResultatRecherche() {
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
        



     document.addEventListener('DOMContentLoaded', fillpagePanier)
