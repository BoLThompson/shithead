import React from 'react';

export default function PickRoom({
  socket,
  onJoin,
  onCreate,
}) {
  const [rooms, setRooms] = React.useState([]);
  const [selIdx, setSelIdx] = React.useState(null);

  React.useEffect(() => {
    socket.on("roomData", (r) => {
      console.log(r);
      setRooms(r);
    });
    socket.emit("queryRooms", {}, setRooms);

    return () => {
      socket.removeAllListeners("roomData");
    }
  }, [])

  return <div>
    Select a Room
    <table>
      <tbody>
        {
          rooms.length ?
          rooms.map((r, i) => 
            <tr key={i}>
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
    <button>
      Join Room
    </button>
  </div>
}