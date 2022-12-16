const { Router } = require('express')
const { validarJWT } = require('../middlewares/validarJWT')
const {
    busquedaPorColeccion,
} = require('../routes.controller/busqueda.controller')

const router = Router()

router.get('/:coleccion/:termino', validarJWT, busquedaPorColeccion)

module.exports = router
