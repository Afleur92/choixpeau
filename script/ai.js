import {mergingTables} from './import_table.js';

let mutable_model = {'Gryffindor': [['G>8', 'A<7'], ['G>4', 'C>2']], 'Slytherin': [['A>5', 'G<7']], 'Ravenclaw': [['I>5', 'C<8', 'G>6'], ['I>7', 'A<6'], ['G>1']], 'Hufflepuff': [['C>5', 'C<6']]};
let translator = {"G" : "Good",
              "A" : "Ambition",
              "I" : "Intelligence",
              "C" : "Courage"};
let variations = {"remove_nod" : 0, "add_nod" : 10,
            "add_condition" : 10, "remove_condition" : 0, "replace_condition" : 0,
            "change_condition" : 5};

let data = await mergingTables();

function randint(min, max) {
    /* generate a random integer number
    
    Input : 
        -the minimal number allowed (include) 
        -the maximal number (exclude)
    
    Output : the genrated number */
    return Math.floor(Math.random() * (max - min) + min);
}

function choice(arr) {
    /* choose a random index of an array

    Input : the array where the number will be choosen
    
    Output : the choosen number*/
    return arr[randint(0, arr.length)];
}

async function fusion_sort(arr) {
    /* sort an array
    
    Input : the unsorted array
    
    Output : the sorted */
    if(arr.length > 1)
    {
        let left = arr.slice(0, arr.length / 2);
        let right = arr.slice(arr.length / 2);

        left = await fusion_sort(left);
        right = await fusion_sort(right);

        return fusion(left, right, arr);
    }
    else {return arr}
}

async function fusion(left, right, arr) {
    /* fuse to sorted array in a new sorted array
    
    Input :
        -the first sorted array
        -the second sorted array
        - an array that length is the same as the to other array's length cummulated */
    let k = 0, i = 0, j = 0;
    while(i < left.length && j < right.length)
    {
        if(left[i][0] > right[j][0])
        {
            arr[k] = left[i];
            i++;
        }
        else
        {
            arr[k] = right[j];
            j++ ;
        }
        k++;
    }
    if(i < left.length)
    {
        while(i < left.length)
        {
            arr[k] == left[i];
            i++;
            k++;
        }
    }
    else
    {
        while(j < right.length)
        {
            arr[k] == right[j];
            j++;
            k++;
        }
    }
    return arr
}

async function train_it(model, data, translator, variations) {
    /* train a model bye creating vriation of itself and compare there efficiency
    
    Input :
        - the model to train
        - the data that will be used to train it
        - a translator that will be used to compress the model and his size
        - the variation that the model will done
    
    Output : a better version of the model if it's find else it's the same model*/
    let models = [model];
    for(let variation in variations)
    {
        if(variation == "remove_nod") 
        {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(remove_nod(model));
            }
        }
        if(variation == "add_nod") {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(add_nod(model));
            }
        }
        if(variation == "add_condition")
        {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(add_condition(model));
            }
        }
        if(variation == "change_condition")
        {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(change_condition(model));
            }
        }
        if(variation == "remove_condition")
        {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(change_condition(model));
            }
        }
        if(variation == "replace_condition")
        {
            for(let _ = 0; _ < variations[variation]; _ ++) 
            {
                models.push(replace_condition(model));
            }
        }
    }
    let result_accuracy = [];
    let i = 0;
    let acuracy = 0;
    for(let new_m of models)
    {
        acuracy = test_model(data, new_m, translator);
        result_accuracy.push([acuracy, new_m]);
        i++;
    }
    result_accuracy = await fusion_sort(result_accuracy);
    return result_accuracy[0];
}

function remove_nod(model) {
    /* creat a variation of the model without one nod
    
    Input : the model
    Output : the variant */
    let choosen_house = choice(Object.keys(model));
    let choosen_nod = randint(0, model[house].length);
    let new_m = {};
    for(let house in model)
    {
        new_m[house] = [];
        for(let i = 0; i < model[house].length; i ++)
        {
            if(choosen_house != house || choosen_nod != i)
                new_m[house].push(model[house][i].copy());
        }
    }
    return new_m
}

function add_nod(model) {
    /* creat a variation of the model with one more one nod
    
    Input : the model
    Output : the variant */
    let house = choice(Object.keys(model));
    let atribute = "CAIG"[randint(0, 4)];
    let sign = "><"[randint(0, 2)];
    let number = String(randint(1, 10))
    let new_m = {};
    for(let house in model)
    {
        new_m[house] = [];
        for(let i = 0; i < model[house].length; i ++)
        {
            new_m[house].push([])
            for(let condition of model[house][i])
            {
                new_m[house][i].push(condition);
            }
        }
    }
    new_m[house].push([atribute + sign + number]);
    return new_m;
}

function add_condition(model) {
    /* creat a variation of the model with one more condition in a nod
    
    Input : the model
    Output : the variant */
    let new_m = {};
    for(let house in model)
    {
        new_m[house] = [];
        for(let i = 0; i < model[house].length; i ++)
        {
            new_m[house].push([])
            for(let condition of model[house][i])
            {
                new_m[house][i].push(condition);
            }
        }
    }
    let house = choice(Object.keys(model));
    let atribute = "CAIG"[randint(0, 4)];
    let sign = "><"[randint(0, 2)];
    let number = String(randint(1, 10));
    let nod = randint(0, new_m[house].length);
    new_m[house][nod].push(atribute + sign + number);
    return new_m;
}

