const jwt = require('jsonwebtoken');
// ================
// Verificar token
// ================
//si no llamo al next no sigue ejecutandose
let verificarToken = (req, res, next) => {

    //obtengo el token desde el header
    let token = req.get('token'); //o authorization

    jwt.verify(token, process.env.SEED, (err, decoded) =>{

        if( err ){
            return res.status(404).json({
                ok:false,
                err
            });
        }
        
        req.usuario = decoded.usuario;
        next();

    });

    next();
};

// ================
// Verificar admin_role
// ================
let verificarAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ){
        next();
    }else{
         return res.json({
             ok: false,
             err:{
                message: 'El usuario no es administrador'
            }
         })
    }
};


module.exports = {
    verificarToken,
    verificarAdmin
}