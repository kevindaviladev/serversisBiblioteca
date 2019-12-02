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
router.get('/listarReservaAlumno/:idAlumno', (req, res, next) => {
    
    var results = [];
    var idAlumno = req.params.idAlumno;

    connection.query("select m.portada, t.nombre as tipo, m.titulo, e.idEjemplar, DATE_FORMAT(r.fecha,'%Y-%m-%d') as fecha, r.estado from reserva r inner join ejemplar e on r.idEjemplar=e.idEjemplar inner join material m on e.idMaterial=m.idMaterial inner join material_tipo t on m.idMaterial_tipo=t.idMaterial_tipo where r.idAlumno='"+idAlumno+"'", function (err, rows, fields) {
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

//POST PARA BUSQUEDA SIMPLE
router.post('/listarReservas/', (req, res, next) => {
    
  let results = [];
  let dni = req.body.dni;
  let nombre = req.body.nombre
  let fechaDesde = req.body.fechaDesde;
  let fechaHasta = req.body.fechaHasta;
  let filtro = req.body.titulo;
  console.log("DNI: "+dni);
  // console.log("Nombre: "+ nombre);
  // console.log("fechaD: "+fechaDesde);
  // console.log("fechaH: "+fechaHasta);
  console.log("Filtro: "+filtro);


  let consulta = "select r.idReserva, m.portada,m.titulo,e.idEjemplar,a.dni,CONCAT(a.nombres,' ',a.apellidoPaterno,' ',a.apellidoMaterno) as Alumno ,DATE_FORMAT(r.fecha,'%Y-%m-%d') as fecha,r.estado from reserva r inner join alumno a on r.idalumno=a.idAlumno inner join ejemplar e on r.idejemplar=e.idEjemplar inner join material m on e.idmaterial=m.idmaterial where a.dni like '%"+dni+"%' and m.titulo like '%"+filtro+"%' and r.fecha BETWEEN '"+fechaDesde+"' and '"+fechaHasta+"' and CONCAT(a.nombres,' ',a.apellidoPaterno,' ',a.apellidoMaterno)  like  '%"+nombre+"%' and r.estado='D'";
  console.log(consulta);
  connection.query(consulta, function (err, rows, fields) {
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

//POST PARA BUSQUEDA SIMPLE
router.post('/aceptarReserva', (req, res, next) => {
    
  let results = [];
  let idReserva = req.body.idReserva;
  let idBibliotecario = req.body.idBibliotecario;

  let consulta = "call aceptarReserva('"+idReserva+"','"+idBibliotecario+"')";
  // console.log(consulta);
  connection.query(consulta, function (err, rows, fields) {
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

module.exports = router;