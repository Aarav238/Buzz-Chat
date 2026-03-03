import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import { LuLoader2 } from "react-icons/lu";
import BuzzLogo from '../components/BuzzLogo';

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) navigate("/login");
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }
    setLoading(true)
    const user = await JSON.parse(localStorage.getItem("chat-app-user"));
    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
      image: avatars[selectedAvatar],
    });
    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem("chat-app-user", JSON.stringify(user));
      setLoading(false)
      navigate("/");
    } else {
      setLoading(false)
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      try {
        const genders = ['male', 'male', 'female', 'female'];
        for (let i = 0; i < 4; i++) {
          const randomSeed = Math.round(Math.random() * 10000);
          const response = await axios.get(
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}&gender=${genders[i]}`,
            { responseType: 'arraybuffer' }
          );
          const buffer = Buffer.from(response.data, 'binary');
          data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader-gif" />
        </Container>
      ) : (
        <Container>
          <div className="brand">
            <BuzzLogo size={40} />
            <span className="brand-name">Buzz Chat</span>
          </div>
          <div className="title-container">
            <h1>Choose your avatar</h1>
            <p>Pick a profile picture that represents you</p>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar-card ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
                {selectedAvatar === index && <div className="check">✓</div>}
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            {loading ? <LuLoader2 className="loader-icon" /> : "Set as Profile Picture"}
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 32px;
  background: var(--color-bg);
  height: 100vh;
  width: 100vw;
  animation: fadeIn 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .loader-gif { max-inline-size: 100%; }

  .loader-icon {
    font-size: 20px;
    animation: spin 1s linear infinite;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;

    .brand-name {
      font-size: 20px;
      font-weight: 700;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .title-container {
    text-align: center;
    position: relative;
    z-index: 1;

    h1 {
      font-size: 22px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 6px;
    }
    p {
      font-size: 13px;
      color: var(--color-text-3);
    }
  }

  .avatars {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 1;

    .avatar-card {
      position: relative;
      width: 110px;
      height: 110px;
      border: 2px solid var(--border);
      border-radius: 20px;
      background: var(--color-surface);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s, box-shadow 0.2s;

      img { width: 72px; height: 72px; }

      &:hover {
        transform: translateY(-4px);
        border-color: rgba(124,58,237,0.4);
        box-shadow: 0 8px 24px rgba(124,58,237,0.2);
      }

      &.selected {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(124,58,237,0.25), 0 8px 24px rgba(124,58,237,0.25);
        background: rgba(124,58,237,0.08);
      }

      .check {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 22px;
        height: 22px;
        background: var(--gradient-brand);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: white;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(124,58,237,0.5);
      }
    }
  }

  .submit-btn {
    height: 48px;
    padding: 0 40px;
    background: var(--gradient-brand);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
    transition: opacity 0.2s, box-shadow 0.2s, transform 0.1s;

    &:hover {
      opacity: 0.9;
      box-shadow: var(--shadow-glow);
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }
  }
`;
