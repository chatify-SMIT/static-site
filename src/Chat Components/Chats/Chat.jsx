import React, { useState, useEffect, useRef } from "react";
import "../../css/Chat.css";
import Call from "../Mini Components/call";
import VideoCall from "../Mini Components/VideoCall";
import AudioRecorder from "../Mini Components/mic";
import EmojiBox from "../Mini Components/emoji";
import { addMessage, getUserData } from "../../helper/helper";
import io from "socket.io-client";
import { SideBar, getsidedata, setseen } from "../../helper/helper";

const Chat = ({ sender, receiver, userMessages, arrivalMessage }) => {
  const [inputChange, setInputChange] = useState("");
  const [receiverData, setReceiverData] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const socketRef = useRef(null);
  socketRef.current = io(process.env.REACT_APP_API_URL);
  useEffect(() => {
    const scrollContainer = document.getElementById("scrollContainer");
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getUserData({ _id: receiver });
      setReceiverData(data);
    }
    fetchData();
  }, [receiver]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages(userMessages);
  }, [userMessages]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);
  useEffect(() => {
    setseen(sender, receiver);
  }, [arrivalMessage]);
  const handleChange = (e) => {
    setInputChange(e.target.value);
  };

  const sendMessage = async () => {
    try {
      const blockers = await addMessage(sender, receiver, inputChange);
      // Send the message to the recipient via the socket
      socketRef.current.emit("send-msg", {
        to: receiver,
        from: sender,
        content: inputChange,
        dataBlock: blockers,
      });

      setInputChange("");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sent: true,
          content: inputChange,
          time: blockers.data.time,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEmojiSelect = (emoji) => {
    setInputChange((prevText) => prevText + emoji);
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13 || event.which === 13) {
      sendMessage();
    }
  };
  return (
    <div className="chat-window">
      <div className="chat-header d-flex flex-row ">
        <div className=" headico py-2 px-2  d-lg-none">
          {" "}
          <i className="fas fa-arrow-left"></i>
        </div>
        <img className="avatar" src={receiverData.avatar} />
        <div className="contact-info w-50 d-flex flex-column ">
          <div className="name">
            {receiverData.firstName} {receiverData.lastName}
          </div>
          <div className="status"></div>
        </div>
        <div className="contact-info w-50   d-flex justify-content-end">
          <VideoCall />
          <Call />
          <div className="line d-none d-lg-block"></div>
          <div className="headico px-lg-3 py-lg-2 d-none d-lg-block  mx-lg-2  ">
            <i className="la la-search fs-2"></i>
          </div>
        </div>
      </div>
      <div id="scrollContainer" className="chat-messages">
        {console.log(messages)}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message m-2 px-3 py-2 ${
              message.sent ? "sent" : "received"
            }`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time mt-1">{message.time}</div>
          </div>
        ))}
      </div>
      <div></div>
      <div className="chat-input d-flex align-items-center ">
        <EmojiBox onEmojiSelect={handleEmojiSelect} />
        <div className="headico py-lg-3 d-flex justify-content-center align-items-center px-lg-3 mx-2">
          <i className="icon-paper-clip fs-5"></i>
        </div>
        <div className="inputbox py-lg-3 d-flex justify-content-center align-items-center  mx-lg-1 ">
          <input
            className="w-100"
            type="text"
            value={inputChange}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message"
          />
        </div>
        <div className={inputChange ? "sendico" : "nomicroico"}>
          <div
            onClick={sendMessage}
            className="headico py-lg-3 d-flex justify-content-center align-items-center px-lg-3 mx-2"
          >
            <i className="icon-paper-plane"></i>
          </div>
        </div>
        <div className={inputChange ? "nosendico" : "microico"}>
          {" "}
          <AudioRecorder />
        </div>
      </div>
    </div>
  );
};
export default Chat;
