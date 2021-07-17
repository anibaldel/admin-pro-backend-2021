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
const getMedicoById= async (req,res) => {
    const id = req.params.id;
    try {
        const medico = await Medico.findById(id)
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre')
        
        res.json({
            ok: true,
            medico
        })
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
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

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medicoDB = await Medico.findById(id);
        if(!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'no se encuentra el medico con ese id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id,cambiosMedico,{new:true})
        
        res.json({
            ok: true,
            medico: medicoActualizado
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }


    
}
const borrarMedico= async (req,res) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);

        if(!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete(id)

        res.json({
            ok: true,
            msg: 'medico eliminado'
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
    
}

module.exports= {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}