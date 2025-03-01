import React from 'react';

export default function PickRoom({
  socket,
  onJoin,
  onCreate,
}) {
  const [rooms, setRooms] = React.useState([]);
  const [selIdx, setSelIdx] = React.useState(null);

  React.useEffect(() => {
    socket.on("roomData", setRooms);
    socket.emit("queryRooms", {}, setRooms);

    return () => {
      socket.removeAllListeners("roomData");
    }
  }, [])

  return <div>
    Select a Room
    <table>
      <tbody>
        {rooms.map(r => {
          <tr>
            <td>
              {r.hasPW ? '🔒' : ''}
            </td>
            <td>
              {r.name}
            </td>
            <td>
              {r.playerCount}
            </td>
          </tr>
        })}
      </tbody>
    </table>
    <button>
      Create Room
    </button>
    <button>
      Join Room
    </button>
  </div>
}