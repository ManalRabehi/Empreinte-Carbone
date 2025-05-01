const transportOptions = [
    { id: 1, name: 'Avion' },
    { id: 2, name: 'TGV' },
    { id: 3, name: 'Intercités' },
    { id: 4, name: 'Voiture thermique' },
    { id: 5, name: 'Voiture électrique' },
    { id: 6, name: 'Autocar thermique' },
    { id: 7, name: 'Vélo' },
    { id: 8, name: 'Vélo à assistance électrique' },
    { id: 9, name: 'Bus thermique' },
    { id: 10, name: 'Tramway' },
    { id: 11, name: 'Métro' },
    { id: 12, name: 'Scooter ou moto légère thermique' },
    { id: 13, name: 'Moto thermique' },
    { id: 14, name: 'RER ou Transilien' },
    { id: 15, name: 'TER' },
    { id: 16, name: 'Bus électrique' },
    { id: 17, name: 'Trottinette à assistance électrique' },
    { id: 21, name: 'Bus (GNV)' },
    { id: 22, name: 'Covoiturage thermique (1 passager)' },
    { id: 23, name: 'Covoiturage thermique (2 passagers)' },
    { id: 24, name: 'Covoiturage thermique (3 passagers)' },
    { id: 25, name: 'Covoiturage thermique (4 passagers)' },
    { id: 26, name: 'Covoiturage électrique (1 passager)' },
    { id: 27, name: 'Covoiturage électrique (2 passagers)' },
    { id: 28, name: 'Covoiturage électrique (3 passagers)' },
    { id: 29, name: 'Covoiturage électrique (4 passagers)' },
    { id: 30, name: 'Marche' }
  ];

const questions = [
    {
        id: 1,
        question: "Quels moyens de transport utilisez-vous chaque semaine ?", 
        detail: "(Cochez tous ceux que vous utilisez régulièrement pour vos trajets hebdomadaires)",
        // PON ESTO DEL DETALLE EN ITALICS
        possibilités: transportOptions, 
        type: "checkbox"
    },
    // questions especifiques pour chaque moyen de transport:
    // Intro para estas siguientes preguntas Pour chaque moyen de transport que vous avez sélectionné, calculons combien de kilomètres parcourez-vous en moyenne par jour
    {
        id:2, 
        question: "Combien de fois par jour l’utilisez-vous en moyenne ?",
        type: "number"
    },
    {
        id:3, 
        question: "Quelle distance moyenne parcourez-vous à chaque fois (en km) ?",
        type: "number"
    }, 
    {
        id:4, 
        question: "Combien de jours par semaine l’utilisez-vous ?",
        type: "number"
    },
    // total_km = fréquence_journalière × jours_par_semaine × distance_par_trajet

    // Pour les véhicules partagés (voiture, covoiturage, scooter...) :
    //(à afficher uniquement si un des transports suivants est sélectionné : 4, 5, 12, 13, 22-29)
    {
        id:5, 
        question: "Combien de personnes voyagent en moyenne avec vous dans ce véhicule (vous inclus) ?", 
        possibilités: [1,2,3,4,5], // 5+
        type: "radio"
    },

    // emission construction et forçage radiatif
    {
        id:6, 
        question: "Souhaitez-vous inclure les émissions liées à la construction des véhicules dans le calcul ?",
        possibilités: ["oui", "non"], 
        type: "radio"
    },
    {
        id:7, 
        question: "Souhaitez-vous que le calcul tienne compte du forçage radiatif pour les trajets en avion ?",
        possibilités: ["oui", "non"], 
        type: "radio"
    },

    // Déplacements exceptionnels
    {
        id:8, 
        question: "Avez-vous effectué un ou plusieurs trajets exceptionnels au cours de l’année écoulée ?",
        detail:"(Exemples : vacances, retour chez vos parents, week-end prolongé, événement particulier…)",
        possibilités: ["oui", "non"], 
        type: "radio"
    },
    // Si oui
    {
        id:9, 
        question: "Quel(s) mode(s) de transport avez-vous utilisé pour ce/ces trajets exceptionnels?",
        //(mêmes options que la question 1, mais je peut mettre en avant les transports longue distance : avion, TGV, autocar...)
        possibilités: transportOptions,
        type: "checkbox"
    },
    {
        id:10, 
        question: "Quelle distance moyenne avez-vous parcourue pour chaque type de trajet (aller et retour, en km) ?",
        detail: "(Si plusieurs trajets similaires, donnez une estimation moyenne)",
        // (Je peut aussi proposer une estimation automatique s’ils entrent une ville de départ et d’arrivée)
        type: "number"
    },
    {
        id:11, 
        question: "Combien de fois ce type de trajet a-t-il eu lieu pendant les 6 derniers mois ?",
        detail: 'Ex : "Je suis allé voir ma famille 3 fois cette année"', 
        type: "number"
    }
]

