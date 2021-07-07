const { response } = require("express");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");
const Hospital = require("../models/hospital");

const getTodo = async (req,res=response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');

    // const usuarios = await Usuario.find({ nombre: regex });
    // const hospitales = await Hospital.find({ nombre: regex });
    // const medicos = await Medico.find({ nombre: regex });

    const [usuarios,hospitales,medicos] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
    ]);



    res.json({
        ok: true,
        usuarios,
        hospitales,
        medicos
    })

}

const getDocumentosColeccion = async (req,res=response) => {

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;
    const regex = new RegExp(busqueda,'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img')
            
            break;
        
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')
        break;

            
        case 'usuarios':
            data = await Usuario.find({ nombre: regex })
                                
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla tiene que ser usuarios/medicos/hospitales'
            });
            
    }

    res.json({
        ok:true,
        resultados: data
    }) 

}

module.exports = {
    getTodo,
    getDocumentosColeccion
}