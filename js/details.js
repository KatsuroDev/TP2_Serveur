const MONSTER_URL = 'https://api.andromia.science/monsters/atlas/';

const urlParams = {};
(window.onpopstate = function () {
    let match;
    const pl = /\+/g; // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g;
    const decode = function (s) {
        return decodeURIComponent(s.replace(pl, ' '));
    };
    const query = window.location.search.substring(1);

    while ((match = search.exec(query))) urlParams[decode(match[1])] = decode(match[2]);
})();

$(document).ready(() => {
    getMonster(urlParams.atlasnumber);

    $('#btnLocation').click(() => {
        addLocation();
    });

    $('#btnGenerate').click(() => {
        addSpecimen();
    });
});


async function getMonster(id) {
    const response = await axios.get(MONSTER_URL + id);
    if (response.status === 200)
    {
        const monster = response.data;
        displayMonster(monster);
    }
}

function displayMonster(monster) {
    $("#lblAtlasnumber").html(monster.atlasNumber);
    $("#imgMonster").attr("src", monster.assets);
    $("#lblName").html(monster.name);

    $("#lblMonsterHealth").html(`Health: [${monster.health.min} - ${monster.health.max}]`);
    $("#lblMonsterDamage").html(`Damage: [${monster.damage.min} - ${monster.damage.max}]`);
    $("#lblMonsterSpeed").html(`Speed: [${monster.speed.min} - ${monster.speed.max}]`);
    $("#lblMonsterCritical").html(`Critical: [${percentage(monster.critical.min)} - ${percentage(monster.critical.max)}]%`);

    console.log(monster.specimens);
    displaySpecimens(monster.specimens);
    displayLocations(monster.locations);
}

function displaySpecimens(specimens) {
    let specimensHtml = '';
    specimens.forEach(s => {
        specimensHtml += displaySpecimen(s);
    });
    $('#specimens tbody').append(specimensHtml);
}

function displaySpecimen(specimen) {
    let specimenHtml = '<tr>';
    
    specimenHtml += `<td><img src="img/affinities/${specimen.affinity}.png" alt="${specimen.affinity}" title="${specimen.affinity}"></td>`
    specimenHtml += `<td>${specimen.health}</td>`;
    specimenHtml += `<td>${specimen.damage}</td>`;
    specimenHtml += `<td>${specimen.speed}</td>`;
    specimenHtml += `<td>${percentage(specimen.critical)}</td>`;
    
    specimenHtml += `<td>`;
    specimen.talents.forEach(t => {
        specimenHtml += `<img src="img/affinities/${t}.png" alt="${t}" title="${t}">`;
    });
    specimenHtml += `</td>`;
    
    specimenHtml += `<td>`;
    specimen.kernel.forEach(e => {
        specimenHtml += `<img class="elementsImg" src="img/elements/${e}.png" alt="${e}" title="${e}">`;
    });
    specimenHtml += `</td>`;

    
    const colored_hash = get_colored_hash(specimen.hash);

    specimenHtml += `<td>${colored_hash.start_hash}`;
    colored_hash.hexcolor_hash.forEach(c => {
        specimenHtml += `<span class="block" style="color:#${c}; background-color:#${c}">${c}</span>`;
    });
    specimenHtml += `${colored_hash.end_hash}</td>`;


    specimenHtml += '</tr>';
    return specimenHtml;
}

function displayLocations(locations) {
    
    let locationsHtml = '';
    locations.forEach(l => {
        locationsHtml += displayLocation(l);
    });
    $('#locations tbody').append(locationsHtml);
}

function displayLocation(location) {
    let locationHtml = '<tr>';

    locationHtml += `<td>${location.position}</td>`;
    locationHtml += `<td>${location.time}</td>`;
    locationHtml += `<td><img src="img/seasons/${location.season}.png" alt="${location.season}" title="${location.season}"></td>`;
    locationHtml += `<td><img src="img/rarities/${location.rates}.png" alt="${location.rates}" title="${location.rates}"></td>`;

    locationHtml += '</tr>';
    return locationHtml;
}

async function addSpecimen() {
    const GENERATE_SPECIMEN_URL = `https://api.andromia.science/monsters/${urlParams.atlasnumber}/actions?type=generate`;

    const response = await axios.post(GENERATE_SPECIMEN_URL);
    if (response.status === 201)
    {
        const newSpecimen = response.data;
        const specimenHtml = displaySpecimen(newSpecimen);
        $('#specimens tbody').append(specimenHtml);
    } else {
        console.log(response);
    }
}

async function addLocation() {

    const isLocationValid = document.getElementById('txtPosition').checkValidity();
    if(isLocationValid)
    {
        const position = $('#txtPosition').val();
        const time = $('#cboTime').val();
        const season = $('#cboSeasons').val();
        const rates = $('#cboRates').val();

        const CREATE_LOCATION_URL = `https://api.andromia.science/monsters/atlas/${urlParams.atlasnumber}/locations`

        const body = {
            position: position,
            time: time,
            season: season,
            rates: rates
        }

        const response = await axios.post(CREATE_LOCATION_URL, body);
        if(response.status === 201) {
            const newLocation = response.data;
            const locationHtml = displayLocation(newLocation);
            $('#locations tbody').append(locationHtml);
        } else {
            console.log(response);
        }
    }
    
}

function percentage(number) {
    const result = number*100;
    return result.toFixed(2);
}

function get_colored_hash(hash) {
    const colored_hash = {};
    colored_hash.start_hash = hash.substring(0,2);
    colored_hash.end_hash = hash.substr(-2);
    colored_hash.hexcolor_hash = [];
    for(let i = 0; i< 10; i++)
    {
        colored_hash.hexcolor_hash.push(hash.substr(2+i*6, 6));
    }
    return colored_hash;
}