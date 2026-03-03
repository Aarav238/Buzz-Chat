import React from 'react'
import styled from 'styled-components'
import Robot from "../assets/robot.gif"

export default function Welcome({ currentUser }) {
  return (
    <Container>
      <img src={Robot} alt="Welcome" className="robot" />
      <div className="text">
        <h2>
          Hey <span className="name">{currentUser?.username}</span>, welcome back!
        </h2>
        <p>Select a conversation from the sidebar to start chatting.</p>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  gap: 20px;
  background: var(--color-bg);
  animation: fadeIn 0.35s ease;

  .robot {
    height: 150px;
    opacity: 0.85;
  }

  .text {
    text-align: center;

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 6px;
    }

    .name {
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      font-size: 13px;
      color: var(--color-text-3);
    }
  }
`;
