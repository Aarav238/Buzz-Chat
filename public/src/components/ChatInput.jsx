import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (event, emojiObject) => {
    setMsg(prev => prev + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="emoji-wrap">
        <button
          type="button"
          className="emoji-btn"
          onClick={() => setShowEmojiPicker(p => !p)}
        >
          <BsEmojiSmileFill />
        </button>
        {showEmojiPicker && (
          <div className="picker-float">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <form className="input-row" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Write a message..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit" className="send-btn">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--color-sidebar);
  border-top: 1px solid var(--border);
  height: 64px;
  flex-shrink: 0;

  .emoji-wrap {
    position: relative;
    flex-shrink: 0;

    .emoji-btn {
      width: 38px;
      height: 38px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;

      svg {
        font-size: 20px;
        color: var(--color-text-3);
        transition: color 0.2s;
      }

      &:hover {
        background: var(--color-surface-2);
        svg { color: var(--color-primary-light); }
      }
    }

    .picker-float {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      z-index: 100;
      max-width: calc(100vw - 32px);

      @media (max-width: 480px) {
        left: 50%;
        transform: translateX(-50%);
      }

      .emoji-picker-react {
        background: var(--color-surface) !important;
        border: 1px solid var(--border-active) !important;
        box-shadow: 0 8px 40px rgba(0,0,0,0.6) !important;
        border-radius: 16px !important;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          width: 4px;
          &-thumb { background: rgba(124,58,237,0.4); }
        }
        .emoji-categories button { filter: contrast(0) brightness(2); }
        .emoji-search {
          background: var(--color-input);
          border: 1px solid var(--border);
          color: var(--color-text);
          border-radius: 8px;
        }
        .emoji-group:before {
          background: var(--color-surface);
          color: var(--color-text-3);
        }
      }
    }
  }

  .input-row {
    flex: 1;
    display: flex;
    align-items: center;
    background: var(--color-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 0 6px 0 18px;
    gap: 6px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
      border-color: var(--border-active);
      box-shadow: 0 0 0 2px rgba(124,58,237,0.12);
    }

    input {
      flex: 1;
      height: 42px;
      background: none;
      border: none;
      color: var(--color-text);
      font-size: 14px;
      font-family: 'Inter', sans-serif;

      &::placeholder { color: var(--color-text-3); }
      &:focus { outline: none; }
      &::selection { background: rgba(124,58,237,0.3); }
    }

    .send-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--gradient-brand);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: box-shadow 0.2s, transform 0.1s;

      svg {
        font-size: 17px;
        color: white;
      }

      &:hover {
        box-shadow: 0 0 16px rgba(124,58,237,0.55);
        transform: scale(1.06);
      }
      &:active { transform: scale(0.95); }
    }
  }
`;
