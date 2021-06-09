const express = require('express');
const routes = require('./routes');
//para acceder a los archivos de las carpetas se requiere path
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar las variables
require('dotenv').config({ path: 'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexion a la BD
const db = require('./config/db');

//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
     .then(() => console.log('Conectado al Servidor'))
     .catch(error => console.log(error));

//crear una app de express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Agregamos express validator a toda la aplicacion
//app.use(expressValidator());

//Habilitar Pug
app.set('view engine', 'pug');

//Añadir la carpeta de las vista
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//agrego session nos permiten navegar sin volver a autenticar
app.use(session({
     secret: 'supersecreto',
     resave: false,
     saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
     res.locals.vardump = helpers.vardump;
     res.locals.mensajes = req.flash();
     res.locals.usuario = {...req.user} || null;
     next();
});



//Habilitar bodyParser para leer los datos del formulario
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

app.use('/', routes() );


//app.listen(3000);
//Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
     console.log('El servidor esta funcionando');
});

//require('./handlers/email');