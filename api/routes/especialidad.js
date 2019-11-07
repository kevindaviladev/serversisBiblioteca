const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
const serverBD = require('../connection/connect');

const pool = new Pool({
    user: serverBD.username,
    host: serverBD.ip,
    database: serverBD.database,
    password: serverBD.password,
    port: serverBD.port
})
//POST PARA LISTAR CON FILTRO

//GET PARA LISTAR
router.get('/', (req, res, next) => {
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select id,nombre,costo_consulta as costo, estado from especialidad")
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results,
                },
            });
        })
        .catch(e => {
            client.release()
            // console.log(err.stack)
            console.log(e.stack)
        })
    })
});

//GET PARA LISTAR POR FILTRO
router.get('/filtro/:filtro', (req, res, next) => {

    const filtro = req.params.filtro;    

    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_especialidad('"+filtro+"') as (id int, nombre varchar(100), costo numeric(10,2),estado boolean)")
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results,
                },
            });
        })
        .catch(e => {
            client.release()
            console.log(err.stack)
        })
    })
});

//POST REGISTRAR
router.post('/', (req, res, next) => {
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("select * from ins_especialidad('"+req.body.nombre+"','"+req.body.costo+"' )")        
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results,
                },
            });
        })
        .catch(e => {
            client.release()
            // console.log(err.stack)
            console.log(e.stack)
        })
    })
});

//GET (DETALLE)
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("select * from sel_especialidad_detalle('"+id+"') as (id int, nombre varchar(100), costo numeric(10,2),estado boolean)")
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results[0],
                },
            });
        })
        .catch(e => {
            client.release()
            // console.log(err.stack)
            console.log(e.stack)
        })
    })
    
});

//PUT
router.put('/:id', (req, res, next) => {
    const id = req.params.id;

    //VARIABLES DE ALMACENAMIENTO
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        // return client.query("select * from upd_paciente('"+id+"', '"+req.body.dni+"', '"+req.body.nombres+"', '"+req.body.apellido_paterno+"', '"+req.body.apellido_materno+"', '"+req.body.fecha_nacimiento+"', '"+req.body.sexo+"', '"+req.body.domicilio+"', '"+req.body.estado_civil+"', '"+req.body.profesion+"', '"+req.body.tipo_sangre+"', '"+req.body.correo+"', '"+req.body.celular+"', true, 1)")
        return client.query("select * from upd_especialidad('"+id+"','"+req.body.nombre+"','"+req.body.costo+"','"+req.body.estado+"')")        
        .then(result => {
            client.release()
            results = result.rows;
            return res.status(201).json({
                recordSet: {
                    element: results[0],
                },
            });
        })
        .catch(e => {
            client.release()
            // console.log(err.stack)
            console.log(e.stack)
        })
    })
});

module.exports = router;