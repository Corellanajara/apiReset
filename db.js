'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '789123',
    database : 'agricola_v4'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a base de datos Mysql");
});

module.exports = connection;
