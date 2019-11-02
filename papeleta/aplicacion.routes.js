module.exports = (app) => {
    const Aplicaciones = require('./aplicacion.controller.js');

    app.post('/papeleta/:key', Aplicaciones.getPapeleta);
  	app.get('/papeleta/',function(req,res) {
  	  res.sendFile( __dirname + '/index.html');
  	});
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
