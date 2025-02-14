// Card.js
import React from 'react';
import styled from 'styled-components';

const Card = ({ name, aboutMe, profilePic }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <button className="mail">
          <svg
            className="lucide lucide-mail"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth={3}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
            height={24}
            width={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect rx={2} y={4} x={2} height={16} width={20} />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </button>
        <div className="profile-pic">
          <img src={profilePic} alt={name} />
        </div>
        <div className="bottom">
          <div className="content">
            <span className="name">{name}</span>
            <span className="about-me">{aboutMe}</span>
          </div>
          <div className="bottom-bottom">
            <div className="social-links-container">
              <span className="name">{name}</span>
            </div>
            <button className="button">Follow Me</button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 205px;
    height: 205px;
    background: white;
    border-radius: 18px;
    padding: 3px;
    position: relative;
    box-shadow: #604b4a30 0px 40px 20px -30px;
    transition: all 0.5s ease-in-out;
  }

  .card .mail {
    position: absolute;
    right: 18px;
    top: 13px;
    background: transparent;
    border: none;
  }

  .card .mail svg {
    stroke: #4a90e2;
    stroke-width: 3px;
  }

  .card .mail svg:hover {
    stroke: #357ABD;
  }

  .card .profile-pic {
    position: absolute;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    border-radius: 17px;
    z-index: 1;
    border: 0px solid #4a90e2;
    overflow: hidden;
    transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
  }

  .card .profile-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .card .bottom {
    position: absolute;
    bottom: 3px;
    left: 3px;
    right: 3px;
    background: #4a90e2;
    top: 80%;
    border-radius: 17px;
    z-index: 2;
    box-shadow: rgba(96, 75, 74, 0.19) 0px 3px 3px 0px inset;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  .card .bottom .content {
    position: absolute;
    bottom: 0;
    left: 14px;
    right: 14px;
    height: 90px;
  }

  .card .bottom .content .name {
    display: block;
    font-size: 0.8rem;
    color: white;
    font-weight: bold;
  }

  .card .bottom .content .about-me {
    display: block;
    font-size: 0.5rem;
    color: white;
    margin-top: 0.6rem;
  }

  .card .bottom .bottom-bottom {
    position: absolute;
    bottom: 8px;
    left: 14px;
    right: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card .bottom .bottom-bottom .social-links-container {
    display: flex;
    gap: 8px;
  }

  .card .bottom .bottom-bottom .social-links-container svg {
    height: 12px;
    fill: white;
    filter: drop-shadow(0 3px 3px rgba(165, 132, 130, 0.13));
  }

  .card .bottom .bottom-bottom .social-links-container svg:hover {
    fill: #357ABD;
    transform: scale(1.2);
  }

  .card .bottom .bottom-bottom .button {
    background: white;
    color: #4a90e2;
    border: none;
    border-radius: 12px;
    font-size: 0.5rem;
    padding: 4px 6px;
    box-shadow: rgba(165, 132, 130, 0.13) 0px 3px 3px 0px;
  }

  .card .bottom .bottom-bottom .button:hover {
    background: #357ABD;
    color: white;
  }

  .card:hover {
    border-top-left-radius: 32px;
  }

  .card:hover .bottom {
    top: 20%;
    border-radius: 46px 17px 17px 17px;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }

  .card:hover .profile-pic {
    width: 57px;
    height: 57px;
    aspect-ratio: 1;
    top: 6px;
    left: 6px;
    border-radius: 50%;
    z-index: 3;
    border: 4px solid #4a90e2;
    box-shadow: rgba(96, 75, 74, 0.19) 0px 3px 3px 0px;
    transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
  }

  .card:hover .profile-pic:hover {
    transform: scale(1.3);
    border-radius: 0px;
  }

  .card:hover .profile-pic img {
    transform: scale(2.5);
    object-position: 0px 14px;
    transition: all 0.5s ease-in-out 0.5s;
  }
`;

export default Card;
