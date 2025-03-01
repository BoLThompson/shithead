import React from 'react';

export default function NameEntry({
  socket,
  onPick
}) {
  const [name, setName] = React.useState("")

  function hdlChange(e) {
    setName(e.target.value);
  }

  return <div>
    <form onSubmit={e => {
      e.preventDefault();
      
      socket.emit("pickname", name, response => {
        if (response.accept) {
          onPick(name);
        }
      })
    }}>
      <label htmlFor='nameInp'>
        Your name:
      </label>
      <input
        id="nameInp"
        name="name"
        value={name}
        onChange={hdlChange}
      />
      <button type="submit">
        Submit
      </button>
    </form>
  </div>
}