//var db = require('./../db.js');
var dba = require('./../dbSofia.js');
var dbs = require('./../dbSofia.js');
let tipoCosecha = "A";
const expressip = require('express-ip');

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}

function formatedDate(fecha){
  let Year = fecha.getFullYear();
  let Mes = ""
  let Dias = fecha.getDate()
  let mes = fecha.getMonth();
  if(mes<10){
    Mes = "0"+(parseInt(mes)+1);
  }
  return Year+"-"+Mes+"-"+Dias;
}

exports.getAplicaPorCuartelGlobal = function ( req,result ) {
  let sql = "select * from clientes_predios_apis where key_usuario = '"+req.params.key+"'";
  	setInterval(function(){
		dba.query("SELECT 1");
	},5000);  
  dba.query(sql,function ( err,res){

    if(err){
      console.log(err);
      result.send(err);
    }else{
      if(res.length <= 0 ){
        result.json({"Error": "#512 Esta api no existe en los registros"});
        return false;
      }

      let nombre_usuario = res[0].nombre_usuario;
      let id_predio = res[0].id_predio;
console.log(id_predio);
      let newsql = "select * from clientes_sistema where nombre_usuario = '"+nombre_usuario+"'";
		console.log(newsql);
		setInterval(function(){
			dbs.query("SELECT 1");
		},5000);
      dbs.query(newsql,function(error,data){
        if(data<=0){
          result.json({"Error": "#219 El nombre de usuario no exite en los registros"});
          return false;
        }

        let datos = data[0];
console.log('datos conn bd',datos);
		let nombre_baul = datos.nombre_baul;
		let baul_datos = datos.baul_datos;
		let baul_clave = datos.baul_clave;
        let ip_servidor = datos.ip_servidor;
        let sqlTrazabilidad = "insert into usoAPI (ip,ll,ciudad,region,pais,funcion,request,api_key) ";

          const ipInfo = req.ipInfo;

		  let ip = req.headers['x-forwarded-for'];

          if(ipInfo.error){
            sqlTrazabilidad += " values ('"+req.connection.remoteAddress+"',{},'Talca','ML','Chile','AplicacionPorCuartel','"+JSON.stringify(req.body)+"','"+req.params.key+"')";
          }else{
            sqlTrazabilidad += " values ('"+ip+"','"+JSON.stringify(ipInfo.ll)+"','"+ipInfo.city+"','"+ipInfo.region+"','"+ipInfo.country+"','AplicacionPorCuartel','"+JSON.stringify(req.body)+"','"+req.params.key+"')";
          }
          dba.query(sqlTrazabilidad,function(err,res){
            if(err) console.log(err);

          })
          let maquinaSql  = "select  ip_servidor from maquinas_server where id_servidor = '"+ip_servidor+"' ";

		  dbs.query(maquinaSql , function(err,res){
            if(res<=0){
              result.json({"Error": "#720 La maquina no tiene servidor existente"});
              return false;
            }
            let datos = res[0];
			console.log(datos);
            let ip = datos.ip_servidor;

            if(err){
              console.log(err);
              result.json({"Error":"#972 Error inesperado al encontrar la maquina"})
            }else{
              var mysql = require('mysql');
              var connection = mysql.createConnection({
                  host     : ip,
                  user     : baul_datos,
                  password : baul_clave,
                  database : nombre_baul

              });
              connection.connect(function(err) {
                  if (err) {
                    result.json({"Error":"#987 La base de datos no pudo ser alcanzada"});
                  }
              });
              let sql = resetSql(tipoCosecha);
              let idInterno = req.body.idInterno || false;
              let idFaena = req.body.idFaena || false;
              let numOrden = req.body.numOrden || false;
              let codCuartel = req.body.codCuartel || false;
              let fechaInicioDesde = req.body.fechaInicioDesde || false;
              let fechaInicioHasta = req.body.fechaInicioHasta || false;

              if(idInterno == parseInt(idInterno) && idInterno > 0){
                sql += " AND predio_movimientos_detalle.id_interno = "+idInterno;
              }else{
                if(idInterno){
                  result.json({"Error":"#25 El valor de idInterno no cumple los requisitos"});
                  return false;
                }
              }
              if(idFaena == parseInt(idFaena) && idFena > 0){
                sql += " AND predio_trabajos_agricolas.id_interno = "+idFaena;
              }else{
                if(idFaena){
                  result.json({"Error":"#282 El valor de idFaena no cumple los requisitos"});
                  return false;
                }
              }
              if(numOrden == parseInt(numOrden) && numOrden > 0){
                sql += " AND predio_trabajos_agricolas.id_orden_interno = "+numOrden;
              }else{
                if(numOrden){
                  result.json({"Error":"#52 El valor de numOrden no cumple los requisitos"});
                  return false;
                }
              }
// filtro por id predio
			  sql += " AND predio_trabajos_agricolas.id_predio = "+id_predio;
              if(codCuartel == parseInt(codCuartel) && codCuartel > 0 ){
//                
				sql += " AND predio_trabajos_agricolas.id_cuartel = "+codCuartel;
              }else{
                if(codCuartel){
                  result.json({"Error":"#96 El valor de codCuartel no cumple los requisitos"});
                  return false;
                }
              }
              let flag = 0;

              if(fechaInicioDesde ){
                  let fechaInicio = new Date(fechaInicioDesde);
                  if(fechaInicio){
                    flag += 1;
                  }else{
                    result.json({"Error":"#072 El valor de fechaInicioDesde no cumple los requisitos"});
                    return false;
                  }
              }
              if(fechaInicioHasta ){
                  let fechaHasta = new Date(fechaInicioHasta);
                  if(fechaHasta){
                    flag += 1;
                  }else{
                    result.json({"Error":"#072 El valor de fechaInicioHasta no cumple los requisitos"});
                    return false;
                  }
              }
              if(flag == 2){
                let fechaInicio = new Date(fechaInicioDesde);
                let fechaHasta = new Date(fechaInicioHasta);
                if(fechaInicio < fechaHasta){
                    let fechaInicioFormated = formatedDate(fechaInicio);
                    let fechaHastaFormated = formatedDate(fechaHasta)
                    sql += " AND fecha_inicio between '"+fechaInicioFormated+"' and '"+fechaHastaFormated+"' ";
                }else{
                  result.json({"Error":"#725 El valor de las fechas no cumplen los requisitos"});
                  return false;
                }
              }
              if(flag==1){
                result.json({"Error":"#907 Solo se envió el dato de una fecha, se piden ambos"});
                return false;
              }

              sql += " AND (predio_movimientos_detalle.codigo_producto NOT LIKE '%rrhh%' ";
              sql += " OR  predio_movimientos_detalle.codigo_producto IS NULL) ";
              sql += " ORDER BY predio_trabajos_agricolas.fecha_inicio DESC";
				setInterval(function(){
					connection.query("SELECT 1");
				},5000);
console.log(sql);
              connection.query(sql, function (err, res) {
                if(err) {
                    result.json({"Error": "#862 No se pudo obtener el resultado"});
                    return false;
                }
                else{
                    result.send(res);
                    return true;
                }
              });

            }
          })
      });
    }
  });
}

