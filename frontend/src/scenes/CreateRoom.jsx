import React from 'react';

export default function CreateRoom({
  hostname,
  socket,
  onBack,
  onCreate
}) {
  const [state, setState] = React.useState({
    name:`${hostname}'s room`,
    requirepw:false,
    pw:"",
  })

  function hdlSubmit(e) {
    e.preventDefault();

    socket.emit("makeroom", state, (response) => {
      if (response.accept) {
        onCreate(state);
      }
    });
  }

  function hdlChange(e) {
    //let's just restrict passwords to numerals
    if (e.target.name == "pw" && !/^\d+$/.test(e.target.value)) return;

    setState(prevState=>({
      ...prevState,
      [e.target.name]: 
        e.target.type == "checkbox" ?
          e.target.checked : e.target.value
    }))
  }

  return <>
    <form onSubmit={hdlSubmit}>
      <label htmlFor='roomNameInp'>
        Room name
      </label>
      <input
        id="roomNameInp"
        name="name"
        value={state.name}
        onChange={hdlChange}
      /><br/>
      <label htmlFor="requirePwInp">
        Require password
      </label>
      <input
        id="requirePwInp"
        name="requirepw"
        type="checkbox"
        checked={state.requirepw}
        onChange={hdlChange}
      /><br/>
      {
        state.requirepw ? 
        <>
          <label htmlFor='pwInp'>
            Room password
          </label>
          <input
            value={state.pw}
            name="pw"
            id="pwInp"
            onChange={hdlChange}
          />
        </>
          : 
        <></>
      }<br/>
      <button type="button" onClick={onBack}>
        Back
      </button>
      <button type="submit" onClick={hdlSubmit}>
        Create
      </button>
    </form>
  </>
}