import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes"
import ChatInput from './ChatInput';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateChip = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
};

export default function ChatContainer({ currentChat, currentUser, socket, arrivalMessage, onMessageSent, onBack }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };
    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    setMessages(prev => [...prev, { fromSelf: true, message: msg, createdAt: new Date() }]);
    onMessageSent(currentChat._id);
  };

  // only apply arrival messages that belong to the current chat
  useEffect(() => {
    if (arrivalMessage && arrivalMessage.from === currentChat?._id) {
      setMessages(prev => [...prev, { fromSelf: false, message: arrivalMessage.message, createdAt: new Date() }]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              {onBack && (
                <button className="back-btn" onClick={onBack} aria-label="Back">
                  <BackIcon />
                </button>
              )}
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="user-info">
                <h3 className="username">{currentChat.username}</h3>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => {
              const showDateChip = !isSameDay(message.createdAt, messages[index - 1]?.createdAt);
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  {showDateChip && (
                    <div className="date-chip-row">
                      <span className="date-chip">{formatDateChip(message.createdAt)}</span>
                    </div>
                  )}
                  <div className={`message-row ${message.fromSelf ? "sent" : "received"}`}>
                    <div className="bubble">
                      <p>{message.message}</p>
                      <span className="timestamp">{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);

  .chat-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: var(--color-sidebar);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;

    .user-details {
      display: flex;
      align-items: center;
      gap: 12px;

      .back-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 50%;
        color: var(--color-text-2);
        transition: background 0.2s, color 0.2s;
        flex-shrink: 0;

        &:hover { background: var(--color-surface-2); color: var(--color-text); }

        @media (max-width: 768px) { display: flex; }
      }

      .avatar img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--color-surface-2);
      }

      .user-info .username {
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text);
      }
    }
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.07);
      border-radius: 3px;
    }

    .date-chip-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 12px 0 6px;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border);
        opacity: 0.5;
      }

      .date-chip {
        font-size: 11px;
        font-weight: 500;
        color: var(--color-text-3);
        background: var(--color-surface);
        border: 1px solid var(--border);
        border-radius: 99px;
        padding: 3px 12px;
        white-space: nowrap;
        flex-shrink: 0;
      }
    }

    .message-row {
      display: flex;
      animation: fadeInUp 0.18s ease;

      &.sent {
        justify-content: flex-end;
        .bubble {
          background: var(--gradient-sent);
          color: #fff;
          border-radius: 18px 18px 4px 18px;
          box-shadow: 0 2px 12px rgba(124,58,237,0.35);
        }
      }

      &.received {
        justify-content: flex-start;
        .bubble {
          background: var(--color-surface);
          color: var(--color-text);
          border-radius: 18px 18px 18px 4px;
          border: 1px solid var(--border);
        }
      }

      .bubble {
        max-width: 62%;
        padding: 10px 14px 7px;
        font-size: 14px;
        line-height: 1.55;
        word-break: break-word;

        p { margin: 0 0 4px; }

        .timestamp {
          display: block;
          font-size: 10px;
          opacity: 0.55;
          text-align: right;
          margin-top: 2px;
          letter-spacing: 0.2px;
        }
      }
    }
  }
`;
