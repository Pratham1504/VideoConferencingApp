import React, { useEffect, useState, useCallback } from 'react';
// import {peer} from './myPeer';
import socket from './socket';
import Peer from "peerjs";
import { useParams } from 'react-router-dom';
// import { setTimeout } from 'timers/promises';

const Room = () => {
  const { roomid } = useParams();
  console.log(useParams());
  console.log(roomid);
  const options = {
    // host: "localhost",
    // port: 8000,
    // path: "/peerjs",
    // debug: true,
    host: 'localhost',
    port: '9001',
    path: '/myapp',
  };
  
  // const myPeer=peer()
  
  const [peers, setPeers] = useState({});
  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    const videoGrid = document.getElementById('video-grid');
    videoGrid.append(video);
  }
  const connectToNewUser = (userId, stream,myPeer) => {
    // const myPeer = new Peer(undefined, options);
    const call = myPeer.call(userId, stream)
    console.log(call)
  const video = document.createElement('video')
  console.log(video)
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

    setPeers((prevPeers) => ({
      ...prevPeers,
      [userId]: call,
    }));
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const myVideo = document.createElement('video');
        myVideo.muted = true;
        addVideoStream(myVideo, stream);
        console.log('yoyo')
        const myPeer = new Peer(undefined, options);
        myPeer.on('open',id =>{
          console.log('lol')
          socket.emit('join-request', id, roomid) 
          console.log(roomid)
        })
        
        myPeer.on('call', (call) => {
          console.log('This peer is being called...');
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', userVideoStream => {
            console.log('This peer is being called...on-stream...');
            addVideoStream(video, userVideoStream);
          });
        });
        socket.on('request-to-join', (userId, roomid) => {
          if (roomid === roomid) {
            const ans = prompt('Yes/No?');
            if (ans === 'Yes') {
              socket.emit('request-accepted', userId, roomid);
            } else {
              socket.emit('request-rejected', userId, roomid);
            }
          }
        });
        socket.on('user-connected', (userId) => {
          console.log("a new user connected")
          console.log(userId,stream)
          // setTimeout(connectToNewUser,1000,userId,stream)
          connectToNewUser(userId, stream,myPeer);
        });
        
        
      })
      .catch((error) => {
        console.error('Error accessing media devices: ', error);
      });

    return () => {
      const myPeer = new Peer(undefined, options);
      myPeer.disconnect();
    };
  },[socket]); // Empty dependency array

  
  // navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       const myVideo = document.createElement('video');
  //       myVideo.muted = true;
  //       // addVideoStream(myVideo, stream);
  //       console.log('yoyo')
  //       // const myPeer = new Peer(undefined, options);
  //       // myPeer.on('open',id =>{
  //       //   console.log('lol')
  //       //   socket.emit('join-request', id, roomid) 
  //       //   console.log(roomid)
  //       // })
  //       socket.on('user-connected', (userId) => {
  //         console.log("a new user connected")
  //         console.log(userId,stream)
  //         // setTimeout(connectToNewUser,1000,userId,stream)
  //         connectToNewUser(userId, stream,myPeer);
  //       });
  //       myPeer.on('call', (call) => {
  //         console.log('This peer is being called...');
  //         call.answer(stream);
  //         const video = document.createElement('video');
  //         call.on('stream', userVideoStream => {
  //           console.log('This peer is being called...on-stream...');
  //           addVideoStream(video, userVideoStream);
  //         });
  //       });
        
        
        
        
  //     })
  socket.on('user-disconnected', (userId) => {
    if (peers[userId]) {
      peers[userId].close();
      setPeers((prevPeers) => {
        const updatedPeers = { ...prevPeers };
        delete updatedPeers[userId];
        return updatedPeers;
      });
    }
  });

  // socket.on('request-to-join', (userId, roomid) => {
  //   if (roomid === roomid) {
  //     const ans = prompt('Yes/No?');
  //     if (ans === 'Yes') {
  //       socket.emit('request-accepted', userId, roomid);
  //     } else {
  //       socket.emit('request-rejected', userId, roomid);
  //     }
  //   }
  // });

  return (
    <>
      <div id="video-grid"></div>
    </>
  );
};

export default Room;
