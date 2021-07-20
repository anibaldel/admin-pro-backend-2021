require('dotenv').config();
const path = require('path')
const express = require('express');
const cors = require('cors')

const {dbConnection} = require('./database/config')
// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio público
app.use( express.static('public') );

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));

// lo último
app.get('*',(rep,resp)=> {
    resp.sendFile( path.resolve(__dirname, 'public/index.html'))
})

app.listen(process.env.PORT, ()=>{
    console.log('serivdor coriendo en el puerto '+ process.env.PORT);
})