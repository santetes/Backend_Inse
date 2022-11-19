const { Schema, model } = require('mongoose')

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'el nombre es obligatorio'],
    },
    correo: {
        type: String,
        require: true,
        unique: [true, 'el correo es obligatorio'],
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
})

// Extraemos la versión y modificamos el valor por defecto de _id de la bbdd de mongo por el término uid
usuarioSchema.methods.toJSON = function () {
    const { __v, _id, ...usuario } = this.toObject()
    usuario.uid = _id

    return usuario
}

module.exports = model('Usuario', usuarioSchema)
