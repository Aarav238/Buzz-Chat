import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <Btn onClick={handleClick} title="Sign out">
      <BiPowerOff />
    </Btn>
  )
}

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s, transform 0.1s;

  svg {
    font-size: 14px;
    color: #F87171;
  }

  &:hover {
    background: rgba(239,68,68,0.18);
    border-color: rgba(239,68,68,0.35);
    box-shadow: 0 0 12px rgba(239,68,68,0.2);
    transform: scale(1.07);
  }

  &:active { transform: scale(0.95); }
`;
