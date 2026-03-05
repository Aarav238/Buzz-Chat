import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { LuLoader2 } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';
import BuzzLogo from '../components/BuzzLogo';

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState({
    username: "", email: "", password: "", confirmPassword: ""
  })

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) navigate("/");
  }, []);

  const getClientLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        ip:      data.ip           || "",
        city:    data.city         || "",
        region:  data.region       || "",
        country: data.country_name || "",
      };
    } catch {
      return {};
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      setLoading(true)
      try {
        const { password, username, email } = values;
        const location = await getClientLocation();
        const { data } = await axios.post(registerRoute, { username, email, password, location });
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate("/");
      } catch (err) {
        const msg = err.response?.data?.msg || "Something went wrong. Please try again.";
        toast.error(msg, toastOptions);
      } finally {
        setLoading(false)
      }
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions); return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters.", toastOptions); return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters.", toastOptions); return false;
    } else if (!email) {
      toast.error("Email is required.", toastOptions); return false;
    }
    return true;
  };

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  return (
    <>
      <PageWrapper>
        <Glow />
        <Card>
          <div className="brand">
            <BuzzLogo size={48} />
            <span className="brand-name">Buzz Chat</span>
          </div>
          <h2 className="title">Create account</h2>
          <p className="subtitle">Join the conversation today</p>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <div className="input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className="input-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <button type="submit" className="btn-primary">
              {loading ? <LuLoader2 className="loader" /> : "Create Account"}
            </button>
          </form>
          <p className="switch-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Card>
      </PageWrapper>
      <ToastContainer />
    </>
  );
}

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
`;

const Glow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
  pointer-events: none;
`;

const Card = styled.div`
  width: 400px;
  padding: 40px;
  background: var(--color-surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow-card), 0 0 60px rgba(124,58,237,0.08);
  position: relative;
  z-index: 1;
  animation: popIn 0.35s ease;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 6px;
  }

  .subtitle {
    font-size: 13px;
    color: var(--color-text-3);
    text-align: center;
    margin-bottom: 28px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;

    .eye-btn {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: var(--color-text-3);
      padding: 0;
      transition: color 0.2s;
      svg { font-size: 18px; }
      &:hover { color: var(--color-text-2); }
    }
  }

  input {
    width: 100%;
    height: 48px;
    background: var(--color-input);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0 42px 0 16px;
    color: var(--color-text);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder { color: var(--color-text-3); }
    &:focus {
      outline: none;
      border-color: var(--border-active);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }
  }

  .btn-primary {
    height: 48px;
    width: 100%;
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
    justify-content: center;
    margin-top: 6px;
    transition: opacity 0.2s, box-shadow 0.2s, transform 0.1s;

    &:hover {
      opacity: 0.9;
      box-shadow: var(--shadow-glow);
      transform: translateY(-1px);
    }
    &:active { transform: translateY(0); }

    .loader {
      font-size: 20px;
      animation: spin 1s linear infinite;
    }
  }

  .switch-link {
    text-align: center;
    font-size: 13px;
    color: var(--color-text-3);
    margin-top: 20px;

    a {
      color: var(--color-primary-light);
      text-decoration: none;
      font-weight: 500;
      &:hover { color: var(--color-accent); }
    }
  }

  @media (max-width: 480px) {
    width: 90vw;
    padding: 32px 24px;
  }
`;

export default Register;
