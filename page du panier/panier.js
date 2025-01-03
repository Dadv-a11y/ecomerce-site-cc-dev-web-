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
let session = JSON.parse(sessionStorage.getItem('session')) || [];

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
   let quantites = sessionStorage.getItem('quantite')||0
   panier.textContent= quantites
   let title = document.getElementById('title')
   let carteProduit = document.getElementById('carteProduit')
 
    //  fonction pour creer le contenu de page produit
     async function fillpagePanier() {
        if(panierData.length == 0){
           carteProduit.innerText = ' pas de produit achete'
           carteProduit.style.fontSize = '25px'
           carteProduit.style.textAlign ='center'
           carteProduit.style.color ='red'
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
                quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;

                // Create decrease button
                let decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.style.padding = '0 10px';
                decreaseButton.style.borderRadius = '10px';
                decreaseButton.style.border = 'none';
                decreaseButton.style.backgroundColor = 'orange';
                decreaseButton.style.marginTop = '10px';
                decreaseButton.addEventListener('click', () => {
                    if (element.quantite > 1) {
                        element.quantite--;
                        quantites--
                        panier.textContent= quantites
                        quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;
                        sessionStorage.setItem('panierdata', JSON.stringify(panierData));
                        sessionStorage.setItem('quantite', quantites)
                    }
                });

                // Create increase button
                let increaseButton = document.createElement('button');
                increaseButton.textContent = '+';
                increaseButton.style.padding = '0 10px';
                increaseButton.style.borderRadius = '10px';
                increaseButton.style.border = 'none';
                increaseButton.style.backgroundColor = 'orange';
                increaseButton.style.marginTop = '10px';
                increaseButton.addEventListener('click', () => {
                    element.quantite++;
                    quantites++
                    panier.textContent= quantites
                    quantite.textContent = 'quantite:' + ' ' + 'x' + element.quantite;
                    sessionStorage.setItem('panierdata', JSON.stringify(panierData));
                    sessionStorage.setItem('quantite', quantites)
                });

                // Create remove button
                let removeButton = document.createElement('button');
                let deleteimg = document.createElement('img')
                deleteimg.src = '../image/icon/icons8-supprimer-la-corbeille-48.png' 
                deleteimg.style.width ='50px'
                removeButton.style.border = 'none';
                removeButton.style.backgroundColor = 'white';
                removeButton.addEventListener('click', () => {
                    carteProduit.removeChild(div3);
                    quantites = quantites - element.quantite
                    panier.textContent= quantites
                    panierData = panierData.filter(item => item.nom !== element.nom);
                    sessionStorage.setItem('panierdata', JSON.stringify(panierData));
                    sessionStorage.setItem('quantite', quantites)
                });
                removeButton.appendChild(deleteimg)
                p.appendChild(decreaseButton);
                p.appendChild(increaseButton);
                p.appendChild(quantite);
                p.appendChild(removeButton);

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

     let recu = document.getElementById('recu')
     let recuContent= document.getElementById('recuContent')
     async function recus() {
        // Récupérer les données du panier
        let panierData = JSON.parse(sessionStorage.getItem('panierdata')) || [];
        
        // Récupérer les données du catalogue
        const data = await catalogue;
    
        // Initialiser le montant total
        let totalMontant = 0;
    
        // Créer un élément <ul> pour afficher les détails
        let ul = document.createElement('ul');
    
        // Parcourir chaque élément du panier
        panierData.forEach(element => {
            // Trouver le produit correspondant dans le catalogue
            let produit = data.find(p => p.nom === element.nom);
    
            if (produit) {
                // Calculer le coût du produit
                let cout = produit.prix * element.quantite*624;
    
                // Ajouter le coût au montant total
                totalMontant += cout;
    
                // Créer un élément <li> pour afficher les détails du produit
                let li = document.createElement('li');
                li.textContent = `${element.nom} - Quantité: ${element.quantite} - Coût: ${cout} fcfa`;
    
                // Ajouter l'élément <li> à la liste <ul>
                ul.appendChild(li);
            }
        });
    
        // Afficher le montant total
        let total = document.createElement('p');
        total.textContent = `Montant total de la facture: ${totalMontant} fcfa`;
    
        // Ajouter la liste et le montant total à recuContent
        recuContent.innerHTML=`<button onclick="showrecu()" class="fermer"><img src="../image/icon/fermer.png" alt="fermer"></button>
                <p>selectionner votre mode de paiement</p>
            <ul>
                <li><img src="../image/icon/mtn.png" alt="mtn"></li>
                <li><img src="../image/icon/orange.png" alt="orange"></li>
            </ul>
            <p>vos achats</p>`
        recuContent.appendChild(ul);
        recuContent.appendChild(total);
        let button = document.createElement('button')
        button.className = 'confirmer'
        button.textContent = 'confirmer l achat '
        recuContent.appendChild(button)
        button.addEventListener('click', () => {
            // Récupérer le tableau statistique existant ou créer un nouveau
            let tableauStatistique = JSON.parse(localStorage.getItem('tableauStatistique')) || [];
            
            // Ajouter les données du panier actuel
            panierData.forEach(item => {
                let cat
                for (const element of data) {
                    if(element.nom == item.nom){
                        cat = element.categorie
                    }
                }
                tableauStatistique.push({
                    categorie: cat ,
                    nom: item.nom,
                    quantite: item.quantite,
                    prix: item.prix,
                    date: new Date().toISOString()
                });
            });
            
              
            // Vider le panier après confirmation
            sessionStorage.removeItem('panierdata');
            sessionStorage.setItem('quantite', 0);

           if(session.length == 0){
            alert('creer un compte')
           }
           else{
             // Sauvegarder le tableau mis à jour
             localStorage.setItem('tableauStatistique', JSON.stringify(tableauStatistique));
                 
            // Rediriger vers la page d'accueil
        window.location.href = '../index.html';
            }

    })
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