require('dotenv').config();

const express = require('express');
const cors = require('cors')

const {dbConnection} = require('./database/config')
// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();

// Rutas
app.get('/',(req,res)=>{
    res.json({
        ok: true,
        msg: 'hola'
    })

});

app.listen(process.env.PORT, ()=>{
    console.log('serivdor coriendo en el puerto '+ process.env.PORT);
})