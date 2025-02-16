function validInteger(n) {
    /*Checks if n is an integer*/
    if (isNaN(parseInt(n))) {
        return n;
    } else {
        return parseInt(n);
    }
}

async function importData(file, returnIndex=true) {
    /*
    Imports the datas from a file in a index

    Input: file, file's path
    Output: index or table
    */
    let index = {};
    let table = [];

    try {
        let data = await fetch(file);
        data = await data.text();

        const lines = data.trim().split('\n');
        const headings = lines[0].trim().split(';');
    
        for (let line of lines.slice(1)) {
            line = line.trim().split(';');
            let enregistrement = {};
            for (let i = 0; i < Math.min(headings.length, line.length); i++) {
                enregistrement[headings[i]] = validInteger(line[i]);
            }
            if (returnIndex) {
                index[enregistrement.Name] = enregistrement;
            } else {
                table.push(enregistrement);
            }
        }
        if (returnIndex) {
            return index;
        } else {
            return table;
        }
    } catch (err) {
        console.error('Erreur de lecture:', err);
        return null;
    }
}

async function mergingTables() {
    /*Merges informations of files Characters.csv and
    Caracteristiques_des_persos.csv in an index 
    
    Output : charactersTab*/
    const charactersTab = [];
    const characteristics = await importData('./data/Caracteristiques_des_persos.csv');
    const charactersHouses = await importData('./data/Characters.csv');

    for (let name in characteristics) {
        characteristics[name].House = charactersHouses[name].House;
        charactersTab.push(characteristics[name]);
    }

    return charactersTab;
}

export {mergingTables, importData, validInteger};