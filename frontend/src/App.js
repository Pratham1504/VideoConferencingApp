import { useState } from 'react';
// import Chat from './Chat';
import peer from 'peerjs';
import './App.css'
import io from 'socket.io-client';
const { v4: uuidV4 } = require('uuid')
const myPeer = new peer(undefined, {
    host: '/',
    port: '3001'
})
const App = () => {
    const [roomId,setroomId]=useState("")
    const socket = io.connect("http://localhost:8000");
    var videoGrid = document.getElementById('video-grid')
    const peers = {}
    
    const myVideo = document.createElement('video')
    myVideo.muted = true
    function connectToNewUser(userId, stream) {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }
    function addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        videoGrid=document.getElementById('video-grid')
        videoGrid.append(video)
    }
    const newroom= ()=>{
        const RoomId=uuidV4()
        myPeer.on('open', id => {
            socket.emit('create-room', id,RoomId)
        })
    }
    const reqJoin = ()=>{
        myPeer.on('open', id => {
            socket.emit('join-request', id,roomId)
        })
    }
    // const socket = io('/')
    
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        addVideoStream(myVideo, stream)

        myPeer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })
    })
    socket.on('user-disconnected',  userId=> {
        if (peers[userId]) peers[userId].close()
      })
    socket.on('request-to-join',(userId,roomId)=>{
        const ans=prompt("Yes/No?")
        if(ans==="Yes"){
            socket.emit('request-accepted',userId,roomId)
        }else{
            socket.emit('request-rejected',userId,roomId)
        }
    })
    socket.on('request-declined',() =>{
        console.log("request declined")
    })
    return (
        <>  
            <script defer src="https://unpkg.com/peerjs@1.2.0/dist/peerjs.min.js"></script>
            <script src="/socket.io/socket.io.js" defer></script>
            <button onSubmit={newroom}>New Room</button>
            <input type="text" placeholder='message here' onChange={e=>{setroomId(e.target.value)}}/> 
            <button onClick={reqJoin}>submit</button>
            <div id='video-grid'></div>
            {/* <Chat props={socket} /> */}
        </>
    )
}

export default App;