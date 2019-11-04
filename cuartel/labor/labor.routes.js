module.exports = (app) => {
    const Aplicaciones = require('./labor.controller.js');

    app.post('/labores/cuartel/:key', Aplicaciones.getAplicaPorCuartelGlobal);
	  app.post('/labores/cuartel/', Aplicaciones.getAplicaPorCuartelGlobal);
	  app.get('/labores/cuartel/',function(req,res) {
	     res.sendFile( __dirname + '/index.html');
	  });
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
