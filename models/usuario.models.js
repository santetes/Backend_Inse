const { Schema, model } = require('mongoose')

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'el nombre es obligatorio'],
    },
    email: {
        type: String,
        require: [true, 'el correo es obligatorio'],
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        require: true,
        enum: ['ADMIN_ROLE', 'GESTOR_ROLE', 'USER_ROLE'],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
})

// Extraemos la versión y modificamos el valor por defecto de _id de la bbdd de mongo por el término uid
usuarioSchema.methods.toJSON = function () {
    const { __v, _id, password, ...usuario } = this.toObject()
    usuario.uid = _id

    return usuario
}

module.exports = model('Usuario', usuarioSchema)
