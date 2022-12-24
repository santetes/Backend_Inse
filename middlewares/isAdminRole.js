const { request, response } = require('express')
const Usuario = require('../models/usuario.models')

const isAdminRole = async (req = request, res = response, next) => {
    const usuarioPeticion = await Usuario.findById(req.uid)
    if (usuarioPeticion.role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            msg: 'Es necesario ser Administrador para realizar esta petición',
        })
    }
    next()
}

module.exports = { isAdminRole }
