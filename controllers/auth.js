const {response} = require('express');
const bcrypt= require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req,res=response)=> {
    const {email, password} = req.body;
    
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({email})
        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'El email no encontrado'
            })
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraeña no valida'
            });
        }
        // Generar el Token -JWT
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado...'
        });
    }

}

const googleSigIn = async(req, res= response)=> {
    const googleToken = req.body.token;
    
    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB) {
            usuario = new Usuario({
                nombre : name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })

        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true
        }

        // Guardar en DB
        await usuario.save();

        // Generar el Token -JWT
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }


}



module.exports = {
    login,
    googleSigIn
}

