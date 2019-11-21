module.exports = (app) => {
    const Aplicaciones = require('./aplicacion.controller.js');

    app.post('/aplicacion/:key', Aplicaciones.getAplicaPorCuartelGlobal);
	app.post('/aplicacion/', Aplicaciones.getAplicaPorCuartelGlobal);
	app.get('/aplicacion/',function(req,res) {
	  res.sendFile( __dirname + '/index.html');
	});
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
