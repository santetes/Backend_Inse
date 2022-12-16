const { request, response } = require('express')
const Usuario = require('../models/usuario.models')

const busquedaPorColeccion = async (req = request, res = response) => {
    const { coleccion, termino } = req.params
    const terminoRegex = new RegExp(termino, 'i')

    switch (coleccion) {
        case 'usuarios':
            const usuarios = await Usuario.find({
                $or: [{ nombre: terminoRegex }, { email: terminoRegex }],
            })
            return res.status(200).json({ ok: true, resultado: usuarios })

        default:
            return res
                .status(400)
                .json({ ok: false, msg: 'No ha indicado una colección válida' })
    }
}

module.exports = {
    busquedaPorColeccion,
}