const boutonCommencer = document.querySelector("#bouton-commencer");
const containerQuestion = document.querySelector("#container-question"); 



//const phone = document.querySelector("#contact-phone").value;
// dentro de form --> <input type="tel" placeholder="123 456 7890" id="contact-phone" onkeyup="validatePhone()"></input>

// haz una funcion que affiche las preguntas con la cle del dictionaire 
const afficherQuestion = (quest) => {
    let affichage = ""; 
    affichage += `<div class="container">
    <h3 class="question">${quest.question}</h3>`;
    affichage += quest.detail ? `<em class="detail">${quest.detail}</em>` : "";
    affichage += `<form> <div>`;
    if (quest.type == "checkbox"){
        affichage += afficherQuestionCheckbox(quest);
    } else if (quest.type == "number"){
        affichage += afficherQuestionNumber(quest);
    } else if (quest.type == "radio"){
        affichage += afficherQuestionRadio(quest);
    }
        //agrega los botones suivantes y precedentes y agrega el event listener
        //agrega los div separando las questions de los botones suivante y precedente
    affichage += `
        </div>    
        <div>
            <button id="bouton-precedente">Precedente</button>
            <button id="bouton-suivante">Suivante</button>
        </div>
    </form>`;
    return affichage
}

const afficherQuestionCheckbox = (quest) => {
    let affichage = "";
    for (const pos of quest.possibilités){
        affichage += `<input type="checkbox" id="vehicle${pos.id}" name="vehicle${pos.id}" value="${pos.name}"><label for="vehicle${pos.id}">${pos.name}</label><br>`;
    }
    return affichage

}

const afficherQuestionNumber = (quest) => {
    return `<input type="number" id="quest-${quest.id}" name="quest-${quest.id}"> km <br>`;
}

const afficherQuestionRadio = (quest) => {
    let affichage = "";
    for ( let i = 0; i < quest.possibilités.length ; i++){
        affichage += `<input type="radio" id="quest-${quest.id}-option-${i}" name="quest-${quest.id}" value="${quest.possibilités[i]}"><label for="quest-${quest.id}-option-${i}">${quest.possibilités[i]}</label> <br>`;
    }
    return affichage;
}

// una funcion para recolectar la info cada que se ponga suivante


// haz un boucle while que siga siendo m'as pequeño que la talla del diccionario. Boucle while para poder hacer lo de previous y después
// boton en index que diga commencer quizz, cuando se comienza el quizz esta funcion es activada 

let idQuestion = 0; 

const renderQuestion = () => {
    containerQuestion.innerHTML = afficherQuestion(questions[idQuestion]);
    document.querySelector("#bouton-suivante").addEventListener("click", (e) => {
        e.preventDefault();
        if (idQuestion < questions.length - 1) {
            idQuestion++;
            renderQuestion();
        }
    });

    document.querySelector("#bouton-precedente").addEventListener("click", (e) => {
        e.preventDefault();
        if (idQuestion > 0) {
            idQuestion--;
            renderQuestion();
        }
    });
}

const commencerQuestionnaire = () => {
    boutonCommencer.style.display = "none";  
    renderQuestion();
}

boutonCommencer.addEventListener("click", commencerQuestionnaire);
