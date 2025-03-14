import { importData } from './import_table.js';
import { showResult, createArrow } from './results.js';

const questions = await importData("./data/QCM.csv", false);
let answers = [];
let k = 5;
let customProfile = { "Courage": 5, "Ambition": 5, "Intelligence": 5, "Good": 5 };

function startQuizz() {
    /*Sarts the quizz */
    answers = [];
    customProfile = {};
    let welcomePage = document.querySelector('div');
    if (welcomePage) {
        welcomePage.remove();
    }

    nextQuestion(questions, 0);
}

function nextQuestion(questions, questionId) {
    /*Displays the next question
    Inputs:
    -questions (array)
    -questionId (number) */
    let question = document.createElement('div');
    question.id = questionId;

    let text = document.createElement('h2');
    text.appendChild(document.createTextNode(questions[questionId].Question));
    question.appendChild(text);

    document.body.appendChild(question);

    createButtons(questions, questionId);
    if (questionId > 0) {
        createPreviousArrow(question);
    }

}

function createButtons(questions, questionId) {
    /*Displays the buttons 
    Inputs:
    -questions (array)
    -questionId (number)*/
    let buttons = {};
    const question = document.getElementById(questionId)
    for (let answer in questions[questionId]) {

        if ("Reponse" == answer.slice(0, -1)) {

            buttons[answer] = document.createElement('button');
            buttons[answer].appendChild(document.createTextNode(questions[questionId][answer]));
            buttons[answer].className = "answer";
            //Takes the letter of the answer as id
            let letter = answer.slice(-1);
            buttons[answer].id = letter;

            //append the button to the html
            question.appendChild(buttons[answer]);
            buttons[answer].addEventListener("click", function () {
                buttonClicked(questions, letter, questionId)
            });
        }
    }
}

function buttonClicked(questions, letter, questionId) {
    /*Adds the answer's to the global answers array
    Inputs:
    -questions (array)
    -letter (string)
    -questionId (number) */

    let question = document.getElementById(questionId);
    if (question) {
        answers.push(questions[questionId]["Profil" + letter]);
        question.remove();
    }
    if (questionId + 1 < questions.length) {
        nextQuestion(questions, questionId + 1);
    } else {
        showResult(answers, k);
    }
}

function createPreviousArrow(question) {
    /*Creates a button to go back to the previous question
    Input: question (div) */
    let previousArrow = createArrow();
    question.appendChild(previousArrow);

    previousArrow.addEventListener("click", function () { previousQuestion(question) });
}
function previousQuestion(question) {
    /*Goes back to the previous question
    Input: question (div) */
    const idPreviousQuestion = parseInt(question.id) - 1;
    if (question) {
        answers.pop();
        question.remove();
        nextQuestion(questions, idPreviousQuestion);
    }
}

function showResultCustomProfile(characteristics, settingsImage) {
    /*Shows the result for the custom profile
    Inputs:
    - characteristics (array)
    - settingsImage (img) */
    answers = [];
    characteristics.forEach(characteristic => {
        let answer = document.getElementById(characteristic).value
        customProfile[characteristic] = parseInt(answer);
    })
    k = document.getElementById('k').value;
    if (isNaN(parseInt(k)) || parseInt(k) < 1 || parseInt(k) > 50) {
        alert("La valeur de k saisie n'est pas valide. Par conséquent k=5");
        k = 5;
    } else {
        k = parseInt(k);
    }
    document.querySelector('ul').remove();
    document.getElementById('arrow').remove();
    document.body.appendChild(settingsImage);
    console.log(customProfile);
    showResult(customProfile, k);
}

function customProfileEntries(settingsImage) {
    /*Creates the entries for the custom profile
    Input: settingsImage (img)
    Output: customProfileEntries (li) */
    const characteristics = ["Courage", "Ambition", "Intelligence", "Good"];
    let customProfileEntries = document.createElement("li");
    customProfileEntries.innerHTML = "Vorte profil : <br/>";

    characteristics.forEach(characteristic => {
        let enterProfile = document.createElement('p');
        enterProfile.id = "enterProfile";
        customProfileEntries.appendChild(enterProfile);

        enterProfile.appendChild(document.createTextNode(characteristic + " :"))

        let selectCharacteristic = document.createElement('input');
        selectCharacteristic.type = "range";
        selectCharacteristic.id = characteristic;
        selectCharacteristic.className = "rangeInput";
        selectCharacteristic.min = 0;
        selectCharacteristic.max = 10;
        selectCharacteristic.defaultValue = customProfile[characteristic];
        enterProfile.appendChild(selectCharacteristic);
    })

    let buttonResult = document.createElement('button');
    buttonResult.appendChild(document.createTextNode("Résultats"));
    buttonResult.addEventListener("click", function () { showResultCustomProfile(characteristics, settingsImage) });
    customProfileEntries.appendChild(buttonResult);

    return customProfileEntries;
}
function quitSettings(element, settingsImage, arrow) {
    /*quits the settings
    Inputs:
    -element (div)
    - settingsImage (img)
    - arrow (img)
    Output: k (number) */
    k = document.getElementById('k').value;
    if (isNaN(parseInt(k)) || parseInt(k) < 1 || parseInt(k) > 50) {
        alert("La valeur de k saisie n'est pas valide. Par conséquent k=5");
        k = 5;
    } else {
        k = parseInt(k);
    }

    arrow.remove();
    document.querySelector('ul').remove();

    switch (element.id) {
        case "customProfileResult":
            showResult(customProfile, k);
            break;
        case "result":
            showResult(answers, k);
            break;
        case "neighbors":
            if (answers.length === 0) {
                showResult(customProfile, k);
            } else {
                showResult(answers, k);
            }
            break;
        case "aiResult":
            showAiResult(answers);
            break;
        default:
            document.body.appendChild(element);
    }
    document.body.appendChild(settingsImage);

    return k;
}

function settings(settingsImage) {
    /*Displays the settings*
    Input: settingsImage (img) */
    let settings = document.createElement("ul");
    document.body.appendChild(settings)

    //Select k value
    let kSelector = document.createElement('li');
    settings.appendChild(kSelector);

    let selectKText = document.createTextNode('Sélectionner une valeur de k :')
    kSelector.appendChild(selectKText);

    let selectKInput = document.createElement('input');
    selectKInput.type = "number";
    selectKInput.id = "k";
    selectKInput.min = 1;
    selectKInput.max = 50;
    selectKInput.defaultValue = k;
    kSelector.appendChild(selectKInput);

    //Enter custom profile
    settings.appendChild(customProfileEntries(settingsImage));

    //Get infos
    let infosLink = document.createElement('li');
    infosLink.innerHTML = "Télécharger l'<a href='./Choixpeau_DELAGORCE-ARFAOUI_FLEURANCE_LEROCH.pdf' target='_blank'>infographie<a>";
    settings.appendChild(infosLink);
}

function openSettings() {
    /*Opens the settings */
    let settingsImage = document.getElementById("settingsImage");
    settingsImage.remove();
    let div = document.querySelector("div");
    if (div) { div.remove(); }

    settings(settingsImage);

    let arrow = createArrow();
    document.body.appendChild(arrow);
    arrow.addEventListener("click", function () { quitSettings(div, settingsImage, arrow) });
}

function addEventStartQuizz(element) {
    /*adds an event listener to the element
    Input: element */
    element.addEventListener("click", startQuizz);
}

document.getElementById("startButton").addEventListener("click", startQuizz);
document.getElementById("settingsImage").addEventListener("click", openSettings);

export { addEventStartQuizz };