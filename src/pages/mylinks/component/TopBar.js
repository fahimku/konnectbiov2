import React from "react";
const TopBar = ({username, copyToClipboard, url}) => {
  return (
    <div className="left-top-bar">
      <div className="your-copy-link">
        <div className="item-a">
          Your Link:{" "}
          <a target="_blank" href={url + username}>
            {url + username}
          </a>
        </div>
        <div onClick={copyToClipboard} className="item-b">
          Copy
        </div>
      </div>

      <div className="instagram-bio">
        <button>Add to Instagram Bio</button>
      </div>
    </div>
  );
};

export default TopBar;
