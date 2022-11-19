const jwt = require('jsonwebtoken')

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: '365 d' },
            (err, token) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(token)
            }
        )
    })
}

module.exports = {
    generarJWT,
}
