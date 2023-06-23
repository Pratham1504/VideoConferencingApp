const app=require('express')()
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

server.listen(8000,()=>{
    console.log("listening");
})