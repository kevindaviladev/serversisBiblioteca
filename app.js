var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(cors());
 
module.exports = app;

const router = express.Router();

//RUTAS 
const usuarioRoutes = require('./api/routes/usuario');
const anticipoRoutes = require('./api/routes/anticipo');
const motivoRoutes = require('./api/routes/motivo');
const sedeRoutes = require('./api/routes/sede')
const informeRoutes = require('./api/routes/informe');
const rubroRoutes = require('./api/routes/rubro');

var alumnoRoutes = require('./api/routes/alumno');
var materialRoutes = require('./api/routes/material');

app.use('/material',materialRoutes);
app.use('/alumno',alumnoRoutes);

