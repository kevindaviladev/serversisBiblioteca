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

router.get('/listarMulta/:idAlumno', (req, res, next) => {
    
    var results;
    const idAlumno = req.params.idAlumno;
  
    connection.query("select ma.titulo as material, e.idEjemplar, m.fecha, m.penalizacion from multa m inner join prestamo p on m.idPrestamo=p.idPrestamo inner join ejemplar e on p.idEjemplar=e.idEjemplar inner join material ma on e.idMaterial=ma.idMaterial where p.idAlumno='"+idAlumno+"';", function (err, rows, fields) {
      if (err){
        console.error('Error:- ' + err.stack);
        return;
      }
      result = rows;
      return res.status(201).json({
          recordSet: {
              element: result,
          },
      });
    });
  
  });

module.exports = router;