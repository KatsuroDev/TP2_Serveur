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
}


function percentage(number) {
    const result = number*100;
    return result.toFixed(2);
}