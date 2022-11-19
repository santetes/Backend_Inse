const { Router, request, response } = require('express')
const { check } = require('express-validator')
const validarCampos = require('../middlewares/validar-campos')
const { googleSingIn } = require('../routes.controller/auth.controller')

const router = Router()

router.post(
    '/google',
    [
        check('id_token_google', 'Es necesario un token-id de google correcto')
            .not()
            .isEmpty(),
        validarCampos,
    ],
    googleSingIn
)

module.exports = router
