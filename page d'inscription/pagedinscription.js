// charge les donnees de userdata stockes en local s'il n'y a pas de donnee il initialise userdata=[]
let userData = JSON.parse(localStorage.getItem('userData')) || [];
let data = {};
const inputs = document.getElementsByTagName('input');
const submitbutton = document.getElementById('submit');

// fonction pour creer un objet qui contiendra les infos de l'utilisateur
function GetData() {
    for (const input of inputs) { 
        input.addEventListener('input', updateData);
    }
}

function updateData(event) {
    let key = event.target.id; 
    let value = event.target.value;
    data[key] = value;
}

function ADDdata() {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = userData.find(user => user.username === data.username || user.email === data.email);
    if (!existingUser) {
        // Si l'utilisateur n'existe pas, ajouter les données
        userData.push(data);
        localStorage.setItem('userData', JSON.stringify(userData));
        resetInputs();
        // Redirection vers index.html
        window.location.href = '../page de connexion/connexion.html';
    } else {
        handleExistingUser();
    }
}

function handleExistingUser() {
    console.log('Cet utilisateur existe déjà.');
    if (userData.find(user => user.username === data.username)) {
        alert('changer de nom d utilisateur celui ci existe deja');
    }
    if (userData.find(user => user.email === data.email)) {
        alert('changer d addresse email celui ci existe deja');
    }
}

function resetInputs() {
    for (const input of inputs) {
        input.value = '';
    }
}

function VerifyInput() {
    let allFilled = true; // Variable pour vérifier si tous les champs sont remplis

    for (const input of inputs) {
        // vérifier si le champ est vide
        if (input.value === "") {
            setInputError(input, true);
            allFilled = false; // Un champ est vide
        } else {
            setInputError(input, false);
        }
    }

    // Appeler ADDdata seulement si tous les champs sont remplis
    if (allFilled) {
        ADDdata();
    }
}

function setInputError(input, isError) {
    if (isError) {
        input.placeholder = 'veuillez remplir le champ';
        input.style.borderColor = 'red';
        input.style.opacity = '1';
    } else {
        input.placeholder = '';
        input.style.borderColor = 'none';
        input.style.opacity = '0.3';
    }
}

submitbutton.addEventListener('click', function(e) {
    e.preventDefault();
    VerifyInput();  
});

document.addEventListener('DOMContentLoaded', GetData);

