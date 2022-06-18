import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Alert, Button } from "reactstrap";
import Widget from "../../../components/Widget";
import {
  sendPasswordResetEmail,
  authSuccess,
  authError,
} from "../../../actions/auth";
import logo from "../../../images/konnectbiologo.svg";

class Forgot extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.doSendResetEmail = this.doSendResetEmail.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  doSendResetEmail(e) {
    e.preventDefault();
    this.props.dispatch(sendPasswordResetEmail(this.state.email));
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
                <button
                  onClick={() => {
                    this.props.history.push("/login");
                  }}
                  className="btn btn-link"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="custome_container_auth_ift">
          <div class="custome_container_auth_inr">
            <Widget
              className="custome_signup"
              title={<h3 className="mt-0">Forgot password?</h3>}
            >
              <p className="widget-auth-info">
                We’ll send you a link to reset your password.
              </p>
              <form className="mt" onSubmit={this.doSendResetEmail}>
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
                    this.props.dispatch(authError(""));
                    this.props.dispatch(authSuccess(""));
                    this.props.history.push("/login");
                  }}
                >
                  Sign in
                </span>
              </p>
            </Widget>
          </div>
        </div>
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
export default withRouter(connect(mapStateToProps)(Forgot));
