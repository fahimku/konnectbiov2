import React from "react";
import "antd/dist/antd.css";
import InstagramDataComponent from "./instagramDataComponent";

class InstagramAnalytics extends React.Component {
  state = {
    username: this.props.username,
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <h4 className="page-title">Post Performance</h4>
          <InstagramDataComponent username={this.state.username} />
        </div>
      </>
    );
  }
}
export default InstagramAnalytics;
