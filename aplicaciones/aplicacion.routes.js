module.exports = (app) => {
    const Aplicaciones = require('./aplicacion.controller.js');

    app.post('/aplicaciones/cuartel/:key', Aplicaciones.getAplicaPorCuartelGlobal);
	app.post('/aplicaciones/cuartel/', Aplicaciones.getAplicaPorCuartelGlobal);
	app.get('/aplicaciones/cuartel/',function(req,res) {
	  res.sendFile( __dirname + '/index.html');
	});
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
