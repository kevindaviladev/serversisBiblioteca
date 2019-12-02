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

//POST PARA BUSQUEDA SIMPLE
router.post('/listarEjemplaresDisponibles/', (req, res, next) => {
    
    var results = [];
    var idMaterial = req.body.idMaterial;

    connection.query("select * from ejemplar where idMaterial='"+idMaterial+"' and estado='D'", function (err, rows, fields) {
      // connection.query("select * from material where idMaterial='"+filtro+"' ", function (err, rows, fields) {
      if (err) console.log(err);
      result = rows;
      return res.status(201).json({
          recordSet: {
              element: result,
          },
      });
    });

});

router.post('/registrarReserva/', (req, res, next) => {
    
    let results = [];
    let idEjemplar = req.body.idEjemplar;
    let idAlumno = req.body.idAlumno;
    let fecha = req.body.fecha;

    connection.query("insert into reserva(idEjemplar,idAlumno,estado,fecha) values ('"+idEjemplar+"','"+idAlumno+"','D','"+fecha+"')", function (err, rows, fields) {
      // connection.query("select * from material where idMaterial='"+filtro+"' ", function (err, rows, fields) {
      if (err) console.log(err);
      result = rows;
      return res.status(201).json({
          recordSet: {
              element: result,
          },
      });
    });

    connection.query("update ejemplar set estado='R' where idEjemplar='"+idEjemplar+"'");
});

module.exports = router;