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

//GET PARA LISTAR EL DIA
router.get('/dia/:fec', (req, res, next) => {

    const fec = req.params.fec;
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_dia('"+fec+"') as (id int, hora_inicio time, hora_fin time,costo numeric(10,2),estado int,fecha text,paciente text,medico text,paciente_id char(8),turno_id int )")
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

//GET PARA LISTAR ENTRE UN RAGO
router.get('/rango/:fec_desde/:fec_hasta', (req, res, next) => {

    const fec_desde = req.params.fec_desde;
    const fec_hasta = req.params.fec_hasta;
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_entre_fechas('"+fec_desde+"','"+fec_hasta+"') as (id int, hora_inicio time, hora_fin time,costo numeric(10,2),estado int,especialidad varchar(100),fecha text,paciente text,medico text,paciente_id char(8),turno_id int )")
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

//GET PARA LISTAR SEGUN ESPECIALIDADENTRE UN RANGO
router.get('/especialidad/:fec_desde/:fec_hasta', (req, res, next) => {

    const fec_desde = req.params.fec_desde;
    const fec_hasta = req.params.fec_hasta;
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_entre_especialidades('"+fec_desde+"','"+fec_hasta+"') as (especialidad varchar(100), citas bigint)")
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

//GET PARA LISTAR SEGUN ESPECIALIDAD (AGRUPANDO) ENTRE UN RANGO
router.get('/agrupando_especialidad/:fec_desde/:fec_hasta', (req, res, next) => {

    const fec_desde = req.params.fec_desde;
    const fec_hasta = req.params.fec_hasta;
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_agrupando_especialiades('"+fec_desde+"','"+fec_hasta+"') as (nombre varchar(100),cta_id int,especialidad_id int, paciente_id character(8), cantidad bigint, estado int, fecha text, paciente text, medico text)")
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

//GET PARA LISTAR SEGUN ESPECIALIDAD (AGRUPANDO) ENTRE UN RANGO
router.get('/segun_medico/:fec_desde/:fec_hasta/:medico_id', (req, res, next) => {

    const fec_desde = req.params.fec_desde;
    const fec_hasta = req.params.fec_hasta;
    const medico_id = req.params.medico_id
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_segun_medico('"+fec_desde+"','"+fec_hasta+"','"+medico_id+"') as (paciente text, cita_id int, especialidad_id int, especialidad varchar(100), paciente_id character(8), cantidad bigint, estado int, fecha text)")
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



//GET PARA VER LA GANANCIA DEL DIA
router.get('/ganancia_dia/:fec', (req, res, next) => {

    const fec = req.params.fec;
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sel_cita_ganancias_dia('"+fec+"') as (ganancia numeric)")
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

//POST REGISTRAR
router.post('/', (req, res, next) => {
    
    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("select ins_cita('"+req.body.hora_inicio+"','"+req.body.hora_fin+"','"+req.body.estado+"','"+req.body.fecha+"','"+req.body.costo+"','"+req.body.paciente_id+"','"+req.body.turno_id+"')")        
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
        return client.query("select * from sel_cita('"+id+"') as (id int, inicio time, fin time, estado boolean, costo numeric(10,2),fecha date,paciente char(8),turno int)")
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
            console.log(err.stack)
        })
    })
    
});

// ELIMINAR
router.get('/eliminar/:id', (req, res, next) => {
    const id = req.params.id;

    var results = [];

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    
    pool.connect()
    .then(client => {
        return client.query("update cita set estado=0 where id='"+id+"'")
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
            console.log(err.stack)
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
        return client.query("select upd_cita('"+id+"','"+req.body.hora_inicio+"','"+req.body.hora_fin+"','"+req.body.estado+"','"+req.body.costo+"','"+req.body.fecha+"','"+req.body.paciente_id+"','"+req.body.turno_id+"')")
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