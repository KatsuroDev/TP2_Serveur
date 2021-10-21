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
        console.log(response.data);
    }
}