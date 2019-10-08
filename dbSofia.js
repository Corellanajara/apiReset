'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : '100.200.100.51',
    user     : 'ganader01809',
    password : 'fullg4n4d0encolombia',
    database : 'control_sofia'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a base de datos Mysql");
});

module.exports = connection;
