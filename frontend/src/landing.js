import { useEffect, useState } from 'react';
import  socket  from './socket.js';

import { useNavigate } from 'react-router-dom';
import myPeer from './myPeer.js';

// import { link } from 'fs';
const { v4: uuidV4 } = require('uuid')

const Landing = () => {
    const [userId,setUserId] = useState('')
//     useEffect(()=> {
        // const myPeer = new Peer();
        myPeer.on('open',(id) => {
            setUserId(id)
        })
//     },[])

    
    console.log("hi")
    const navigate = useNavigate()
    const [roomId, setroomId] = useState("")
    const newroom = () => {
        console.log("hi2")
        const RoomId = uuidV4()
        console.log(RoomId)
        
            socket.emit('create-room', userId, RoomId)
            navigate(`/room/${RoomId}`)

        

    };
    const reqJoin = () => {
        console.log("hi3")
        
            socket.emit('join-request', userId, roomId)
            // navigate(`/room/${roomId}`)

       
    }
    socket.on('request-to-join', (userId, roomId) => {
        const ans = prompt("Yes/No?")
        if (ans === "Yes") {
            socket.emit('request-accepted', userId, roomId)
        } else {
            socket.emit('request-rejected', userId, roomId)
        }
    })
    socket.on('request-declined', () => {
        console.log("request declined")
    })


    return (
        <>

            <button onClick={newroom}>New Room</button>
            <input type="text" placeholder='message here' onChange={e => { setroomId(e.target.value) }} />
            <button onClick={reqJoin}>submit</button>

        </>
    )
}
export default Landing;