// charge les donnees de userdata stockes en local s'il n'y a pas de donnee il initialise userdata=[]
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let data = {};
const inputs = document.getElementsByTagName('input');
const submitbutton = document.getElementById('submit');

// fonction pour creer un objet qui contiendra les infos de l'utilisateur
function GetData() {
    for (const input of inputs) { 
        input.addEventListener('input', function() {
            let key = input.id; 
            let value = input.value;
            data[key] = value;
        });
    }
}

function ADDdata() {
    // Vérifier si l'utilisateur existe déjà
    const existingUser  = userData.find(user => user.username === data.username || user.email === data.email);
    console.log(!existingUser);
    if (!existingUser ) {
        // Si l'utilisateur n'existe pas, ajouter les données
        userData.push(data);
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log(userData);
        // Réinitialiser les champs de saisie
        for (const input of inputs) {
            input.value = '';
        }
        // Redirection vers index.html
        window.location.href = '../page de connexion/connexion.html';
    } else {
        console.log('Cet utilisateur existe déjà.');
        if( userData.find(user=> user.username === data.username)){alert('changer de nom d utilisateur celui ci existe deja')}
        if( userData.find(user=>  user.email===data.email) ){alert('changer d addresse email celui ci existe deja')}
       
    }
}

function VerifyInput() {
    let allFilled = true; // Variable pour vérifier si tous les champs sont remplis

    for (const input of inputs) {
        // vérifier si le champ est vide
        if (input.value === "") {
            input.placeholder = 'veuillez remplir le champ';
            input.style.borderColor = 'red';
            input.style.opacity = '1';
            allFilled = false; // Un champ est vide
        } else {
            input.placeholder = '';
            input.style.borderColor = 'none';
            input.style.opacity = '0.3';
        }
    }

    // Appeler ADDdata seulement si tous les champs sont remplis
    if (allFilled) {
        ADDdata();
    }
}

submitbutton.addEventListener('click', function(e) {
    e.preventDefault();
    VerifyInput();  
});

document.addEventListener('DOMContentLoaded', GetData);
console.log(data, 'data');

