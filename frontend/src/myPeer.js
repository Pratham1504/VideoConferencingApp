import Peer from "peerjs";

const options = {
  host: "localhost",
  port: 8000,
  path: "/peerjs",
  debug: true,
};

const myPeer = new Peer(undefined, options);
export default myPeer ;
