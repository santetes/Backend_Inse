const { response, request } = require('express')
const Usuario = require('../models/usuario.models')
const validarIdGoogle = require('../helpers/validar_id_google')
const { generarJWT } = require('../helpers/generarJWT')

const googleSingIn = async (req = request, res = response) => {
    const { id_token_google } = req.body

    try {
        const { nombre, correo, img } = await validarIdGoogle(id_token_google)
        // Detecto si el usuario a crear es sanmarti y le asigno el rol de administrador. Por defecto es user
        const role = correo === 'sanmarti@ibv.org' ? 'ADMIN_ROLE' : 'USER_ROLE'

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            usuario = new Usuario({
                nombre,
                correo,
                img,
                role,
            })
            await usuario.save()

            // Genero JWT extrayendo el id del usuario recien guardado en la bbdd
            const { id } = await Usuario.findOne({ correo })
            const token = await generarJWT(id)

            return res
                .status(200)
                .json({ msg: 'Usuario creado correctamente', usuario, token })
        }

        //Verificamos si el usuario aún estando en la bbdd su estado es false (borrado)
        if (!usuario.estado) {
            return res
                .status(400)
                .json({ msg: 'Usuario no correcto - estado: false' })
        }

        //generar JWT
        const token = await generarJWT(usuario.id)

        res.json({ usuario, token })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: 'Algo salió mal :(',
        })
    }
}

module.exports = { googleSingIn }
