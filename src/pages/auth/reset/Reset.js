import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button } from "reactstrap";
import Widget from "../../../components/Widget";
import { authError, resetPassword } from "../../../actions/auth";
import logo from "../../../images/konnectbiologo.svg";

class Reset extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirmPassword: "",
    };

    this.changePassword = this.changePassword.bind(this);
    this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.isPasswordValid = this.isPasswordValid.bind(this);
    this.doReset = this.doReset.bind(this);
  }
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const token = params.get("code");
    if (token === null) {
      this.props.history.push("/login");
    }
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  changeConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  checkPassword() {
    if (!this.isPasswordValid()) {
      if (!this.state.password) {
        this.props.dispatch(authError("Password field is empty"));
      } else {
        this.props.dispatch(authError("Passwords are not equal"));
      }
      setTimeout(() => {
        this.props.dispatch(authError());
      }, 3 * 1000);
    }
  }

  isPasswordValid() {
    return (
      this.state.password && this.state.password === this.state.confirmPassword
    );
  }

  doReset(e) {
    e.preventDefault();
    const params = new URLSearchParams(this.props.location.search);
    const token = params.get("code");
    // const email = params.get("email");

    if (!token) {
      authError("There are no token");
    }
    if (!this.isPasswordValid()) {
      this.checkPassword();
    } else {
      this.props.dispatch(resetPassword(token, this.state.password));
    }
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
              <h3 class="kon_pg_title">Create Account</h3>
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
              className="custome_signup"
              title={<h3 className="mt-0">Reset password</h3>}
            >
              <p className="widget-auth-info">Please fill all fields below</p>
              <form className="mt" onSubmit={this.doReset}>
                {this.props.errorMessage && (
                  <Alert className="alert-sm" color="danger">
                    {this.props.errorMessage}
                  </Alert>
                )}
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
                <div className="form-group">
                  <input
                    className="form-control"
                    value={this.state.confirmPassword}
                    onChange={this.changeConfirmPassword}
                    onBlur={this.checkPassword}
                    type="password"
                    required
                    name="confirmPassword"
                    placeholder="Confirm"
                  />
                </div>
                <Button
                  type="submit"
                  color="inverse"
                  className="register_button"
                  size="lg"
                >
                  {this.props.isFetching ? "Loading..." : "Reset Password"}
                </Button>
              </form>
              <p className="already">
                <span
                  className="text-center link"
                  onClick={() => {
                    this.props.history.push("/login");
                  }}
                >
                  Sign in
                </span>
              </p>
            </Widget>
          </div>
        </div>
        {/* <footer className="auth-footer">
          {new Date().getFullYear()} &copy; Sing App - React Admin Dashboard
          Template. By{" "}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://flatlogic.com"
          >
            Flatlogic
          </a>
        </footer> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    errorMessage: state.auth.errorMessage,
  };
}
export default withRouter(connect(mapStateToProps)(Reset));
