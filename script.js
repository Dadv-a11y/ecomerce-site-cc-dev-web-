let menu = document.getElementById('menu')
let menuicon = document.getElementById('menu-icon')
let produits = document.getElementById('categorie')
let bestProduct = document.getElementById('best-product')
let Description = document.getElementById('description')
let changerbouton = document.querySelectorAll('.change')


console.log(changerbouton ,'bouton')
console.log(menu)
console.log(menuicon)

let displaymenu = 1

const catalogue= fetch('/catalogue.json').then((response)=>{
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
        src='image/icon/fermer.png'
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
                     window.location.href='page produit/pageproduit.html'
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
        src='image/icon/menu.png'
        menuicon.src = src
        menu.style.display='none'
        displaymenu=1
        menu.innerHTML=null
     }  
     
}
   let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
let quantite = sessionStorage.getItem('quantite')||0
panier.textContent= quantite
async function fillProduit() {
    const data = await catalogue;
    // creation d'un tableau de categorie  avec map sans doublon grace a Set
    const categories = [...new Set(data.map(produit => produit.categorie))];

    categories.forEach(categorie => {
        const categorieiDiv = document.createElement('div');
        categorieiDiv.classList.add('categoriei');
        const p = document.createElement('p');
        //pour afficher le nom des categories de produits
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
                prix.textContent = produit.prix*624+'fcfa';
                const img = document.createElement('img');
                img.src = produit.src; 
                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(br);
                div.appendChild(prix);
                // pour gerer l'ajout des elements au panier panier
                let button = document.createElement('button')
                button.classList.add('ajouteraupanier');
                button.textContent = 'Ajouter au panier';
                ajoutpanier(button , produit)
                div.appendChild(button)
                // chaque produit est ajouté à la div produits
                produitsDiv.appendChild(div);
            }
        });
         const buttonPlus = document.createElement('button');
         buttonPlus.classList.add('plus');
         buttonPlus.addEventListener('click',function(){
            let text = categorie
            sessionStorage.setItem('pageproduit', text)
            window.location.href='page produit/pageproduit.html'
         })
        produits.appendChild(categorieiDiv).appendChild(produitsDiv);
        produits.appendChild(categorieiDiv).appendChild(buttonPlus);
        buttonPlus.innerText='plus';
    });
}
// Appel de la fonction lorsque la page finit de charger
document.addEventListener('DOMContentLoaded', fillProduit);

fillbestProduct(0);// valeur par defaut 

async function fillbestProduct(i) {
    // effacer l'ancien contenu
    const imageElement = document.querySelector('#best-product .image');
    Description.innerHTML='';
    if (imageElement) {
        imageElement.remove(); // Supprime l'élément avec l' acienne image
    }
    
    //ajouter le nouveau contenu
    const data = await catalogue;
    const div = document.createElement('div');
    div.classList.add('image');
    
    const img = document.createElement('img');
    img.src = data[i].src;
    
    const nom = data[i].nom;
    const caracteristiques = data[i].caracteristiques; 
    const prix = data[i].prix * 624 + ' fcfa'; 
    
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(nom));
    p.appendChild(document.createElement('br'));
     // Itération sur les clés de l'objet caracteristiques
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

document.addEventListener('DOMContentLoaded', fillbestProduct)
  // pour changer de produit dans best product avec les boutons
 changerbouton.forEach(button => {
        button.addEventListener('click', function() {
            changerbouton.forEach(btn => {
                btn.style.backgroundColor = 'gray'; 
            });
    
            button.style.backgroundColor = 'black'; 
            
            let numero = button.id;
            fillbestProduct(numero);
        });
    });

    let currentIndex = 0; // Index pour suivre le produit actuel
const totalbouton = 3; 
// Fonction pour changer automatiquement le produit affiché
function autoChangeProduct() {
    fillbestProduct(currentIndex);
    changerbouton.forEach(button=>{
        if(button.id==currentIndex){
            button.style.backgroundColor = 'black';
        }
        else{
            button.style.backgroundColor='gray'
        }
    })
    currentIndex = (currentIndex + 1) % totalbouton; // Incrémente l'index et le remet à 0 si on atteint le total
}
// Exécute la fonction autoChangeProduct toutes les 5 secondes (5000 millisecondes)
setInterval(autoChangeProduct, 5000);

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
 
let rechercher = document.getElementById('rechercher')

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
        window.location.href='page de resultat/pageresultat.html'
     }
    
    console.log(filteredProducts); // Affiche les produits qui correspondent à la recherche
}


function paniers(){
   window.location.href='page du panier/panier.html'
}
 function ajoutpanier(button , produit){
    let i =0 
    button.addEventListener('click', function() {    
        let exist = false
         let data = {} ;                  
         data.nom = produit.nom;
         data.prix = produit.prix;
         data.quantite = ++i; 
       if(panierData.length !=0){
          for (const key in panierData) {
             if(panierData[key].nom == data.nom){
                panierData[key].quantite++
                exist = true
             }
          }
       }
        if(!exist){
         panierData.push(data);
         console.log(exist)
        }
         console.log(panierData);
         sessionStorage.setItem('panierdata', JSON.stringify(panierData)); 
     quantite++;
     panier.textContent = quantite;
     sessionStorage.setItem('quantite', quantite);
 });
 }