module.exports = (app) => {
    const Aplicaciones = require('./cosecha.controller.js');

    app.post('/cosechas/cuartel/:key', Aplicaciones.getAplicaPorCuartelGlobal);
  	app.post('/cosechas/cuartel/', Aplicaciones.getAplicaPorCuartelGlobal);
  	app.get('/cosechas/cuartel/',function(req,res) {
  	  res.sendFile( __dirname + '/index.html');
  	});
    app.get("/cosechas",function(req,res){
      res.send("no nononono");
    });
    //app.get('/usuarios/:key',Aplicaciones.getAllUsers);
}
