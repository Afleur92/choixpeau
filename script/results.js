import { knn, searchHouse } from './knn.js';
import { validInteger, mergingTables } from './import_table.js';
import { addEventStartQuizz } from './quizz.js';
import { use_model, translator, MODEL } from './ai.js'

const charactersTab = await mergingTables();

function createArrow() {
    /*Creates an arrow
    Output: arrow (img) */
    let arrow = document.createElement('img');
    arrow.src = "./data/Arrow.JPG";
    arrow.id = "arrow";
    arrow.alt = "Flèche retour";

    return arrow;
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

/* la normalisation permet d'exagérer les traits de caractère
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
    let sumAnswers = [0, -1, 0, 1];
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
    buttonRestart.className = "bigButton";
    buttonRestart.id = "restartButton";
    buttonRestart.appendChild(document.createTextNode("Recommencer"));

    return buttonRestart;
}

function quitNeighbors(neighbors, arrow, answers, k) {
    /*Quits the neighbors display
    Inputs:
    - neighbors (div)
    - arrow (img)
    - answers (object)
    - k (number) */
    neighbors.remove();
    arrow.remove();

    showResult(answers, k);
}

function tableNeighbors(nearestNeighbors, neighbors) {
    /*Creates a table displaying the nearest neighbors
    Inputs:
    - nearestNeighbors (object)
    - neighbors (div) */

    let table = document.createElement("table");
    table.innerHTML = "<thead>\
            <tr>\
                <th>Nom</th>\
                <th>Maison</th>\
                <th>Distance</th>\
            </tr>\
        </thead>\
        <tbody id='table-body'></tbody>"
    neighbors.appendChild(table);

    const tableBody = document.getElementById("table-body");

    nearestNeighbors.forEach(character => {
        let row = document.createElement("tr");
        row.className = `house-${character.House}`
        row.innerHTML = `
                <td>${character.Name}</td>
                <td>${character.House}</td>
                <td>${character.Distance.toFixed(3)}</td>`;
        tableBody.appendChild(row);
    });
}

function displayNeighbors(nearestNeighbors, answers, k) {
    /*Displays the neighbors
    Inputs:
    - nearestNeighbors (object)
    - answers (object)
    - k (number) */

    let result = document.querySelector("div");
    if (result) { result.remove() }

    let neighbors = document.createElement('div');
    neighbors.id = "neighbors";
    document.body.appendChild(neighbors);

    console.log(nearestNeighbors);
    tableNeighbors(nearestNeighbors, neighbors);

    let arrow = createArrow();
    neighbors.appendChild(arrow);
    arrow.addEventListener("click",
        function () { quitNeighbors(neighbors, arrow, answers, k) });
}

function createButtonNeighbors(nearestNeighbors, answers, k) {
    /*Creates a button to show the nearest neighbors
    Inputs:
    - nearestNeighbors (object)
    - answers (object)
    - k (number)
    Output: buttonNeighbors (button) */
    let buttonNeighbors = document.createElement('button');
    buttonNeighbors.id = "buttonNeighbors";
    buttonNeighbors.className = "bigButton";
    buttonNeighbors.appendChild(document.createTextNode("Voir mes voisins"));
    buttonNeighbors.addEventListener("click",
        function () { displayNeighbors(nearestNeighbors, answers, k) });

    return buttonNeighbors
}

function showResult(answers, k) {
    /*Shows the results for the profile 
    Inputs:
    - answers (array or object)
    - k (number)
    Output: buttonRestart (button) */
    console.log(answers);
    let result = document.createElement('div');
    document.body.appendChild(result);
    let profile = answers;

    if (answers.length) {
        profile = createProfile(profile);
        result.id = "result";
    } else { result.id = "customProfileResult"; }
    console.log("k = ", k);
    const nearestNeighbors = knn(profile, charactersTab, k);
    const house = searchHouse(nearestNeighbors);
    const resultText = "Bravo ! Vous appartenez à la maison : " + house;

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
    result.appendChild(createButtonNeighbors(nearestNeighbors, answers, k));
    addEventStartQuizz(buttonRestart);

    let button_ai = document.createElement('button');
    button_ai.className = "bigButton";
    button_ai.appendChild(document.createTextNode("utiliser l'ia"));
    button_ai.addEventListener('click', function () { showAiResult(profile) });
    result.appendChild(button_ai);
}

function showAiResult(profile) {
    /*Shows the results for the profile by using ai
    Inputs:
    - answers (array)*/
    document.querySelector('div').remove();
    
    const aiResult = use_model(MODEL, translator, profile, true);

    const house = aiResult[0];
    const resultText = "Bravo vous apartenez a la maison : " + house;

    let result = document.createElement('div');
    result.id = 'aiResult';
    document.body.appendChild(result)

    let text = document.createElement('h1');
    text.innerText = resultText;
    result.appendChild(text);

    let img = document.createElement('img');
    img.src = "./data/" + house + ".jpg";
    img.alt = "blason " + house;
    img.id = "blason";
    result.appendChild(img);

    let profileText = profileToText(profile);
    result.appendChild(profileText);

    let restartButton = createButtonRestart();
    result.appendChild(restartButton);
    addEventStartQuizz(restartButton);

    let detailButton = document.createElement('button');
    detailButton.className = "bigButton";
    detailButton.appendChild(document.createTextNode("voire pourcentage d'affiliation"));
    detailButton.addEventListener('click', function() { displayMatchingPercent(aiResult[1], profile) });
    result.appendChild(detailButton);
}

function displayMatchingPercent(result, profile) {
    let old_div = document.querySelector('div');
    old_div.remove();

    let percent = document.createElement('div');
    percent.id = "matchingPercent";
    document.body.appendChild(percent);

    percent.appendChild(tableMatchingPercent(result));
    let arrow = createArrow();
    percent.appendChild(arrow);
    arrow.addEventListener('click', function() { quitMatchingPercent(arrow, profile) })
}

function tableMatchingPercent(result) {
    let table = document.createElement('table');
    table.innerHTML = "<thead>\
                            <tr>\
                                <th>Maison</th>\
                                <th>Pourcentage d'affiliation</th>\
                            </tr>\
                        </thaed>\
                        <tbody id=table-body></tbody>";
    let tableBody = table.querySelector('tbody');
    
    for(let house of result) {
        let row = document.createElement('tr')
        row.className = "house-" + house[0]
        row.innerHTML = `<td>${house[0]}</td>
                        <td>${(house[1] * 100).toFixed(3)}%`
        tableBody.appendChild(row)
    }
    return table
}

function quitMatchingPercent(arrow, profile) {
    arrow.remove();

    showAiResult(profile);
}

export { showResult, createArrow };