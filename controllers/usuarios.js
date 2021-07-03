const {response} = require('express'); 
const bcrypt= require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req,res) => {
    const usuarios = await Usuario.find({},'nombre email role google')
    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })

}

const crearUsuarios = async (req,res=response) => {

    const {email,password} = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        
        //Guardar usuario
        await usuario.save();
        
        // Generar el Token -JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        })
    }
    
    
}
const actualizarUsuario = async(req, res=response)=> {
    // TODO Validar token
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return res.status(500).json({
                ok: false,
                msg: 'no existe el usuario con ese id'
            });
        }

        // Actualizacion
        const {password,google,email, ...campos} = req.body;

        if(usuarioDB.email !== email) {
        
            const existeEmail = await Usuario.findOne({email})
            if(existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos, {new:true});


        return res.json({
            ok:true,
            usuario: usuarioActualizado
        })


    } catch(error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }

}

const borrarUsuario=async(req,res=response)=> {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return res.status(500).json({
                ok: false,
                msg: 'no existe el usuario con ese id'
            });
        }
        await Usuario.findByIdAndDelete(uid);
        
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }
}



module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}