import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import Chat from "./Chat";
import DataBlank from "../DataBlank";
import { getUsername, SideBar, getMessage } from "../../helper/helper";
import io from "socket.io-client";
function ChatBox() {
  const [currentChat, setCurrentChat] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL);
    const userId = localStorage.getItem("username");
    socketRef.current.emit("add-user", userId);
    socketRef.current.on("msg-recieve", (msg) => {
      console.log(msg);
      setArrivalMessage({
        sent: false,
        content: msg.content,
        time: msg.time,
        users: msg.users,
      });
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    setSender(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    if (sender && currentChat) {
      getMessage({ from: sender, to: currentChat })
        .then((response) => {
          const userMessages = response.data.map((message) => {
            return {
              content: message.content,
              time: message.time,
              sent: message.sent,
              users: message.users,
            };
          });
          setUserMessages(userMessages);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentChat, sender]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <div className="d-flex w-100">
      <Sidebar changeChat={handleChatChange} arrivalMessages={arrivalMessage} />
      {currentChat ? (
        <Chat
          sender={sender}
          receiver={currentChat}
          userMessages={userMessages}
          arrivalMessage={
            arrivalMessage &&
            (arrivalMessage.users[0] == currentChat ||
              arrivalMessage.users[1] == currentChat)
              ? arrivalMessage
              : null
          }
        />
      ) : (
        <DataBlank />
      )}
    </div>
  );
}

export default ChatBox;