function resetSql(tipoCosecha){
  let sql = "SELECT ";
  sql += "predio_trabajos_agricolas.id_interno,predio_trabajos_agricolas.fecha_inicio,predio_trabajos_agricolas.id_cultivo,predio_trabajos_agricolas.id_labor,predio_trabajos_agricolas.cosecha,predio_trabajos_agricolas.valor_total,predio_movimientos.id_interno,predio_movimientos.id_area_operativa,";
  sql += "predio_movimientos.valor_total,predio_movimientos.id_tabla_externa,predio_movimientos_detalle.id_producto_bodega,predio_movimientos_detalle.cantidad,predio_movimientos_detalle.dias_carencias,";
  sql += "predio_movimientos_detalle.dosis_ha,predio_movimientos_detalle.mojamiento_ha,bodega_productos.nombre_producto,bodega_productos.ing_activo,predio_trabajos_agricolas.fecha_inicio_aplica,";
  sql += "predio_trabajos_agricolas.fecha_termino_aplica,predio_trabajos_agricolas.jefe_aplicador_dos,predio_trabajos_agricolas.jefe_dosificador,predio_trabajos_agricolas.id_clima_condicion,predio_trabajos_agricolas.temperatura,";
  sql += "predio_trabajos_agricolas.id_clima_condicion_viento,predio_movimientos_detalle.tipo_tratamiento,predio_movimientos_detalle.valor_total,predio_trabajos_agricolas.id_potrero_clasificacion,predio_trabajos_agricolas.hora_inicio_aplica,";
  sql += "predio_trabajos_agricolas.hora_termino_aplica,predio_movimientos_detalle.horas_reingreso,predio_trabajos_agricolas.observaciones,bodega_productos.codigo_producto,predio_trabajos_agricolas.id_orden_interno,predio_trabajos_agricolas.id_cuartel AS cod_cuartel,";
  sql += "predio_trabajos_agricolas.por_hacer,predio_trabajos_agricolas.id_predio,bodega_productos.unidad_medida,predio_trabajos_agricolas.jefe_huerto,predio_trabajos_agricolas.jefe_aplicador_tres,";
  sql += "predio_trabajos_agricolas.jefe_aplicador_cuatro,predio_movimientos_detalle.id_interno AS id_registro ";
  sql += "FROM predio_trabajos_agricolas ";
  sql += "LEFT OUTER JOIN predio_movimientos ON predio_trabajos_agricolas.id_interno = predio_movimientos.id_tabla_externa ";
  sql += "LEFT OUTER JOIN predio_movimientos_detalle ON predio_movimientos.id_interno = predio_movimientos_detalle.id_padre_movimiento ";
  sql += "INNER JOIN bodega_productos ON predio_movimientos_detalle.id_producto_bodega = bodega_productos.id_producto ";
  sql += "WHERE (predio_trabajos_agricolas.cosecha = '"+tipoCosecha+"')";
  return sql;
}
