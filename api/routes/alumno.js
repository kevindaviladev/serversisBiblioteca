const express = require('express');
const router = express.Router();


const serverBD = require('../connection/connect');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: serverBD.ip,
  user: serverBD.username,
  password: serverBD.password,
  database: serverBD.database
})

connection.connect(function(err) {
	if (err) throw err
});

//POST PARA LISTAR
router.get('/listarUsuario/:dni', (req, res, next) => {
    
    var results;
    var rpta;

    const dni = req.params.dni;

    connection.query("select dni, correo, telefono,foto, DATE_FORMAT(fechaNac,'%Y-%m-%d') as fechaNac, nombres, apellidoPaterno, apellidoMaterno, direccion from alumno where dni='"+dni+"'", function (err, rows, fields) {
      if (err) throw err;
      result = rows;
      return res.status(201).json({
          recordSet: {
              element: result,
          },
      });
    });
});





module.exports = router;