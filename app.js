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
let alumnoRoutes = require('./api/routes/alumno');
let materialRoutes = require('./api/routes/material');
let ejemplarRoutes = require('./api/routes/ejemplar');
let reservaRoutes = require('./api/routes/reserva');
let prestamoRoutes = require('./api/routes/prestamo');
let multaRoutes = require('./api/routes/multa');
let bibliotecarioRoutes = require('./api/routes/bibliotecario');

app.use('/material',materialRoutes);
app.use('/alumno',alumnoRoutes);
app.use('/ejemplar',ejemplarRoutes);
app.use('/reserva',reservaRoutes);
app.use('/prestamo',prestamoRoutes);
app.use('/multa',multaRoutes);
app.use('/bibliotecario',bibliotecarioRoutes);
