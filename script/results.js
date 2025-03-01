import { knn, searchHouse } from './knn.js';
import { validInteger, mergingTables } from './import_table.js';

const charactersTab = await mergingTables();

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

    for (let x of sumAnswers) {
        let normalizedValue = 4;
        // Every value < 0 will be < 4
        if (x < 0) {
            normalizedValue = ((xMin - x) / xMin) * 5 - 1;
            if (normalizedValue < 1) {
                normalizedValue = 1;
            }
        } // Every value > 0 will be > 4
        else if (x > 0) {
            normalizedValue = (x / xMax) * 5 + 4;
        }
        normalizedAnswers.push(normalizedValue);
    }
    return normalizedAnswers;
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
            characteristic + " : " + Math.round(profile[characteristic])));
        paragraph.appendChild(p);
    }
    return paragraph;
}

function createButtonRestart() {
    /*Creates a button to restart
    output: buttonRestart (button) */
    let buttonRestart = document.createElement('button');
    buttonRestart.id = "bigButton";
    buttonRestart.appendChild(document.createTextNode("RECOMMENCER"));

    return buttonRestart;
}

function showResult(answers, k) {
    /*Shows the results for the profile 
    Inputs:
    - answers (array)
    - k (number)
    Output: buttonRestart (button) */
    const profile = createProfile(answers);
    console.log("k = ", k);
    const nearestNeighbors = knn(profile, charactersTab, k);
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

    let buttonRestart = createButtonRestart();
    result.appendChild(buttonRestart);

    return buttonRestart;
}

export { showResult };