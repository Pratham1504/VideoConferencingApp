const app = require('express')();

const server = require('http').createServer();

const io = require('socket.io')(server,{
    cors : {
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log("What is this socket: ",socket);
    console.log("Socket is active to be connected");

    socket.on("chat",(payload)=>{
        console.log("What is payload",payload);
        io.emit("chat",payload);
    });
})

// app.listen(8000,()=>console.log("server is active...."));

server.listen(process.env.PORT,()=>console.log(`server is listening at port ${process.env.PORT} ....`))