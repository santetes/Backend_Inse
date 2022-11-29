const express = require('express')
const cors = require('cors')

const { dbConexion } = require('../dataBase/config')
require('dotenv').config()

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT

        // Conexión con la base de datos
        this.conectaDb()

        // middlewares
        this.middlewares()

        // Rutas de la aplicación
        this.routes()
    }

    conectaDb = async () => {
        await dbConexion()
    }

    middlewares() {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use('/api/auth', require('../routes/auth.routes'))
        this.app.use('/api/user', require('../routes/user.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('a la escucha en el puerto: ', this.port)
        })
    }
}

module.exports = Server
