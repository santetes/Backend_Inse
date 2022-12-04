const { response, request } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario.models')
const validarIdGoogle = require('../helpers/validar_id_google')
const { generarJWT } = require('../helpers/generarJWT')

const login = async (req = request, res = response) => {
    const { email, password } = req.body

    try {
        /* Se crea un timer para que cada petición demore un segundo para dificultar el bombardeo de la bbdd */
        setTimeout(async () => {
            const usuarioDb = await Usuario.findOne({ email })

            if (!usuarioDb) {
                return res
                    .status(404)
                    .json({ ok: false, msg: 'email no encontrado' })
            }

            if (usuarioDb.estado === false) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario borrado de la bbdd. Póngase en contacto con el administrador',
                })
            }

            // Verificar password
            const validPassword = bcrypt.compareSync(
                password,
                usuarioDb.password
            )
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ ok: false, msg: 'Contraseña no es válida' })
            }

            // Generar JWT
            const jwt = await generarJWT(usuarioDb._id)

            return res.status(200).json({
                ok: true,
                msg: 'Usuario autenticado correctamente',
                usuario: usuarioDb,
                jwt,
            })
        }, 1000)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, msg: 'algo salió mal' })
    }
}

const googleSingIn = async (req = request, res = response) => {
    const { id_token_google } = req.body

    try {
        const {
            nombre,
            correo: email,
            img,
        } = await validarIdGoogle(id_token_google)

        let usuario = await Usuario.findOne({ email })

        if (!usuario) {
            // Detecto si el usuario a crear es sanmarti y le asigno el rol de administrador. Por defecto es user
            const role =
                email === 'sanmarti@ibv.org' ? 'ADMIN_ROLE' : 'USER_ROLE'
            // password por defecto si es usuario de google
            const password = 'xxx'
            // indico que es un usuario creado con google
            google = true

            usuario = new Usuario({
                nombre,
                email,
                password,
                img,
                role,
                google,
            })
            await usuario.save()

            // Genero JWT extrayendo el id del usuario recien guardado en la bbdd

            const jwt = await generarJWT(usuario.id)

            return res.status(200).json({
                ok: true,
                msg: 'Usuario creado correctamente',
                usuario,
                jwt,
            })
        }
        //Si el usuario existe, verificamos si el usuario aún estando en la bbdd su estado es false (borrado)
        // se envia el própio usuario para que se pueda cerrar sesión en google oAuth
        // TODO: Mirar de no enviar el usuario completo, sino una modificación del usuario donde sólo se obtenga el email para cerrar la sesión
        if (usuario.estado === false) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario borrado de la bbdd. Póngase en contacto con el administrador',
                usuario,
            })
        }

        //generar JWT
        const jwt = await generarJWT(usuario.id)

        res.json({
            ok: true,
            msg: 'Usuario autenticado correctamente',
            usuario,
            jwt,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Algo salió mal :(',
        })
    }
}

const renew = async (req = request, res = response) => {
    const uid = req.uid
    const jwt = await generarJWT(uid)

    res.status(200).json({ ok: true, msg: 'token renovado correctamente', jwt })
}

module.exports = { login, googleSingIn, renew }
