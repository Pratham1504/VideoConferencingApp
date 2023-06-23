import Chat from './Chat';
import io from 'socket.io-client';``

const socket=io.connect("http://localhost:8000");

const App = () => {
    return (
        <>
            <Chat props = {socket} />
        </>
    )
}

export default App;