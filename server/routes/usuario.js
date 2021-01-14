const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
//solo extraigo esta parte de la libreria
const { verificarToken, verificarAdmin } = require('../middlewares/autenticacion'); 

app.get('/usuario', verificarToken, (req, res) => {

    /*return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre
    })*/

    //el usuario requiere la cantidad
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite =  req.query.limite || 5;
    limite = Number(limite);

    //dentro de {} se puede poner condiciones : google:true
    // luego se puede excluir los campos a mostrar
    Usuario.find({estado:true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                //se agrega el return para que se salga inmediatamente
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({estado:true}, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })
    //res.send('get');
});

app.post('/usuario', [verificarToken, verificarAdmin], (req, res) =>{
    //nombre del objeto json -> puede ser persona
    let body = req.body;



    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) =>{
        if(err){
            //se agrega el return para que se salga inmediatamente
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        })
    });

});

app.put('/usuario/:id', [verificarToken, verificarAdmin], (req, res) =>{

    //el id hace match con lo de arriba
    let id = req.params.id;
    //filtra los campos editables
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //findByIdAndUpdate
    //new retorna el nuevo user
    //sin el validator se salta las restricciones del schema
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true},(err, usuarioDB) =>{
        // usuarioDB.save;
        if(err){
            //se agrega el return para que se salga inmediatamente
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //esto manda el status 200 x defecto
        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificarToken, verificarAdmin], (req, res) =>{

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new : true}, (err, usuarioBorrado) =>{
        if(err){
            //se agrega el return para que se salga inmediatamente
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;