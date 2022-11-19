const { OAuth2Client } = require('google-auth-library')

const validarIdGoogle = async (idToken) => {
    const client = new OAuth2Client(process.env.GOOGLE_ID_CLIENT)

    const ticket = await client.verifyIdToken({
        idToken,
    })
    const { name, email, picture } = ticket.getPayload()
    return { nombre: name, correo: email, img: picture }
}
module.exports = validarIdGoogle
