const mongoose = require('mongoose')

const dbConexion = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CDN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log('base de datos Online')
    } catch (error) {
        console.log(error)
        throw new Error('error en la conexión con la base de datos')
    }
}

module.exports = {
    dbConexion,
}
