import React from 'react';

export default function Gather({
  room,
  socket,
  onBack
}) {

  function hdlBack() {
    socket.emit("tolobby");

    onBack();
  }
  

  return <>
    <div>
      Room: {room.name}
    </div>
    <button
      onClick={hdlBack}
    >
      Leave Room
    </button>
  </>
}