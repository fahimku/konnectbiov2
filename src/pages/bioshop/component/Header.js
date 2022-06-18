import React from "react";

const Header = ({ username, placeholder }) => {
  return (
    <div className="header bg-white">
      <div className="linkin-text">Konnect.Bio</div>
      <div className="profile">
        <div className="placeholder">
          <img src={placeholder} alt="logo" />
        </div>
        <div className="instagram-account">
          <div className="instagram-username">@{username}</div>
          <div className="instagram-label">Instagram</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
