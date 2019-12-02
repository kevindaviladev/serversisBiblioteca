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
router.post('/listarPrestamoAlumno/', (req, res, next) => {
    
    let results = [];
    let idAlumno = req.body.idAlumno;
    let fechaDesde = req.body.fechaDesde;
    let fechaHasta = req.body.fechaHasta;
    let filtro = req.body.titulo;

    connection.query("select m.portada, t.nombre as tipo, m.titulo, e.idEjemplar,DATE_FORMAT(p.fechaPrestamo,'%Y-%m-%d') as fechaPrestamo ,DATE_FORMAT(p.fechaEntrega,'%Y-%m-%d') as fechaEntrega, p.estado from prestamo p inner join ejemplar e on p.idEjemplar=e.idEjemplar inner join material m on e.idMaterial=m.idMaterial inner join material_tipo t on m.idMaterial_tipo=t.idMaterial_tipo where p.idAlumno='"+idAlumno+"' and p.fechaPrestamo BETWEEN '"+fechaDesde+"' and '"+fechaHasta+"' and m.titulo like '%"+filtro+"%'", function (err, rows, fields) {
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
router.post('/listarPrestamo/', (req, res, next) => {
    
  let results = [];
  let dni = req.body.dni;
  let nombre = req.body.nombre;
  let fechaDesde = req.body.fechaDesde;
  let fechaHasta = req.body.fechaHasta;
  let filtro = req.body.titulo;

  connection.query("select p.idPrestamo, m.portada,m.titulo,e.idEjemplar,a.dni,CONCAT(a.nombres,' ',a.apellidoPaterno,' ',a.apellidoMaterno) as Alumno, DATE_FORMAT(p.fechaPrestamo,'%Y-%m-%d') as fechaPrestamo, p.estado from prestamo p inner join alumno a on p.idAlumno=a.idAlumno inner join ejemplar e on p.idEjemplar=e.idEjemplar inner join material m on e.idMaterial=m.idMaterial where a.dni like '%"+dni+"%' and m.titulo like '%"+filtro+"%' and p.fechaPrestamo BETWEEN '"+fechaDesde+"' and '"+fechaHasta+"' and CONCAT(a.nombres,' ',a.apellidoPaterno,' ',a.apellidoMaterno)  like  '%"+nombre+"%' and p.estado='D'", function (err, rows, fields) {
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
router.post('/finalizarPrestamo/', (req, res, next) => {
    
  let results = [];
  let idPrestamo = req.body.idPrestamo;
  let idBibliotecario = req.body.idBibliotecario;

  connection.query("call finalizarPrestamo('"+idPrestamo+"','"+idBibliotecario+"')", function (err, rows, fields) {
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
router.post('/agregarPrestamo/', (req, res, next) => {
    
  let results = [];
  let idEjemplar = req.body.idEjemplar;
  let dni = req.body.dni;
  let idBibliotecario = req.body.idBibliotecario;

  connection.query("call agregarPrestamo('"+dni+"','"+idEjemplar+"' ,'"+idBibliotecario+"' );", function (err, rows, fields) {
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