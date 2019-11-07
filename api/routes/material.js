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
router.post('/busquedaSimple/', (req, res, next) => {
    
    var results = [];
    var filtro = req.body.filtro;

    console.log(filtro);

    connection.query("select m.portada, m.titulo,m.autor,DATE_FORMAT(m.year,'%Y-%m-%d') as year,m.idioma, t.nombre as tema, mtipo.nombre as tipo from material_tema mt inner join tema t on t.idtema=mt.idtema inner join material m on m.idmaterial = mt.idmaterial  inner join material_tipo mtipo on mtipo.idmaterial_tipo = m.idmaterial_tipo  where  m.titulo like '%"+filtro+"%';", function (err, rows, fields) {
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

//POST PARA BUSQUEDA AVANZADA
router.post('/busquedaAvanzada/', (req, res, next) => {
    
  var results = [];
  var filtro = req.body.filtro;
  var year = req.body.year;
  var edicion = req.body.edicion;
  var autor = req.body.autor;
  var tipo = req.body.tipo;
  var idioma = req.body.idioma;

  console.log(filtro);

  connection.query("select m.portada, m.titulo,m.autor,DATE_FORMAT(m.year,'%Y-%m-%d') as year,m.idioma, t.nombre as tema, mtipo.nombre as tipo from material_tema mt inner join tema t on t.idtema=mt.idtema inner join material m on m.idmaterial = mt.idmaterial inner join material_tipo mtipo on mtipo.idmaterial_tipo = m.idmaterial_tipo where  m.titulo like '%"+filtro+"%' or YEAR(m.year)='"+year+"' or m.edicicion='"+edicion+"' or m.autor='"+autor+"' or mtipo.nombre='"+tipo+"' or m.idioma='"+idioma+"';", function (err, rows, fields) {
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

//LISTAR TODOS
router.get('/buscar', (req, res, next) => {
    
  var results;
  const filtr = req.params.filtro;

  connection.query("select * from material", function (err, rows, fields) {
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