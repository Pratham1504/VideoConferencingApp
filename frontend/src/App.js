import React from 'react';
// import { useState } from 'react';
// import Chat from './Chat';
// import peer from 'peerjs';
import Room from './room'
import './App.css'
// import io from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './landing';
// const { v4: uuidV4 } = require('uuid')
// const myPeer = new peer(undefined, {
//     host: '/',
//     port: '3001'
// })
const App = () => {
    
   
    // const socket = io('/')

   
    return (
        <>
            {
                <BrowserRouter>
                    <Routes>
                        <Route
                            exact path="/"
                            element={<Landing />}
                        />
                        <Route
                             path='/room/:roomid'
                            element={<Room />}
                        />
                    </Routes>
                </BrowserRouter>
            }

            {/* <Chat props={socket} /> */}
        </>
    )
}

export default App;