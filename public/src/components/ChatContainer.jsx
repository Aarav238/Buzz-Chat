import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes"
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
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
    setMessages(prev => [...prev, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages(prev => [...prev, arrivalMessage]);
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
            <Logout />
          </div>

          <div className="chat-messages">
            <div className="date-chip">Today</div>
            {messages.map((message) => (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message-row ${message.fromSelf ? "sent" : "received"}`}>
                  <div className="bubble">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  )
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

    .date-chip {
      align-self: center;
      font-size: 11px;
      font-weight: 500;
      color: var(--color-text-3);
      background: var(--color-surface);
      border: 1px solid var(--border);
      border-radius: 99px;
      padding: 3px 12px;
      margin-bottom: 8px;
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
        padding: 10px 14px;
        font-size: 14px;
        line-height: 1.55;
        word-break: break-word;

        p { margin: 0; }
      }
    }
  }
`;
