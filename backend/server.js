const app=require('express')()
require('dotenv').config()
const server=require('http').createServer(app);
const io=require('socket.io')(server,{
    cors:{
        origin:"*"
    }
})
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
app.use('/peerjs', peerServer);
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  })

io.on('connection',socket=>{
    admins={}
    socket.on('create-room',(userId,roomId)=>{
        socket.join(roomId)
        admins[roomId]=userId
        console.log(`new room - ${roomId}`)
    })
    socket.on('join-request',(userId,roomId)=>{
        socket.to(admin[roomId]).broadcast.emit('request-to-join',userId,roomId)
    })
    socket.on('request-accepted',(userId,roomId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
    })
    socket.on('request-rejected',(userId,roomId)=>{
        socket.to(userId).broadcast.emit('request-declined')
    })

    socket.on('new-message',message=>{
        io.emit('new-message',message);
    })
    socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
})

server.listen(process.env.PORT,()=>{
    console.log(`listening to the port ${process.env.PORT}`);
})