const express = require('express');
const bp = require('body-parser');
const newroommate = require('./function.js');
const app = express();
const axios = require('axios');
app.use(express.static('static'));
const fs = require('fs').promises;
const uuid = require('uuid');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));


app.post('/roommate', async(req, res) => {

    const roommate = await newroommate();
    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);
    db.roommates.push(roommate);

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

    res.send({ todo: "OK" });
})









/* app.post('/roommate', async(req, res) => {

    const datos = await axios.get("https://randomuser.me/api");
    const randomUser = datos.data.results[0];
    const id = uuid.v4();
    const nombreUsuario = randomUser.name.first + " " + randomUser.name.last;
    const nuevoUsuario = {
        nombre: nombreUsuario,
        id: id,
        debe: 0,
        recibe: 0
    }

    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

    bd.roommates.push(nuevoUsuario);

    await fs.writeFile('db.json', JSON.stringify(bd), 'utf-8');

    res.send({ todo: 'ok' });
}) */

app.get('/roommates', async(req, res) => {

    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

    console.log(bd.roommates)

    for (romme of bd.roommates) {
        // filtrar los gastos DE ESE romme, y sumar sus valores
        for (gasto of bd.gastos) {
            if (gasto.roommate == romme.nombre) {

                if (gasto.monto > 0) {
                    console.log(gasto.monto);
                    romme.recibe = romme.recibe + gasto.monto;

                } else {
                    console.log(gasto.monto);
                    romme.debe += gasto.monto;

                }
            }

        }
    }

    console.log(romme.gastos);

    res.send({ roommates: bd.roommates });
});

app.get('/gastos', async(req, res) => {

    let bd = await fs.readFile("db.json", 'utf-8');

    bd = JSON.parse(bd);

    //console.log(bd.gastos);

    res.send({ gastos: bd.gastos });
});

app.post('/gasto', async(req, res) => {
    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });
    req.on('end', async() => {

        console.log(body);
        body.id = uuid.v4();
        let bd = await fs.readFile("db.json", 'utf-8');
        bd = JSON.parse(bd);

        bd.gastos.push(body);

        await fs.writeFile('db.json', JSON.stringify(bd), 'utf-8');

        res.send({ todo: 'OK' });
    });
});

app.delete('/gasto', async(req, res) => {

    const id = req.query.id;
    console.log(id);

    let db = await fs.readFile("db.json", 'utf-8');
    db = JSON.parse(db);

    const arraygastos = db.gastos.filter(x => x.id !== id);
    db.gastos = arraygastos

    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

    res.send(db);

});

app.put('/gasto', async(req, res) => {

    let body;
    req.on('data', (payload) => {
        body = JSON.parse(payload);
    });

    req.on('end', async() => {

        const datosgasto = {
            id: req.query.id,
            roommate: body.roommate,
            descripcion: body.descripcion,
            monto: body.monto
        }

        let db = await fs.readFile("db.json", 'utf-8');
        db = JSON.parse(db);
        const gasto = db.gastos.find(g => g.id == datosgasto.id);

        gasto.roommate = datosgasto.roommate;
        gasto.descripcion = datosgasto.descripcion;
        gasto.monto = datosgasto.monto;

        await fs.writeFile('db.json', JSON.stringify(db), 'utf-8');

        res.send(db);

    });
});






































app.get('/nuevoUsuario', async(req, res) => {
    const nuevoUsuario = {
        name: req.query.name,
        lastname: req.query.lastname,
        email: req.query.email,
        password: req.query.password
    }

    fs.writeFile('usuario.json', JSON.stringify(nuevoUsuario), 'utf-8', function() {
        res.send("Usuario creado satisfactoriamente");
    });

});

app.post('/formusuario', async(req, res) => {
    const datosusuario = {
        name: req.body.nombreUsuario,
        lastname: req.body.apellido,
        email: req.body.email,
        password: req.body.password
    }

    await fs.writeFile('db.json', JSON.stringify(datosusuario), 'UTF-8', function() {
        console.log('archivo creado');
    });

    console.log(datosusuario);

    res.send("Dato Enviado");

    res.send({ todo: 'ok' });
});

/*const dato = req.body;

console.log(dato);
res.send('Usuario desde Formulario');*/


/*/addUsuario -> Añade a la lista de usuarios (name, lastname, email, password)
/addUsuarioAzar -> Añade usuario al azar tomado desde: (https://randomuser.me/api/)
/listUsuarios -> Lista todos los usuarios en el archivo db.json*/

app.get('/addusuarioRandom', async(req, res) => {

    let usuarioRandom = await axios.get("https://randomuser.me/api/");
    usuarioRandom = usuarioRandom.data.results;

    const usuariosAzar = usuarioRandom[Math.floor(Math.random() * usuarioRandom.length)];
    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

    bd.usuarios.push({
        nombre: usuariosAzar.name.first,
        apellido: usuariosAzar.name.last,
        email: usuariosAzar.email,
        password: usuariosAzar.login.password
    });

    await fs.writeFile('db.json', JSON.stringify(bd), 'utf-8');

    console.log(bd);

    res.send('Usuario Random');
});

app.get('/addusuario', async(req, res) => {
    const usuario = {
        name: req.query.name,
        lastname: req.query.lastname,
        email: req.query.email,
        password: req.query.password
    }

    /* fs.writeFile('usuario.json', JSON.stringify(usuario), 'utf-8', function() {
         res.send("Usuario agregado satisfactoriamente en el JSON");
     });*/

    let bd = await fs.readFile("db.json", 'utf-8');
    bd = JSON.parse(bd);

    bd.usuarios.push(usuario);

    await fs.writeFile('db.json', JSON.stringify(bd), 'utf-8');

    res.send('Usuario Creado');

});

app.listen(3000, function() {
    console.log("Servidor andando en el puerto numero 3000");
});