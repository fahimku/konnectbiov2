import React from "react";
import { Button } from "react-bootstrap";
import logo from "../../images/konnectbiologo.svg";

class Deposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <>
        {/* <div className={s.errorPage}> */}
        <div className="login_header">
          <div className="container group">
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

        <div className="container">
          <div className="payment-page mt-5">
            <div className="page-title">
              <h3>Deposit Payment</h3>
            </div>
            <div className="white-box mt-5">
              <div className="success-msg">
                <h2>Thank you!</h2>
                <p>Your payment has been successfully received.</p>
              </div>
              {/* {this.state.success ? (
                <div className="success-msg">
                  <h2>Thank you!</h2>
                  <p>Your payment has been successfully received.</p>
                </div>
              ) : (
                <div className="error-msg danger">
                  <h2>Oh no, your payment failed</h2>
                  <p>Please check your card detail and try again.</p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Deposit;
