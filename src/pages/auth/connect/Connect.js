import axios from "axios";
import React from "react";
import { Button, Row, Col, FormLabel } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../../images/konnectbiologo.svg";
import AccountSetup from "../../../pages/accountsetup/AccountSetup";
import { toast } from "react-toastify";

class Connect extends React.Component {
  constructor(props) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo?.package) {
      window.location.href = "/package";
    }
    super(props);

    this.state = {
      url: "",
      instagramCode: "",
      isInstagramConnected: false,
      username: "",
      errorInsta: "",
      cancelSubscription: false,
      resetAccount: false,
      fbPageLocal: "",
      pack: "",
      connectionMessage: "",
    };
  }

  async getInstagramUrl() {
    await axios
      .post(`/social/ig/url/instagram`)
      .then((response) => {
        this.setState({ url: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let access_token = userInfo?.access_token;
    const instagramCodeUrl = window.location.href;
  
    const fbPage = userInfo?.page_token;
    const package1 = userInfo?.package?.package_id;

    const checkCon =
      this.state.pack === "61c02e2ff40bec74fac2ca09" ||
      package1 === "61c02e2ff40bec74fac2ca09" ||
      this.state.pack === "61d695e9bccdaf69f46efc66" ||
      package1 === "61d695e9bccdaf69f46efc66"
        ? access_token !== "" && fbPage
          ? true
          : false
        : access_token !== ""
        ? true
        : false;

    if (!package1) {
      this.props.history.push("/package");
    } else if (checkCon) {
      this.props.history.push("/app/linkinbio");
    } else if (instagramCodeUrl.includes("code")) {
      const code = instagramCodeUrl.split("?")[1].split("=");
      this.setState({ instagramCode: code[1] });
      this.setState({ isInstagramConnected: true });
      this.fetchInstagramPostsFirstTime(code[1]);
    } 
    this.getInstagramUrl();
  }

  async fetchInstagramPostsFirstTime(token) {
    const userInformation = localStorage.getItem("userInfo");
    const parseUserInformation = JSON.parse(userInformation);
    await axios
      .post(`/social/ig/data/${token}`, { email: parseUserInformation.email })
      .then((response) => {
        localStorage.setItem("access_token", response.data.access_token);
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        parseUserInformation.username = response.data.username;
        this.setState({ username: response.data.username });
        parseUserInformation.access_token = response.data.access_token;
        const storeUserInformation = JSON.stringify(parseUserInformation);
        localStorage.setItem("userInfo", storeUserInformation);
        this.updateAccessToken(
          userInfo.user_id,
          response.data.username,
          response.data.access_token
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          autoClose: false,
        });
        this.setState({
          errorInsta: err.response.data.message,
          instagramCode: "",
        });

        // }
      });
 
    }

  

  //First Request From User
  async updateAccessToken(user_id, username, accessToken) {
    await axios.put(`/users/revise/ig/instagram`, {
      user_id: user_id,
      username: username,
      access_token: accessToken,
    });
  }

  completeProcess = () => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let access_token = userInfo?.access_token;

    const package1 = JSON.parse(localStorage.getItem("userInfo"))?.package
      ?.package_id;
    if (
      this.state.pack === "61c02e2ff40bec74fac2ca09" ||
      package1 === "61c02e2ff40bec74fac2ca09" ||
      this.state.pack === "61d695e9bccdaf69f46efc66" ||
      package1 === "61d695e9bccdaf69f46efc66"
    ) {
      const fbPage = JSON.parse(localStorage.getItem("userInfo")).page_token;
      // const fbToken =  JSON.parse(localStorage.getItem("userInfo")).fb_token;
      return access_token === ""
        ? true
        : fbPage || this.state.fbPageLocal
        ? false
        : true;
    } else {
      const insta = this.state.instagramCode === "" ? true : false;
      return insta;
    }
  };

  connectionMessage = () => {
    const package1 = JSON.parse(localStorage.getItem("userInfo"))?.package
      ?.package_id;
    if (package1 === "61c02d43f40bec74fac2c9a0" && this.completeProcess()) {
      return "Please connect your Instagram account";
    } else if (
      package1 === "61c02e2ff40bec74fac2ca09" &&
      this.completeProcess()
    ) {
      return "Please connect your Instagram and Facebook account";
    } else if (
      package1 === "61d695e9bccdaf69f46efc66" &&
      this.completeProcess()
    ) {
      return "Please connect your Instagram and Facebook account";
    }
  };
  render() {

    return (
      <>
        <div className="login_header">
          <div className="header_inr group">
            <div className="header_inr_left">
              <div className="konnect_logo">
                <img className="logo" src={logo} alt="logo" />
              </div>
            </div>
            <div className="header_inr_right">
              <div className="create_account">
                <Button
                  className="btn-connect"
                  onClick={() => this.props.history.push("/logout")}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
        <AccountSetup
          connectPage={true}
          resetAccount={this.state.resetAccount}
          cancelSubscription={this.state.cancelSubscription}
          className="connect-page-inner"
          username={this.state.username}
          isInstagramConnected={this.state.isInstagramConnected}
          url={this.state.url}
          errorInsta={this.state.errorInsta}
          setFbPageLocal={(fbPage) => this.setState({ fbPageLocal: fbPage })}
          setPackage={(pack) => this.setState({ pack: pack })}
        />
        <div className="connect-page">
          <div className="p-0">
            <Row>
              <Col md={12} className="connect-button-cs">
                <Button
                  disabled={this.completeProcess()}
                  onClick={() => {
                    this.props.history.push(
                      `/app/linkinbio/${this.state.instagramCode}`
                    );
                  }}
                  variant="primary"
                  type="submit"
                  className="category-btn btn-block"
                >
                  Continue
                </Button>
              </Col>

              <FormLabel className="label-insta col-md-12">
                {this.connectionMessage()}
              </FormLabel>
            </Row>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}
export default withRouter(connect(mapStateToProps)(Connect));
