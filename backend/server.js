const app=require('express')()
require('dotenv').config()
const server=require('http').createServer(app);
const io=require('socket.io')(server,{
    cors:{
        origin:"*"
    }
})
io.on('connection',socket=>{
        socket.on('new-user',d=>{
            io.emit('new-user',d);
        })
})

server.listen(process.env.PORT,()=>{
    console.log(`listening to the port ${process.env.PORT}`);
})