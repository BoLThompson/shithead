import React from 'react';

export default function Gather({
  room,
  socket,
  onBack
}) {
  const [state,setState] = React.useState({
    users:[],
    state:"gathering",
  })

  const [chat, setChat] = React.useState([]);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    //get updates about the current room
    socket.on("roomDetails", (d) => {
      setState(d);
    });

    socket.on("chat", (msg) => {
      setChat(oldChat => [
        ...oldChat,
        msg,
      ])
    });

    //"bring me up to speed, man"
    socket.emit("queryRoom", {}, setState);

    return () => {
      socket.removeAllListeners("queryRoom");
      socket.removeAllListeners("chat");
    }
  }, [])

  function hdlBack() {
    //announce departure like an old man in a facebook group
    socket.emit("tolobby");

    onBack();
  }

  function hdlMsgChange(e) {
    setMsg(e.target.value);
  }

  function sendMsg() {
    socket.emit("chat", msg);
    setMsg("");
  }

  return <>
    <div>
      Room: {room.name}
    </div>
    Users:
    <ul>
      {state.users.map((u,k) =>
        <li key={k}>
          {u.name}
        </li>
      )}
    </ul>
    Chat:
    <div>
      {chat.map((c,k) =>
        <div key={k}>
          {c.user}: {c.msg}
        </div>
      )}
    </div>
    <div>
      <input 
        value={msg}
        onChange={hdlMsgChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMsg();
        }}
      />
      <button onClick={sendMsg}>
        Send
      </button>
    </div>
    <button
      onClick={hdlBack}
    >
      Leave Room
    </button>
  </>
}