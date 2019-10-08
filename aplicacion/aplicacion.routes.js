module.exports = (app) => {
    const Aplicaciones = require('./aplicacion.controller.js');

    app.post('/aplicaciones/cuartel/:key', Aplicaciones.getAplicaPorCuartelGlobal);
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
