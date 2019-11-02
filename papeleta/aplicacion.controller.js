//var db = require('./../db.js');
const fs = require('fs');
const { Parser } = require('json2csv');
var json2xls = require('json2xls');
var date = new Date().getTime();
const csvjson = require('csvjson');
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;

var dba = require('./../dbSofia.js');
var dbs = require('./../dbSofia.js');
let tipoCosecha = "A";
const expressip = require('express-ip');

function exportAsExcelFile(json, excelFileName){
  const worksheet = XLSX.utils.json_to_sheet(json);
  const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAsExcelFile(excelBuffer, excelFileName);
}
function saveAsExcelFile(buffer, fileName) {
   const data = new Blob([buffer], {type: EXCEL_TYPE});
   FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
}

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
  return Year+"-"+Mes+"-"+(Dias+1);
}

exports.getPapeleta = function ( req,result ) {
  let sql = "select * from clientes_predios_apis where key_usuario = '"+(req.params.key|| req.body.key)+"'";
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
            sqlTrazabilidad += " values ('"+req.connection.remoteAddress+"','ll','Talca','ML','Chile','AplicacionPorCuartel','"+JSON.stringify(req.body)+"','"+req.params.key+"')";
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
              let idPredio = req.body.idPredio || 2;
              let idFaena = req.body.idFaena || false;
              let numOrden = req.body.numOrden || false;
              let codCuartel = req.body.codCuartel || false;
              let codProducto = req.body.codProducto || false;
              let fechaInicioDesde = req.body.fechaInicioDesde || false;
              let fechaInicioHasta = req.body.fechaInicioHasta || false;
              let exportar = req.body.exportar || false;

              sql += " ptapd.id_predio = "+idPredio;

              if(codProducto == parseInt(codProducto) && codProducto > 0){
                sql += " AND bp.codigo_producto = "+codProducto;
              }else{
                if(idInterno){
                  result.json({"Error":"#25 El valor de codProducto no cumple los requisitos"});
                  return false;
                }
              }

              if(idInterno == parseInt(idInterno) && idInterno > 0){
                sql += " AND ptapd.id_interno = "+idInterno;
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
                  if(fechaInicio <= fechaHasta){
                      let fechaInicioFormated = formatedDate(fechaInicio);
                      let fechaHastaFormated = formatedDate(fechaHasta)
                      sql += " AND fecha_operacion between '"+fechaInicioFormated+"T00:00' and '"+fechaHastaFormated+"T23:59' ";
                  }else{
                    result.json({"Error":"#725 El valor de las fechas no cumplen los requisitos"});
                    return false;
                  }
               }
               if(flag==1){
                result.json({"Error":"#907 Solo se envió el dato de una fecha, se piden ambos"});
                return false;
               }

               if(codCuartel == parseInt(codCuartel) && codCuartel > 0 ){

                 sql += " AND id_cuartel = "+codCuartel;
               }else{
                 if(codCuartel){
                   result.json({"Error":"#96 El valor de codCuartel no cumple los requisitos"});
                   return false;
                 }
               }
               sql += " ORDER BY "
               sql += "ptapd.id_interno";

               setInterval(function(){
                 connection.query("SELECT 1");
               },5000);
               console.log(sql);
               connection.query(sql, function (err, res) {
                 if(err) {
                     result.json({"Error": "#862 No se pudo obtener el resultado"});
                     return false;
                 }


                 if(exportar == 'excel'){
                   var xls = json2xls(res);
                   fs.writeFileSync('archivos/data.xlsx', xls, 'binary');
                   //	result.send("generado");
                   result.download('./archivos/data.xlsx');
                   return true;
                 }
                 if(exportar == 'csv'){
                   var obj = res;
                   var keys = "";
                   for(key in obj){
                     keys += key+",";
                   }
                   const json2csvParser = new Parser({ keys });
                   const csv = json2csvParser.parse(res);
                   result.send(csv)
                   return true;
                 }
                 if(exportar = 'json' || !exportar){
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

  let sql = "";
  sql += "SELECT";
  sql += " ptapd.id_interno,"
  sql += " ptapd.id_predio,"
  sql += " ptapd.fecha_operacion,"
  sql += " ptapd.id_producto_bodega,"
  sql += " bp.codigo_producto,"
  sql += " bp.nombre_producto,"
  sql += " tum.descripcion,"
  sql += " ptapd.numero_lote,"
  sql += " ptapd.cantidad,"
  sql += " ptapd.id_cuartel,"
  sql += " ptapd.fecha_salida,"
  sql += " ptapd.hectareas,"
  sql += " ptapd.dosis,"
  sql += " tmp.descripcion,"
  sql += " ptap.numero_documento,"
  sql += " ptap.nombre_emisor,"
  sql += " ptap.nombre_autoriza,"
  sql += " ptap.nombre_bodega,"
  sql += " ptap.nombre_receptor,"
  sql += " ptap.num_salidas,"
  sql += " ptap.usuario,"
  sql += " ptap.observacion"
  sql += " FROM"
  sql += " predio_trabajos_agricolas_papeleta_detalle ptapd"
  sql += " LEFT OUTER JOIN predio_trabajos_agricolas_papeleta ptap ON ptapd.id_pta_papeleta = ptap.id_interno"
  sql += " LEFT OUTER JOIN bodega_productos bp ON ptapd.id_producto_bodega = bp.id_producto"
  sql += " LEFT OUTER JOIN tipo_motivos_papeleta tmp ON ptap.id_tipo_motivo = tmp.id_interno"
  sql += " LEFT OUTER JOIN tipo_unidades_medida tum ON bp.unidad_medida = tum.id_interno"
  sql += " WHERE "


  return sql;
}
