const express = require('express');
const app = express();

app.use(express.static('archivos'));

app.get('/', (req, res) => {
    res.send('Servidor de archivos! PYA ');
});

app.listen(3600, () => console.log('escuchando puerto 3600!'));
