document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded"); // première verification
    afficherQuestion();
    
    const calculateBtn = document.getElementById('calculerEmp');

    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // pour vérifier si le code s'exécute comme prévu on fait des console log
        console.log("Bouton cliqué - début de la fonction"); //  vérification 2
        const req = new XMLHttpRequest();
        req.open("GET", `https://impactco2.fr/api/v1/thematiques/ecv/5?detail=0&language=fr`);
        console.log("Requete créée et configurée"); //  vérification 3
        req.onreadystatechange = function (){
            console.log(`Etat de la requete: ${req.readyState}, Statut: ${req.status}`); // vérification 3
            if (req.readyState == 4 && req.status === 200){
                const data = JSON.parse(req.responseText);
                console.log("Données reçues: ", data); // vérification 4
                calculerEmpreinte(data);
            }
        }; 
        req.send(); // ligne cruciale pour envoyer la requete sinon il ne se passe rien
        console.log("Requete envoyée"); // dernière vérification
    });
});
// l'affichage des questions une par une
let currentQuestion = 0;

function afficherQuestion(){
    const questions = document.querySelectorAll('.question-container');
    questions.forEach((q, index) => {
        q.style.display = index === currentQuestion ? 'block' : 'none';
    });
}

function suivant(e){
    e.preventDefault(); // empeche le rechargement de la page
    const questions = document.querySelectorAll('.question-container');

    if (currentQuestion < questions.length - 1){
        currentQuestion++;
        afficherQuestion();
    }
}


function calculerEmpreinte(data) {
    console.log("calculerEmpreinte appelée")
    console.log("Processing data:", data);
    
    let totalEmpreinte = 0;
    for (const item of data.data) {
        const input = document.getElementById(item.slug);
        console.log(item.slug);
        if (input && input.value) {
            totalEmpreinte += (input.value * item.ecv)/52; // pour calculer l'empreinte par semaine
        }
    }
    const resultatDiv = document.getElementById('resultat');
    resultatDiv.innerText = `Ton empreinte carbone est estimée à : ${totalEmpreinte.toFixed(2)} kg CO2e par semaine`; 
    resultatDiv.style.display = 'block';
}

