import React from 'react';

export default function PickRoom({
  socket,
  onJoin,
  onPassword,
  onCreate,
}) {
  const [rooms, setRooms] = React.useState([]);
  const [selName, setSelName] = React.useState("");

  React.useEffect(() => {
    //get updates about available rooms
    socket.on("roomData", (r) => {
      //if the one we have selected no longer exists
      if (r.every(r => r.name !== selName))
          //unselect
          setSelName("");
      
      //store the new state
      setRooms(r);
    });

    //"bring me up to speed, man"
    socket.emit("queryRooms", {}, setRooms);

    return () => {
      socket.removeAllListeners("roomData");
    }
  }, [])

  //join button
  function hdlJoin() {
    //reference to selected room
    const toJoin = rooms.find(r => r.name === selName);

    onJoin(toJoin);
  }

  return <div>
    Select a Room {selName}
    <style>{`
      .selectedRoom {
        background-Color: #0000ff80;
      }
    `}
    </style>
    <table>
      <tbody>
        {
          rooms.length ?
          rooms.map((r, i) => 
            <tr
              key={i}
              className={r.name === selName ? "selectedRoom" : ""}
              onClick={()=>{
                setSelName(r.name);
              }}
            >
              <td>
                {r.requirepw ? '🔒' : ''}
              </td>
              <td>
                {r.name}
              </td>
              <td>
                {r.playerCount}
              </td>
            </tr>
          )
          :
          <tr>
            <td>
              No rooms right now. Try creating one!
            </td>
          </tr>
        }
      </tbody>
    </table>
    <button
      onClick={onCreate}
    >
      Create Room
    </button>
    <button
      onClick={hdlJoin}
    >
      Join Room
    </button>
  </div>
}