import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
//import {Redirect} from "react-router";
import config from "../../../config";
import { connect } from "react-redux";
import { Alert, Button } from "reactstrap";
import Widget from "../../../components/Widget";
import { loginUser, receiveToken } from "../../../actions/auth";
import jwt from "jsonwebtoken";
// import microsoft from '../../../images/microsoft.png';
import { push } from "connected-react-router";
import logo from "../../../images/konnectbiologo.svg";
import queryString from "query-string";
import { toast } from "react-toastify";

import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

class Verify extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!config.isBackend && token) return true;
    if (!token) return;
    const date = new Date().getTime() / 1000;
    const data = jwt.decode(token);
    if (!data) return;
    return date < data.exp;
  }

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.doLogin = this.doLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  doLogin(e) {
    e.preventDefault();
    this.props.dispatch(
      loginUser({ email: this.state.email, password: this.state.password })
    );
  }

  componentDidMount() {
    
    const query = queryString.parse(window.location.search);

    if (query.bio_code && query.email) {
      this.tokenVerify(query.bio_code, query.email);
    }
    //const params = new URLSearchParams(this.props.location.search);
    const token = localStorage.getItem("token");
    if (token) {
      const instagramCodeUrl = window.location.href;
      console.log(instagramCodeUrl,"instagramCodeUrl");
      
      this.props.dispatch(receiveToken(token));
      if (instagramCodeUrl.includes("code")) {
        const code = instagramCodeUrl.split("?")[1].split("=");
        this.props.history.push("/app/linkinbio/?code=" + code[1]);
      }
      //      this.props.dispatch(doInit());
    }
  }

  tokenVerify = async (code, email) => {
    const endPoint = config.baseURLApiToken + "/verify?email=" + email;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + code,
      },
    };
    fetch(endPoint, requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      });
  };

  signUp() {
    this.props.dispatch(push("/register"));
  }

  render() {
    return (
      <div className="auth-page">
        <div class="login_header">
          <div class="header_inr group">
            <div class="header_inr_left">
              <div class="konnect_logo">
                <img className="logo" src={logo} alt="logo" />
              </div>
              <h3 class="kon_pg_title">Sign In</h3>
            </div>
            <div class="header_inr_right">
              <div class="create_account">
                <span>Already have an account?</span>&nbsp;
                <a href="/login">Sign in</a>
              </div>
            </div>
          </div>
        </div>

        <div className="custome_container_auth_ift">
          <div class="custome_container_auth_inr">
            <Widget
              className="custome_login custome_signup"
              title={<h3 className="mt-0">Sign In</h3>}
            >
              <form className="mt" onSubmit={this.doLogin}>
                {this.props.errorMessage && (
                  <Alert className="alert-sm" color="danger">
                    {this.props.errorMessage}
                  </Alert>
                )}
                <div className="form-group">
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={this.changeEmail}
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    value={this.state.password}
                    onChange={this.changePassword}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </div>

                <Button
                  type="submit"
                  color="inverse"
                  className="register_button"
                  size="lg"
                >
                  {this.props.isFetching ? "Loading..." : "Sign In"}
                </Button>
              </form>
              <p className="already">
                New to KonnectBio? &nbsp;
                <span
                  className="text-center link"
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  Create an Account
                </span>
              </p>
              <span
                className="decoration text-center link"
                onClick={() => {
                  history.push("/forgot");
                }}
              >
                Forgot password?
              </span>
            </Widget>
            <div class="login_right signup_right">
              <h3>Maximize Possibilities with KonnectBio</h3>
            </div>
          </div>
        </div>
      </div>
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
export default withRouter(connect(mapStateToProps)(Verify));
