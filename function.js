const axios = require('axios');
const uuid = require('uuid');

async function newroommate() {

    let randomuser = await axios.get("https://randomuser.me/api/");
    randomuser = randomuser.data.results[0];

    const newuser = {
        id: uuid.v4().slice(10),
        nombre: randomuser.name.first + " " + randomuser.name.last,
        debe: 0,
        recibe: 0
    }
    return newuser;
}

module.exports = newroommate;