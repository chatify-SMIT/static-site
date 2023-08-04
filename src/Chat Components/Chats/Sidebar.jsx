import React, { useState, useEffect, useRef } from "react";
import "../../css/Sidebar.css";
import { SideBar, getsidedata, setseen } from "../../helper/helper";

import io from "socket.io-client";

/*
const MobileSidebar = ({ users, activeUserId, onSelectUser }) => {
  return (
      <div className="chats">
        {users.map((user) => (
          <div className={`chat ${user.selected ? 'selected' : ''}`} key={user.id}>
            <div className="profile-picture">
              <img src="https://picsum.photos/50" alt={user.name} />
            </div>
            <div className="chat-details">
              <div className="chat-name">{user.name}</div>
              <div className="last-message">{user.message}</div>
            </div>
            <div className={`${user.unread ? 'unread' : ''}`}>
                <div className="time top-0">{user.time}</div>
                <div className="d-flex   justify-content-end count-ht  mt-2"><span className={`${user.unread ? 'count' : 'counts'}`}>{user.count}</span></div>            
            </div>

          </div>
        ))}
      </div>
   
  );
};
*/

const NoResultsMessage = () => (
  <div className="d-flex justify-content-center align-items-center h-100">
    No results found.
  </div>
);

const Sidebar = ({ changeChat, arrivalMessages }) => {
  const [searchText, setSearchText] = useState("");
  const [activeUserId, setActiveUserId] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("username"));
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      console.log("FSDfs" + arrivalMessages);
      const response = await SideBar();
      console.log("SideBar response:", response);
      const a = response.data;
      const usersData = Array.isArray(a)
        ? await Promise.all(
            a
              .filter((item) => item._id !== userId)
              .map(async (item) => {
                const { seen, content, time, count, date } = await getsidedata(
                  userId,
                  item._id
                );
                console.log(date);
                return {
                  id: item._id,
                  name: item.userName,
                  lastName: item.lastName,
                  firstName: item.firstName,
                  avatar: item.avatar,
                  seen: seen,
                  content: content,
                  time: time,
                  count: count,
                  date: new Date(date).toISOString(),
                };
              })
          )
        : [];

      // Sorting the usersData array based on the 'date' property in descending order (latest to oldest)
      usersData.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("Users data:", usersData);
      setUsers(usersData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [arrivalMessages]);

  useEffect(() => {
    changeChat(activeUserId);
  }, [activeUserId]);

  const filteredChats = users.filter((user) =>
    (user.firstName + " " + user.lastName)
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleUserClick = async (clickedUserId) => {
    try {
      setActiveUserId(clickedUserId);
      await setseen(userId, clickedUserId);
      await fetchUsers(); // Fetch the updated user data
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sidebar">
      <div className="search-bar">
        <div className="search-bar-top d-flex">
          <div className="w-75">
            <span className="fs-4 fw-bold text-dark">Chats</span>
          </div>

          <div className="px-3 py-2 rounded-3 edit">
            <i className="far fa-edit"></i>
          </div>
          <div className="px-3 py-2 rounded-3 edit">
            <i className="icon-options"></i>
          </div>
        </div>
        <div className="mt-2">
          <input
            type="search"
            placeholder="Search or start a new chat"
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="chats">
        {filteredChats.length === 0 ? (
          <NoResultsMessage />
        ) : (
          filteredChats.map((user) => (
            <div
              className={`chat ${user.id === activeUserId ? "selected" : ""}`}
              key={user.id}
              onClick={() => handleUserClick(user.id)}
            >
              <div className="profile-picture">
                <img src={user.avatar} alt={user.name} />
              </div>
              <div className="chat-details">
                <div className="chat-name">
                  {user.firstName} {user.lastName}
                </div>
                <div
                  className={` top-0 ${
                    user.count === 0 ? "last-message" : "last-messages"
                  }`}
                >
                  {user.content && user.content.length > 25
                    ? user.content.substring(0, 25) + "..."
                    : user.content}
                </div>
              </div>
              <div className={`${user.unread ? "unread" : ""}`}>
                <div
                  className={` top-0 ${user.count === 0 ? "time" : "times"}`}
                >
                  {user.time}
                </div>
                <div className="d-flex justify-content-end count-ht mt-2">
                  <span className={`${user.count === 0 ? "counts" : "count"}`}>
                    {user.count}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { Sidebar };
