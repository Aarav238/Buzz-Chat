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
export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const[loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  
  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) { 
      navigate("/login");
    }
  }, []);


  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      setLoading(false)
      toast.error("Please select an avatar", toastOptions);
    } else {
      setLoading(true)
      const user = await JSON.parse(
        localStorage.getItem("chat-app-user")
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
            "chat-app-user",
          JSON.stringify(user)
        );
        setLoading(false)
        navigate("/");
      } else {
        setLoading(false)
        toast.error("Error setting avatar. Please try again.Double Click on button ", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchdata called");
      const data = [];
      
      try {
        const genders = ['male', 'male', 'female', 'female'];
        // Using DiceBear API instead of Multiavatar
        for (let i = 0; i < 4; i++) {
          console.log(i);
          // DiceBear offers various collections like 'avataaars', 'bottts', 'identicon', 'micah', etc.
          const style = "avataaars"; // You can change this to any other style
          const randomSeed = Math.round(Math.random() * 10000);
          const gender = genders[i];

          const response = await axios.get(
            `https://api.dicebear.com/7.x/${style}/svg?seed=${randomSeed}&gender=${gender}`,
            { responseType: 'arraybuffer' }
          );
          
          console.log("Avatar fetched for seed:", randomSeed);
          const buffer = Buffer.from(response.data, 'binary');
          data.push(buffer.toString("base64"));
          console.log(data);
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
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">

            {
            avatars.map((avatar, index) => {
              return (
                <div
                key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
           {loading ? <LuLoader2 className="loader-icon"/> :  "Set as Profile Picture"}
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
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  
  .loader-icon {
    animation: spin 1s linear infinite;

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
}

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
       
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;