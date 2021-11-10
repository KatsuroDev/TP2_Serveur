const SERVICE_URL = 'https://api.andromia.science/monsters/atlas';

$(document).ready(() => {
    getMonsters();
});

async function getMonsters() {
    try {
        const response = await axios.get(SERVICE_URL);
        if(response.status === 200) {
            const monsters = response.data;
            monsters.forEach(m => {
                $('#monsters').append(displayMonsters(m));
            });
        } else {
            console.log(response);
        }
    } catch(err) {
        console.log(err);
    }
}

function displayMonsters(monster) {
    let monsterHtml = '<tr>';

    monsterHtml += `<th scope="row">${monster.atlasNumber}<img class="monsterpic" src="${monster.assets}"></th>`;
    monsterHtml += `<td><a href="details.html?atlasnumber=${monster.atlasNumber}">${monster.name}</a></td>`;
    monsterHtml += `<td>[${monster.health.min} - ${monster.health.max}]</td>`;
    monsterHtml += `<td>[${monster.damage.min} - ${monster.damage.max}]</td>`;
    monsterHtml += `<td>[${monster.speed.min} - ${monster.speed.max}]</td>`;
    monsterHtml += `<td>[${percentage(monster.critical.min)} - ${percentage(monster.critical.max)}]%</td>`;

    monsterHtml += '</tr>';
    return monsterHtml;
}

function percentage(number) {
    const result = number*100;
    return result.toFixed(2);
}