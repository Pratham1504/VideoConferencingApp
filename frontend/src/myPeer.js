import Peer from "peerjs";

const options = {
  // host: "localhost",
  // port: 8000,
  // path: "/peerjs",
  // debug: true,
  host: 'localhost',
  port: '9001',
  path: '/myapp',
};

const myPeer = new Peer(undefined, options);
export default myPeer ;
