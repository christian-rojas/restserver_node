//un objeto global que corre a traves de toda la aplicacion
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/local';
}else{
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;