function remove_condition(model) {
    /* creat a variation of the model without one condition in a nod
    
    Input : the model
    Output : the variant */
    let choosen_house = choice(Object.keys(model));
    let choosen_nod = randint(0, new_model[house].length);
    let choosen_condition = randint(0, new_model[house][nod].length);

    let new_m = {};
    for(let house in model)
        {
            new_m[house] = [];
            for(let i = 0; i < model[house].length; i ++)
            {
                if(choosen_house != house || choosen_nod != i)
                    new_m[house].push(model[house][i].copy());
                else 
                {
                    new_m[house].push([]);
                for(let j = 0; j < model[house][i].length; j ++) 
                    if(choosen_condition != j)
                        new_m[house][i].push(model[house][i][j].copy());
                }
            }
        }
    return new_model;
}

function replace_condition(model) {
    /* creat a variation of the model withe one condition totaly change
    
    Input : the model
    Output : the variant */
    let choosen_house = choice(Object.keys(model));
    let atribute = "CAIG"[randint(0, 4)];
    let sign = "><"[randint(0, 2)];
    let number = String(randint(1, 10));
    let choosen_nod = randint(0, model[house].length);
    let choosen_condition = randint(0, new_model[house][nod].length);

    let new_m = {};
    for(let house in model)
        {
            new_m[house] = [];
            for(let i = 0; i < model[house].length; i ++)
            {
                if(choosen_house != house || choosen_nod != i)
                    new_m[house].push(model[house][i].copy());
                else 
                {
                    new_m[house].push([]);
                for(let j = 0; j < model[house][i].length; j ++) 
                    if(choosen_condition != j)
                        new_m[house][i].push(model[house][i][j].copy());

                }
            }
        }
    
    new_model[choosen_house][choosen_nod].push(atribute + sign + number);
    return new_model;
}

function change_condition(model) {
    /* creat a variation of the model withe one condition sligthly change
    
    Input : the model
    Output :the variant */
    let new_m = {};
    for(let house in model)
    {
        new_m[house] = [];
        for(let i = 0; i < model[house].length; i ++)
        {
            new_m[house].push([])
            for(let condition of model[house][i])
            {
                new_m[house][i].push(condition);
            }
        }
    }
    let house = choice(Object.keys(model));
    let nod = randint(0, model[house].length);
    let condition = randint(0, new_m[house][nod].length);
    let number = parseInt(new_m[house][nod][condition][2]) + choice([1, -1]);
    if(number < 1)
        number = 1;
    if(number > 9)
        number = 9;
    new_m[house][nod][condition] = new_m[house][nod][condition][0] + new_m[house][nod][condition][1] + String(number);
    return new_m
}

function test_model(data, model, translator) {
    /* test a model to know his accurcy on a data
    
    Input :
        -the model to test
        -the data to test it
        - the translator of the model
    Output :
    -his acuracy*/
    let correct_answer = 0;
    for(let student of data)
    {
        let house = use_model(model, translator, student);
        if(student["House"] === house)
            correct_answer += 1;
    }
    return correct_answer / data.length;
}

function use_model(model, translator, profile) {
    /* use a model to determine a house for a profile
    
    Input :
        -the model
        -the translator
        -the profile
    Output : the choosen house */
    let what = {};
    for(let house in model)
        what[house] = 0 ;
    let result = [];
    let tot_nod = 0;
    let valid = false;
    for(let house in model)
    {
        tot_nod = 0;
        for(let nod of model[house])
            {
            valid = true;
            for(let condition of nod)
            {
                valid = eval(String(profile[translator[condition[0]]]) + condition[1] + condition[2]);
                
                if(!valid)
                    break;
            }
            tot_nod += 1;
            if(valid)
                what[house] += 1;
            }
        if(tot_nod > 0)
            result.push([house, what[house] / tot_nod]);
        else
            result.push([house, 1]);
    }

    let choosen_house = [null, 0];
    for(let house_choice of result)
        if(house_choice[1] > choosen_house[1])
            choosen_house = house_choice;
    return choosen_house[0];
}

/*
let acuracy = 0;
let training = []

for(let i = 0; i < 20; i ++)
{
    training = await train_it(mutable_model, data, translator, variations);
    acuracy = training[0]
    mutable_model = training[1]
    console.log(i + 1, model, acuracy);
}

const IMPORTANTE_PROFILE = [
    {"Courage" : 9, "Ambition" : 2, "Intelligence" : 8, "Good" : 9},
    {"Courage" : 6, "Ambition" : 7, "Intelligence" : 9, "Good" : 7},
    {"Courage" : 3, "Ambition" : 8, "Intelligence" : 6, "Good" : 3},
    {"Courage" : 2, "Ambition" : 3, "Intelligence" : 7, "Good" : 8},
    {"Courage" : 3, "Ambition" : 4, "Intelligence" : 8, "Good" : 8}];

for(let profile in IMPORTANTE_PROFILE)
    console.log(use_model(mutable_model, translator, profile));
*/

const MODEL = mutable_model

export {use_model, translator, MODEL};