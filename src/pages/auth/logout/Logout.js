import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/auth";

class Logout extends React.Component {

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  constructor(props) {
    super(props);
    this.doLogout = this.doLogout.bind(this);
  }

  componentDidMount() {
    this.doLogout();
  }

  render() {
    return <></>;
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Logout));