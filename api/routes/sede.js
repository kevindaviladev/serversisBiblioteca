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

//POST PARA LISTAR
router.post('/', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select * from sede")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

//POST PARA LISTAR RUBROS
router.post('/rubros', (req, res, next) => {
    
    var results;
    var rpta;

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })

    pool.connect()
    .then(client => {
        return client.query("select r.id, r.nombre,ds.monto,ds.calculo_diario from detalle_sede ds inner join rubro r on ds.rubro_id=r.id inner join sede s on s.id=ds.sede_id where s.nombre='"+req.body.nombre+"'")
        .then(result => {
            client.release()
            results = result.rows;
            // rpta = JSON.parse(results);
            return res.json(results);
            // return JSON.parse(results);
        //     return results res.json(
        //         results
        //    );
        })
        .catch(e => {
            client.release()

            console.log(e.stack)
        })
    })
});

// //POST REGISTRAR
// router.post('/', (req, res, next) => {
    
//     var results = [];

//     pool.on('error', (err, client) => {
//         console.error('Unexpected error on idle client', err)
//         process.exit(-1)
//     })
    
//     pool.connect()
//     .then(client => {
//         return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a inner join usuario us on a.usuario_id=us.id where us.correo='"+req.body.correo+"'")        
//         // return client.query("select a.id, a.descripcion, to_char(a.fecha_inicio,'DD-MM-YYYY') as fecha_inicio, to_char(a.fecha_fin,'DD-MM-YYYY') as fecha_fin, a.estado, a.monto, a.foto from anticipo a")        
//         .then(result => {
//             client.release()
//             results = result.rows;
//             return res.status(201).json({
                
//                     results
                
//             });
//         })
//         .catch(e => {
//             client.release()
//             // console.log(err.stack)
//             console.log(e.stack)
//         })
//     })
// });

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
        return client.query("select * from sel_usuario_detalle('"+id+"') as (id int, usuario varchar(100), clave varchar(100),tipo_usuario int, persona_id char(8), estado boolean)")
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
        return client.query("select * from upd_usuario('"+id+"','"+req.body.usuario+"','"+req.body.clave+"','"+req.body.tipo_usuario+"','"+req.body.persona_id+"','"+req.body.estado+"')")
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