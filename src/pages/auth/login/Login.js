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
import { push } from "connected-react-router";
import logo from "../../../images/konnectbiologo.svg";
import queryString from "query-string";
import { toast } from "react-toastify";
import { authError, authSuccess } from "../../../actions/auth";
import axios from "axios";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});
class Login extends React.Component {
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
      type: "password",
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

    if (query.sid) {
      this.getSidUrl(query.sid);
    }
    if (query.bio_code) {
      this.tokenVerify(query.bio_code);
    }
    //const params = new URLSearchParams(this.props.location.search);
    const token = localStorage.getItem("token");
    if (token) {
      const instagramCodeUrl = window.location.href;

      this.props.dispatch(receiveToken(token));
      if (instagramCodeUrl.includes("code")) {
        const code = instagramCodeUrl.split("?")[1].split("=");
        this.props.history.push("/app/account/setup/?code=" + code[1]);
      } else {
        this.props.history.push("/app/linkinbio");
      }
    }
  }
  getSidUrl = async (sid) => {
    await axios
      .post(`/signin/session`, { sid: sid })
      .then((res) => {
        console.log(res, "data");
        const token = res.data.message.token;
        const userInfo = {
          menu: res.data.message.menu,
          user_id: res.data.message.user_id,
          name: res.data.message.name,
          access_token: res.data.message.access_token,
          username: res.data.message.username,
          email: res.data.message.email,
          user_type: res.data.message.user_type,
          country: res.data.message.country,
          city: res.data.message.city,
          package: res.data.message.package,
          zip: res.data.message.zip,
          page_token: res.data.message.page_token,
          fb_token: res.data.message.fb_token,
          instagram_id: res.data.message.instagram_id,
          next_payment_date: res.data.message.next_payment_date,
          recurring_payment_type: res.data.message.recurring_payment_type,
          is_trial_expired: res.data?.message?.is_trial_expired,
          account_type: res.data?.message?.account_type,
          pid: res.data?.message?.pid,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        this.props.dispatch(receiveToken(token));
        history.push("/app/linkinbio");
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          autoClose: false,
        });
      });
  };

  tokenVerify = async (code) => {
    const endPoint = config.baseURLApiToken + "/verify";
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

  showHide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === "input" ? "password" : "input",
    });
  };

  render() {
    return (
      <div className="auth-page">
        <div className="login_header">
          <div className="header_inr group">
            <div className="header_inr_left">
              <div className="konnect_logo">
                <a href="https://get.konnect.bio/" className="mt-2">
                  <img className="logo" src={logo} alt="logo" />
                </a>
              </div>
              <h3 className="kon_pg_title">Sign In</h3>
            </div>
            <div className="header_inr_right">
              <div className="create_account">
                <span>New to KonnectBio?</span>&nbsp;
                <button
                  className="btn btn-link"
                  onClick={() => {
                    this.props.history.push("/register");
                  }}
                >
                  Create an Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="custome_container_auth_ift">
          <div className="custome_container_auth_inr">
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
                <div className="form-group password-box">
                  <input
                    className="form-control"
                    value={this.state.password}
                    onChange={this.changePassword}
                    type={this.state.type}
                    required
                    name="password"
                    placeholder="Password"
                  />
                  <span className="password_show" onClick={this.showHide}>
                    {this.state.type === "input" ? (
                      <span class="glyphicon glyphicon-eye-open"></span>
                    ) : (
                      <span class="glyphicon glyphicon-eye-close"></span>
                    )}
                  </span>
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
                New to KonnectBio?&nbsp;
                <span
                  className="text-center link"
                  onClick={() => {
                    this.props.dispatch(authError(""));
                    this.props.dispatch(authSuccess(""));
                    this.props.history.push("/register");
                  }}
                >
                  Create an Account
                </span>
              </p>
              <span
                className="decoration text-center link"
                onClick={() => {
                  this.props.dispatch(authError(""));
                  this.props.history.push("/forgot");
                }}
              >
                Forgot password?
              </span>
            </Widget>
            <div className="login_right signup_right">
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
export default withRouter(connect(mapStateToProps)(Login));
