const { request, response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario.models')
const { generarJWT } = require('../helpers/generarJWT')

const getUsuarios = async (req = request, res = response) => {
    try {
        const usuarios = await Usuario.find()

        res.json({
            ok: true,
            usuarios,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'algo salió mal',
        })
    }
}

const crearUsuario = async (req = request, res = response) => {
    const { email, password } = req.body

    try {
        const usuarioEnBBDD = await Usuario.findOne({ email })

        if (usuarioEnBBDD) {
            return res.status(400).json({
                ok: false,
                msg: 'Este email ya se encuentra registrado',
            })
        } else {
            const usuario = new Usuario(req.body)

            // Encriptar contraseña
            const salt = bcrypt.genSaltSync()
            usuario.password = bcrypt.hashSync(password, salt)

            // Le asignamos el role - por defecto USER_ROLE
            const role =
                email === 'sanmarti@ibv.org' || email === 'sanmartgon@gmail.com'
                    ? 'ADMIN_ROLE'
                    : 'USER_ROLE'
            usuario.role = role

            // guardamos en bbdd
            await usuario.save()

            // generamos jwt
            const jwt = await generarJWT(usuario._id)

            return res
                .status(200)
                .json({ ok: true, msg: 'usuario guardado en la bbdd', jwt })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, msg: 'algo salió mal' })
    }
}

const actualizaUsuario = async (req = request, res = response) => {
    const uid_usuarioModificar = req.params.id
    const uid_usuarioPeticion = req.uid

    try {
        const usuarioDb = await Usuario.findById(uid_usuarioModificar)
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún usuario con la id indicada',
            })
        }

        const { password, google, ...campos } = req.body

        // Comprobamos si no existe un usuario en bbdd con el mismo email por el que queremos actualizar
        // respetando que el propio usuario que va a ser modificado pueda mantener su email
        const emailRepetido = await Usuario.findOne({ email: campos.email })

        if (emailRepetido && usuarioDb.email != campos.email) {
            return res.status(404).json({
                ok: false,
                msg: 'ya existe en la bbdd un usuario con ese email',
            })
        }

        // Comprobamos si es usuario google y protegemos que no pueda modificar su email
        if (usuarioDb.google && campos.email != usuarioDb.email) {
            campos.email = usuarioDb.email
            return res.status(400).json({
                ok: false,
                msg: 'Una cuenta de google no puede modificar su email',
            })
        }

        // El usuario que realiza la petición no puede autoborrarse
        if (!campos.estado && uid_usuarioPeticion === uid_usuarioModificar) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no puede borrarse a sí mismo',
            })
        }

        // Un usuario no puede cambiarse el role a sí mismo
        if (
            campos.role != usuarioDb.role &&
            uid_usuarioPeticion === uid_usuarioModificar
        ) {
            return res.status(400).json({
                ok: false,
                msg: 'un usuario no puede modificar el rol de sí mismo',
            })
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            uid_usuarioModificar,
            campos,
            { returnDocument: 'after' }
        )

        res.json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuarioActualizado,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'algo salió mal :(' })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizaUsuario,
}
