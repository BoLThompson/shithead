import React from 'react';

export default function RoomPassword({
  socket,
  onJoin,
  onBack,
  room
}) {
  const [pw, setPW] = React.useState("");

  function hdlChange(e) {
    if (!/^\d+$/.test(e.target.value)) return;

    setPW(e.target.value);
  }

  return <>
    <form onSubmit={e => {
      e.preventDefault();
      if (pw === "") return;

      onJoin({name: room.name, pw: pw});
    }}>
      <label htmlFor='pwInp'>
        Password for room "{room.name}"
      </label>
      <input value={pw} onChange={hdlChange}/>
      <button type="submit">Join</button>
    </form>
  </>
}