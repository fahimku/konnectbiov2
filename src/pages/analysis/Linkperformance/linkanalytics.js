import React from "react";
import "antd/dist/antd.css";
import LinkDataComponent from "./LinkDataComponent";

class LinkAnalytic extends React.Component {
  state = {
    username: this.props.username,
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <h3>Link Performance</h3>
          <LinkDataComponent username={this.state.username} />
        </div>
      </React.Fragment>
    );
  }
}
export default LinkAnalytic;
