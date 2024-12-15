const inputs = document.getElementsByTagName('input');
const submitButton = document.getElementById('submit');
let userData = JSON.parse(localStorage.getItem('userData')) || []; // Assurez-vous que userData est un tableau
let data = {};

function verifyInput() {
    let allFilled = true; // Variable pour vérifier si tous les champs sont remplis
    data = {}; // Réinitialiser les données à chaque vérification

    for (const input of inputs) {
        // Vérifier si le champ est vide
        if (input.value === "") {
            input.placeholder = 'Veuillez remplir le champ';
            input.style.borderColor = 'red';
            input.style.opacity = '1';
            allFilled = false; // Un champ est vide
        } else {
            input.placeholder = '';
            input.style.borderColor = 'none';
            input.style.opacity = '0.3';
            let key = input.id;
            data[key] = input.value; // Stocker la valeur dans l'objet data
        }
    }
    return allFilled;
}

function createSession() {
    const isInputValid = verifyInput();
    const existingUser  = userData.find( user => user.username === data.email||user.email === data.email && user.password === data.password);
    console.log(existingUser);
    if (isInputValid && existingUser ) {
       let session=''
        session = JSON.stringify(data);
        sessionStorage.setItem('session', session);
        window.location.href = '../index.html';
    } else if (!isInputValid) {
        alert("Veuillez remplir tous les champs.");
    } else {
       alert("Identifiants incorrects.");
    }
}

submitButton.addEventListener('click', function(e) {
    e.preventDefault();
     createSession();
   
});