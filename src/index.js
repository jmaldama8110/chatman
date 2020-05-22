const { server,
        io          } = require('./app')
const { generateTextObject,
        generateGeolocationObject } = require('../src/utils/messages')

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom  } = require('../src/utils/users')    

const Filter = require('bad-words')
const port = process.env.PORT || 3000


//server (emit) -> cliente (receive) -- countUpdate
//cliente (emit) -> server (receive) -- increment

io.on('connection',(socket) => {

    console.log('Server: usuario conectado..')

    socket.on('join', ( { nickname,room }, callback )=>{

        const {error, user } = addUser( { id: socket.id,nickname, room }  )
        
        if( error ){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('NewMsg', generateTextObject('Admin','Hola '+ user.nickname + ', Bienvenido!') )
        socket.broadcast.to(user.room).emit('NewMsg',generateTextObject('Admin',`${user.nickname} se ha unido a ${user.room}`) )
        
        io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
        })

        // socket.emit, io.emit, socket.broadcast.emit
        //io.to.emit, socket.broadcast.emit
        callback()
    })



    socket.on('postMessage', (message, callback ) => {
        const filter = new Filter()

        if( filter.isProfane(message) ){
            return callback('Server: palabras agresivas no permitidas..')
        }   

        const user = getUser( socket.id )

        io.to(user.room).emit('NewMsg', generateTextObject(user.nickname, message) )
        callback() // callback que envia un valor de respuesta en blanco, si todo ok

    })

    socket.on('sendGeolocation', (pos, callback) => {

        const user = getUser( socket.id )
        io.to(user.room).emit('sendLocationMsg',  generateGeolocationObject(user.nickname,`https://google.com/maps?q=${pos.lat},${pos.long}`) )

        callback('Geodata OK..')
    })



    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)

        if( user ){
            io.to(user.room).emit('NewMsg', generateTextObject(`<-${user.nickname} se ha ido...`) )  
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})

server.listen(port, ()=>{
    console.log('Servidor corriendo en puerto:: ' + port)
})

