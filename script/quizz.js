import { importData } from './import_table.js';
import { showResult } from './results.js';

const questions = await importData("./data/QCM.csv", false);
let answers = [];
let k = 5;

function startQuizz() {
    /*Sarts the quizz */
    answers = [];
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
        showResult(answers, k).addEventListener("click", startQuizz);
    }
}

function createPreviousArrow(question) {
    /*Creates a button to go back to the previous question
    Input: question (div) */
    let previousArrow = document.createElement('img');
    previousArrow.src = "./data/Arrow.JPG";
    previousArrow.alt = "Flèche précédent";
    previousArrow.id = "arrow";
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

    if (element.id === "result") {
        showResult(answers, k).addEventListener("click", startQuizz);
    } else {
        document.body.appendChild(element);
    }
    document.body.appendChild(settingsImage);

    return k;
}

function settings() {
    /*Displays the settings */
    let settings = document.createElement("ul");
    document.body.appendChild(settings)

    //Select k value
    let kSelector = document.createElement('li');
    settings.appendChild(kSelector);

    let selectKText = document.createTextNode('Sélectionner une valeur de k : ')
    kSelector.appendChild(selectKText);

    let selectKInput = document.createElement('input');
    selectKInput.type = "number";
    selectKInput.id = "k";
    selectKInput.min = 1;
    selectKInput.max = 50;
    selectKInput.defaultValue = k;
    kSelector.appendChild(selectKInput);

    //Get infos
    let infosLink = document.createElement('li');
    infosLink.innerHTML = "Télécharger l'<a href='./data/infographie.pdf' target='_blank'>infographie<a>";
    settings.appendChild(infosLink);
}

function openSettings() {
    /*Opens the settings */
    let settingsImage = document.getElementById("settingsImage");
    settingsImage.remove();
    let div = document.querySelector("div");
    if (div) { div.remove(); }

    settings();

    let arrow = document.createElement('img');
    arrow.src = "./data/Arrow.JPG";
    arrow.id = "arrow";
    arrow.alt = "Flèche retour";
    document.body.appendChild(arrow);

    arrow.addEventListener("click", function () { quitSettings(div, settingsImage, arrow) });
}
document.getElementById("bigButton").addEventListener("click", startQuizz);
document.getElementById("settingsImage").addEventListener("click", openSettings);

