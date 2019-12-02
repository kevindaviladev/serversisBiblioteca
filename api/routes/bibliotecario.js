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

router.post('/login/', (req, res, next) => {
    
    var results;
    var rpta;
  
    const usuario = req.body.usuario;
    const clave = req.body.clave;
  
  //  console.log(usuario+' '+clave);
  
    connection.query("select * from bibliotecario where dni='"+usuario+"' and clave=md5('"+clave+"')", function (err, rows, fields) {
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