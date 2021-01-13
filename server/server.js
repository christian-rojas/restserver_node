require('./config/config.js');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
//app use = middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.use( require('./routes/usuario'));
// configuracion global de rutas
app.use(require('./routes/index'));

//si no existe la crea solo
mongoose.connect(process.env.URLDB, 
                {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                (err, res) =>{
    if(err) throw err;
    console.log('base de datos online');
    
});

app.listen(process.env.PORT, () =>{
    console.log('escuchando: ',process.env.PORT);
});