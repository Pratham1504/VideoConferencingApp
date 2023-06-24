import React, { useEffect, useState, useCallback } from 'react';
import myPeer from './myPeer';
import socket from './socket';

import { useParams } from 'react-router-dom';

const Room = () => {
  const { RoomId } = useParams();
  const [peers, setPeers] = useState({});

  useEffect(() => {
    const connectToNewUser = (userId, stream) => {
      const call = myPeer.call(userId, stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on('close', () => {
        video.remove();
      });

      setPeers((prevPeers) => ({
        ...prevPeers,
        [userId]: call,
      }));
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const myVideo = document.createElement('video');
        myVideo.muted = true;
        addVideoStream(myVideo, stream);

        myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on('user-connected', (userId) => {
          connectToNewUser(userId, stream);
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices: ', error);
      });

    return () => {
      myPeer.disconnect();
    };
  }, []); // Empty dependency array

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    const videoGrid = document.getElementById('video-grid');
    videoGrid.append(video);
  }

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

  socket.on('request-to-join', (userId, roomId) => {
    if (roomId === RoomId) {
      const ans = prompt('Yes/No?');
      if (ans === 'Yes') {
        socket.emit('request-accepted', userId, roomId);
      } else {
        socket.emit('request-rejected', userId, roomId);
      }
    }
  });

  return (
    <>
      <div id="video-grid"></div>
    </>
  );
};

export default Room;
