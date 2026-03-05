import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';

export default function Logout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Tooltip>
        <Btn onClick={() => setShowModal(true)}>
          <BiPowerOff />
        </Btn>
        <span className="tip">Sign out</span>
      </Tooltip>

      {showModal && (
        <Overlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <div className="icon-wrap">
              <BiPowerOff />
            </div>
            <h3>Sign out?</h3>
            <p>You'll need to sign back in to access your chats.</p>
            <div className="actions">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm" onClick={handleConfirm}>Sign out</button>
            </div>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

const Tooltip = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .tip {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: #1E293B;
    color: #F8FAFC;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 6px;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    pointer-events: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.15s, transform 0.15s;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 10px;
      border: 4px solid transparent;
      border-top-color: #1E293B;
    }
  }

  &:hover .tip {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease;
`;

const Modal = styled.div`
  background: #1E293B;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px 28px;
  width: 320px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: popIn 0.2s ease;

  .icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;

    svg {
      font-size: 22px;
      color: #F87171;
    }
  }

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: #F8FAFC;
    margin: 0;
  }

  p {
    font-size: 13px;
    color: #94A3B8;
    text-align: center;
    margin: 0 0 8px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 4px;

    button {
      flex: 1;
      height: 42px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      border: none;

      &:hover { opacity: 0.88; transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    }

    .cancel {
      background: rgba(255,255,255,0.06);
      color: #94A3B8;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .confirm {
      background: #EF4444;
      color: #fff;
      box-shadow: 0 4px 14px rgba(239,68,68,0.35);
    }
  }
`;
