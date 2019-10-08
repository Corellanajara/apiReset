'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '789123',
    database : 'control_sofia_v2'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a base de datos Mysql");
});

module.exports = connection;
