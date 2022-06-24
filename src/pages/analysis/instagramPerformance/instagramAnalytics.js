import React from "react";
import "antd/dist/antd.css";
import InstagramDataComponent from "./instagramDataComponent";
import ConnectFb from "../../connectToFb/connFb";


const token = JSON.parse(localStorage.getItem("userInfo"))?.fb_token;
const fbPage = JSON.parse(localStorage.getItem("userInfo"))?.page_token;
class InstagramAnalytics extends React.Component {
  state = {
    username: this.props.username,
  };

  componentDidMount(){

  }

  render() {
    return (
      <>
        <div className="container-fluid">
          <h4 className="page-title">Post Performance</h4>
          {token == '' && fbPage == '' ?
        <ConnectFb/>
        :
        <>
          <InstagramDataComponent username={this.state.username} />
        </>
  }
        </div>
      </>
    );
  }
}
export default InstagramAnalytics;
