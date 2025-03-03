import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {socket} from './socket.jsx'
import NameEntry from './scenes/NameEntry.jsx'
import PickRoom from './scenes/PickRoom.jsx'
import CreateRoom from './scenes/CreateRoom.jsx'
import Gather from './scenes/Gather.jsx'
import RoomPassword from './scenes/RoomPassword.jsx'
console.log("running globally");

function App() {  
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState(null);

  const [scene, setScene] = React.useState("name");

  // React.useEffect(() => {
    
  // }, [])

  function joinRoom(roomdata) {
    socket.emit("joinRoom", roomdata, (response) => {
      if (response.accept) {
        setScene("gather")
      }
      else console.log(response);
    })
  }

  function getScene() {
    switch (scene) {
      case "name":
        return <NameEntry
          socket={socket} 
          onPick={(n) => {
            setName(n);
            setScene("pickroom")
          }
        }/>
      case "pickroom":
        return <PickRoom
          socket={socket}
          onJoin={ room =>{
            setRoom(room);
            if (room.requirepw) {
              setScene("roomPassword")
            }
            else joinRoom({name:room.name,pw:""});
          }}
          onCreate={()=>{
            setScene("createroom");
          }}
        />
      case "roomPassword":
        return <RoomPassword
          socket={socket}
          onJoin={roomdata=>{
            joinRoom(roomdata);
          }}
          onBack={()=>{
            setRoom(null);
            setScene("pickroom");
          }}
          room={room}
        />
      case "createroom":
        return <CreateRoom
          hostname={name}
          socket={socket}
          onCreate={ room => {
            setRoom(room);
            setScene("gather");
          }}
          onBack={() => {
            setScene("pickroom")
          }}
        />
      case "gather":
        return <Gather
          room={room}
          socket={socket}
          onBack={() => {
            setScene("pickroom");
          }}
        />

      default: return null;
    }
  }

  return (
    <>
      {getScene()}
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
