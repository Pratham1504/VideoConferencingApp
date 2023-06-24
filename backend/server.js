const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io =  socketIO(server, {
  cors: {
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET","POST"]
    }
  }
});
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   next();
// });
app.use(express.static('../frontend/public'))

// app.use('/peerjs', peerServer);

app.get('/:room', (req, res) => {
  const roomId = req.params.room;
  res.send(`Room ID: ${roomId}`);
});

io.on('connection', socket => {
//   const admins = {};

  socket.on('create-room', (userId, roomId) => {
    socket.join(roomId);
    console.log(roomId)
    console.log(userId)
    // admins[roomId] = userId;
    socket.to(roomId).emit('user-connected', userId)
    console.log(`New room created - ${roomId}`);
  });

//   socket.on('join-request', (userId, roomId) => {
//     socket.to(roomId).broadcast.emit('request-to-join', userId, roomId);
//   });

  socket.on('request-accepted', (userId, roomId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
  });

//   socket.on('request-rejected', (userId, roomId) => {
//     socket.to(userId).broadcast.emit('request-declined');
//   });

  socket.on('new-message', message => {
    io.emit('new-message', message);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    // Implement your logic here for handling user disconnection
    // socket.to(roomId).broadcast.emit('user-disconnected', userId);
  });
});

const port = 8000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
