const {response} = require('express'); 
const bcrypt= require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Medico = require('../models/medico');

const getMedicos= async (req,res) => {

    const medicos = await Medico.find()
                            .populate('usuario','nombre img')
                            .populate('hospital','nombre')
    
    res.json({
        ok: true,
        medicos
    })
    
}
const crearMedico = async (req,res) => {
    
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();
        
        res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
}
const actualizarMedico= async (req,res) => {
    
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}
const borrarMedico= async (req,res) => {
    
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports= {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}