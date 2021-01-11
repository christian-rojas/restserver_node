require('./config/config.js');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
//app use = middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use( require('./routes/usuario') );

//si no existe la crea solo
mongoose.connect('mongodb://localhost:27017/local', (err, res) =>{
    if(err) throw err;
    console.log('base de datos online');
    
});

app.listen(process.env.PORT, () =>{
    console.log('escuchando: ',process.env.PORT);
});