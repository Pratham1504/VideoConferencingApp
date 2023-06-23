import io from 'socket.io-client';
import { useState,useEffect } from 'react';

const socket=io.connect("http://localhost:8000");

const Chat=()=>{

  const [message,setmessage]=useState("");
  const [chat,setchat]=useState([]);
  const [namee,enamee]=useState("");

  useEffect(()=>{ 
    const name=prompt('enter name pls');
    enamee(name);
  },[])
  
  const sendchat=()=>{  
          socket.emit('new-user',{namee,message});
          setmessage("");
  }
  
  useEffect(()=>{
    socket.on('new-user',chats=>{
    setchat([...chat,chats])
    })
    console.log(chat)
  })

  return (
      <>
      <div>
      {chat.length>0 && chat.map((value)=>{
       return (
       <h6>{value.namee}:
       {value.message}</h6>)
      })}
        <div>
        </div>
        {/* <form onSubmit={sendchat}> */}
        <input type="text" placeholder='message here' onChange={e=>{setmessage(e.target.value)}}/>      
        <button onClick={sendchat}>submit</button>
        {/* </form> */}
      
      </div>
      </>
  )
}
export default Chat;