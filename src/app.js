const express = require('express')

const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const resourceFolder = path.join(__dirname,'../public')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

/// Configura la ruta de recursos estaticos ---
app.use(    express.static(  resourceFolder    )   )
////////////////////////////////////

app.use( express.json() ) // configures express to handle json
// app.use(userRouter)
// app.use(taskRouter)


module.exports = {
        server,
        io
}