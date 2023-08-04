import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Picker from "emoji-picker-react";

const EmojiBox = ({ onEmojiSelect }) => {
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const handleEmojiSelect = (emoji) => {
    setChosenEmoji(emoji.emoji);
    onEmojiSelect(emoji.emoji);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      className="headico py-lg-3 d-flex justify-content-center mx-2 align-items-center px-lg-3"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </div>
  ));

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          as={CustomToggle}
          drop={"down"}
          id="dropdown-custom-components"
        >
          <i className="icon-emotsmile fs-5"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Picker onEmojiClick={handleEmojiSelect} />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default EmojiBox;
