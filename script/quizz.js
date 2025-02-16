import { mergingTables, importData, validInteger } from './import_table.js';
import { knn, searchHouse } from './knn.js';

const charactersTab = await mergingTables();
const questions = await importData("./data/QCM.csv", false);
let answers = [];

function startQuizz() {
    /*Sarts the quizz */
    let welcomePage = document.querySelector('#welcomePage');
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
        showResult(answers);
    }
}

function showResult(answers) {
    /*Shows the results for the profile 
    Input: profile (array) */
    const profile = createProfile(answers);
    const nearestNeighbors = knn(profile, charactersTab, 5);
    const house = searchHouse(nearestNeighbors);
    const resultText = "Bravo ! Vous appartenez à la maison : " + house;

    let result = document.createElement('div');
    result.id = "result";
    document.body.appendChild(result);

    let text = document.createElement('h1');
    text.appendChild(document.createTextNode(resultText));
    result.appendChild(text);

    let image = document.createElement('img');
    image.src = "./data/" + house + ".jpg";
    image.alt = "Blason " + house;
    image.id = "blason";
    result.appendChild(image);

    let profileText = profileToText(profile);
    result.appendChild(profileText);
}

function createProfile(answers) {
    /*Creates a profile based on the answers
    Input: answers (array)
    Output: profile (object) */
    const keys = ["Courage", "Ambition", "Intelligence", "Good"];
    let profile = {};
    let sumAnswers = [0, 0, 0, 0];
    for (let answer of answers) {
        answer = answer.trim().slice(1, -1).split(',');
        answer = answer.map(validInteger);
        sumAnswers = sumArrays(sumAnswers, answer);
    }
    const normalizedAnswers = normalization(sumAnswers);

    for (let i = 0; i < keys.length; i++) {
        profile[keys[i]] = normalizedAnswers[i];
    }
    console.log(sumAnswers, profile);
    return profile;
}

function sumArrays(arrayA, arrayB) {
    /*Sums two arrays
    Inputs:
    -arrayA (array)
    -arrayB (array)
    Output: arrayC (array) */

    let arrayC = [];
    for (let i = 0; i < Math.min(arrayA.length, arrayB.length); i++) {
        arrayC.push(arrayA[i] + arrayB[i]);
    }
    return arrayC;
}

/* la notmalisation permet d'exagérer les traits de caractère
   en mettant à 1 la caractéristique la moins importante
   et à 9 la plus importante */
function normalization(sumAnswers) {
    /*Normalizes the answers 
    to get characteristics between 1 and 9
    Input: sumAnswers (array)
    Output: normalizedAnswers (array) */
    let normalizedAnswers = [];
    const xMin = Math.min(...sumAnswers);
    const xMax = Math.max(...sumAnswers);

    if (xMin === xMax) {
        alert("profile bizzare")
        return sumAnswers;
    }

    for (let x of sumAnswers) {
        let normalizedValue = (x - xMin) / (xMax - xMin);
        if (normalizedValue < 0.1) {
            normalizedValue = 0.1;
        } else if (normalizedValue > 0.9) {
            normalizedValue = 0.9;
        }
        normalizedAnswers.push(normalizedValue * 10);
    }
    return normalizedAnswers;
}

function profileToText(profile) {
    /*Transforms the object into a paragraph
    Input: profile (object)
    Output: paragraph (h3) */
    let paragraph = document.createElement('h3');

    let p = document.createElement('p');
    p.appendChild(document.createTextNode("Votre profil :"));
    paragraph.appendChild(p);

    for (let characteristic in profile) {
        p = document.createElement('p');
        p.appendChild(document.createTextNode(
            characteristic + " : " + profile[characteristic]));
        paragraph.appendChild(p);
    }
    return paragraph;
}
document.getElementById("bigBoutton").addEventListener("click", startQuizz);

