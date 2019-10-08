const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
const expressip = require('express-ip');
//const db = require('./db.js');
const config = require('./config.js');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const cantidadPeticiones = 100;
const minutosPeticiones = 1;

const limiter = rateLimit({
  windowMs: minutosPeticiones * 60 * 1000, //  minutos
  max: cantidadPeticiones, // limite por ip para las peticiones definidas
  message: 'Superaste tus '+cantidadPeticiones+' peticiones dentro de '+minutosPeticiones+' minutos'
});

app.use(expressip().getIpInfoMiddleware); // para info de la ip
app.use(xss()); // Sanitizar la posibilidad de ataques xss
app.use(limiter); // limitar las peticiones
app.use(fileUpload()); // habilitar subida archivos
app.use(express.json({ limit: '10kb' })); // limitar tamaño peticion para evitar ddos
app.use(bodyParser.urlencoded({ extended: true })); // esto es para tomar la peticion de una forma mas amigable
app.use(bodyParser.json()); // en particular como formato json


// Activar CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Permitir peticiones de otras redes
    // preguntar si limitar a una ip en particular
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// las url de ruteo
require('./aplicacion/aplicacion.routes.js')(app);


app.get('/', (req, res) => {
    res.json({"message": "Api para Agricola Garces"});
});

app.listen(config.serverport, () => {
    console.log("Escuchando al puerto "+config.serverport);
});
