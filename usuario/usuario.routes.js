module.exports = (app) => {
    const usuarios = require('./usuario.controller.js');

    app.post('/usuarios', usuarios.create);

    app.get('/usuarios', usuarios.findAll);

    app.get('/usuarios/:usuarioId', usuarios.findByRol);

    app.get('/usuarios/:usuarioId', usuarios.findOne);

    app.post('/usuarios/validar/', usuarios.findUser);

    app.put('/usuarios/:usuarioId', usuarios.update);

    app.delete('/usuarios/:usuarioId', usuarios.delete);
}
