const { Router } = require('express')
const { check } = require('express-validator')
const {
    crearUsuario,
    getUsuarios,
    actualizaUsuario,
} = require('../routes.controller/user.controller')
const { validarJWT } = require('../middlewares/validarJWT')
const { isAdminRole } = require('../middlewares/isAdminRole')
const validarCampos = require('../middlewares/validar-campos')

const router = Router()

router.get('/', validarJWT, getUsuarios)

router.post(
    '/',
    [
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('password', 'el password es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        validarCampos,
    ],
    crearUsuario
)

router.put(
    '/:id',
    [
        validarJWT,
        isAdminRole,
        check('nombre', 'el nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        validarCampos,
    ],
    actualizaUsuario
)

module.exports = router
