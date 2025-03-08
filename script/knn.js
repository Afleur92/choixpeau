function knn(profile, tab, k) {
    /*
    Creates the table of the k nearest neighbors
    
    Inputs:
    Output
    */
    let tableDistances = [];

    for (let student of tab) {
        let distanceToProfile = 0;
        
        for (let key of ['Courage', 'Ambition', 'Intelligence', 'Good']) {
            distanceToProfile += (student[key] - profile[key]) ** 2;
        }
        distanceToProfile **= 0.5;

        tableDistances.push({Distance: distanceToProfile, 
                              House: student.House, 
                              Name : student.Name});
    }
    tableDistances.sort(function(a, b){return a.Distance - b.Distance});
    return tableDistances.slice(0, k);
}

function searchHouse(nearestNeighbors) {
    /**/
    let houses = {};
    let maxHouse = {Name: null, Value: 0};

    for (let neighbor of nearestNeighbors) {
        if (neighbor.House in houses) {
            houses[neighbor.House] += 1;
        }
        else {
            houses[neighbor.House] = 1;
        }
        if (maxHouse.Value < houses[neighbor.House]) {
            maxHouse.Value = houses[neighbor.House];
            maxHouse.Name = neighbor.House;
        }
    }
    return maxHouse.Name;
}

export {knn, searchHouse};