import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BuzzLogo from './BuzzLogo';
import Logout from './Logout';

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser])

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const filteredContacts = contacts.filter(c =>
    c?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="sidebar-top">
            <div className="brand">
              <BuzzLogo size={32} />
              <span className="brand-name">Buzz Chat</span>
            </div>
          </div>

          <div className="search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="section-label">Messages</div>

          <div className="contacts-list">
            {filteredContacts.map((contact, index) => (
              <div
                className={`contact-item ${index === currentSelected ? "active" : ""}`}
                key={index}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt={contact.username}
                  />
                </div>
                <div className="info">
                  <span className="name">{contact.username}</span>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <p className="empty">No contacts found</p>
            )}
          </div>

          <div className="current-user">
            <div className="cu-left">
              <div className="cu-avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt={currentUserName}
                />
              </div>
              <span className="cu-name">{currentUserName}</span>
            </div>
            <Logout />
          </div>
        </Container>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-sidebar);
  overflow: hidden;

  .sidebar-top {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;

    .brand {
      display: flex;
      align-items: center;
      gap: 9px;

      .brand-name {
        font-size: 15px;
        font-weight: 700;
        background: var(--gradient-brand);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  .search-wrap {
    position: relative;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    display: flex;
    align-items: center;

    .search-icon {
      position: absolute;
      left: 24px;
      color: var(--color-text-3);
      pointer-events: none;
    }

    input {
      width: 100%;
      height: 36px;
      background: var(--color-input);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0 12px 0 34px;
      color: var(--color-text);
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      transition: border-color 0.2s, box-shadow 0.2s;

      &::placeholder { color: var(--color-text-3); }
      &:focus {
        outline: none;
        border-color: var(--border-active);
        box-shadow: 0 0 0 2px rgba(124,58,237,0.12);
      }
    }
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 12px 16px 6px;
    flex-shrink: 0;
  }

  .contacts-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
    }

    .empty {
      text-align: center;
      color: var(--color-text-3);
      font-size: 13px;
      padding: 24px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.15s;
      margin-bottom: 2px;

      &:hover { background: rgba(255,255,255,0.04); }

      &.active {
        background: rgba(124,58,237,0.15);
        .name { color: #C4B5FD; }
      }

      .avatar {
        flex-shrink: 0;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-surface-2);
        }
      }

      .info {
        flex: 1;
        min-width: 0;

        .name {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .current-user {
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: var(--color-bg);

    .cu-left {
      display: flex;
      align-items: center;
      gap: 9px;
      min-width: 0;

      .cu-avatar img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--color-surface-2);
      }

      .cu-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text-2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;
