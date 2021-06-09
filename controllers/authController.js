const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true
});

//Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }
    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
        
    })
}

//genera un Token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: { email }});

    //si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    //console.log(expiracion);
    
    //guardarlos en la base de datos
    await usuario.save();
    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    
    //Envia el correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }
    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer Contraseña'
    })
}

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    //verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');




}