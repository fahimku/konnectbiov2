import React from "react";
import "antd/dist/antd.css";
import PostDataComponent from "./PostDataComponent";

class PostAnalytic extends React.Component {
  state = {
    username: this.props.username,
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <h4 className="page-title">BioShop Performance</h4>
          <PostDataComponent username={this.state.username} />
        </div>
      </>
    );
  }
}
export default PostAnalytic;
