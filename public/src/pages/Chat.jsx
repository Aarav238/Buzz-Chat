import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoutes, host, subscribePushRoute, VAPID_PUBLIC_KEY } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import notifSound from '../assets/fahhhhh.mp3';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // refs so socket handler always sees latest values without re-subscribing
  const currentChatRef = useRef(currentChat);
  const contactsRef = useRef([]);
  const isTabVisible = useRef(true);
  const totalUnreadRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    fetchData();
  }, [])

  // keep refs in sync
  useEffect(() => { currentChatRef.current = currentChat; }, [currentChat]);
  useEffect(() => { contactsRef.current = contacts; }, [contacts]);

  // tab visibility tracking + title reset
  useEffect(() => {
    const handleVisibility = () => {
      isTabVisible.current = document.visibilityState === 'visible';
      if (isTabVisible.current) {
        document.title = 'Buzz Chat';
        totalUnreadRef.current = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // request notification permission + register push subscription
  useEffect(() => {
    if (!currentUser) return;
    const setup = async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }
      if (permission !== 'granted') return;
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        const subscription = existing || await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        await axios.post(subscribePushRoute, { userId: currentUser._id, subscription });
      } catch (err) {
        console.error('Push setup failed:', err);
      }
    };
    setup();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      socket.current.on("msg-recieve", ({ from, message }) => {
        setArrivalMessage({ fromSelf: false, message, from });

        // bubble contact to top
        setContacts(prev => {
          const idx = prev.findIndex(c => c._id === from);
          if (idx === -1) return prev;
          return [prev[idx], ...prev.filter((_, i) => i !== idx)];
        });

        const isChatOpen = currentChatRef.current?._id === from;

        // increment unread only if this chat is not currently open
        if (!isChatOpen) {
          setUnreadCounts(prev => ({ ...prev, [from]: (prev[from] || 0) + 1 }));

          // play sound
          const audio = new Audio(notifSound);
          audio.volume = 0.5;
          audio.play().catch(() => {});

          // update tab title
          totalUnreadRef.current += 1;
          document.title = `(${totalUnreadRef.current}) Buzz Chat`;

          // browser notification when tab is not visible
          if (!isTabVisible.current && Notification.permission === 'granted') {
            const sender = contactsRef.current.find(c => c._id === from);
            new Notification(sender?.username || 'Buzz Chat', {
              body: message,
              icon: '/favicon.svg',
              tag: from,
              renotify: true,
            });
          }
        }
      });
    }
  }, [currentUser])

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoutes}/${currentUser._id}`)
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchData();
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setSidebarOpen(false);
    setUnreadCounts(prev => ({ ...prev, [chat._id]: 0 }));
    // reset tab title if no other unread chats remain
    totalUnreadRef.current = 0;
    document.title = 'Buzz Chat';
  };

  // called by ChatContainer after a message is sent — bubbles contact to top
  const handleMessageSent = (contactId) => {
    setContacts(prev => {
      const idx = prev.findIndex(c => c._id === contactId);
      if (idx === -1) return prev;
      return [prev[idx], ...prev.filter((_, i) => i !== idx)];
    });
  };

  return (
    <Container>
      <div
        className={`overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          unreadCounts={unreadCounts}
        />
      </aside>
      <main className="main">
        <div className="mobile-bar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <span className="mobile-title">Buzz Chat</span>
        </div>
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
            arrivalMessage={arrivalMessage}
            onMessageSent={handleMessageSent}
          />
        )}
      </main>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: var(--color-bg);
  overflow: hidden;
  position: relative;

  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s;

    @media (max-width: 768px) {
      display: block;
      &.visible {
        opacity: 1;
        pointer-events: all;
      }
    }
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    height: 100vh;
    background: var(--color-sidebar);
    border-right: 1px solid var(--border);
    z-index: 20;
    transition: transform 0.25s ease;

    @media (max-width: 768px) {
      position: fixed;
      left: 0;
      top: 0;
      transform: translateX(-100%);
      &.open {
        transform: translateX(0);
        box-shadow: 4px 0 32px rgba(0,0,0,0.5);
      }
    }
  }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .mobile-bar {
    display: none;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--color-sidebar);
    border-bottom: 1px solid var(--border);

    @media (max-width: 768px) { display: flex; }

    .mobile-title {
      font-size: 15px;
      font-weight: 600;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hamburger {
      width: 34px;
      height: 34px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover { background: var(--color-surface-2); }

      span {
        display: block;
        width: 20px;
        height: 2px;
        background: var(--color-text-2);
        border-radius: 2px;
      }
    }
  }
`;

export default Chat;
