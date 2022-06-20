import React from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
//import {HashRouter} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConnectedRouter } from "connected-react-router";
import { getHistory } from "../index";
import { AdminRoute, UserRoute, AuthRoute } from "./RouteComponents";
/* eslint-disable */
import ErrorPage from "../pages/error";
/* eslint-enable */
import "../styles/theme.scss";
import LayoutComponent from "../components/Layout";
import Login from "../pages/auth/login";
import Logout from "../pages/auth/logout";
import Connect from "../pages/auth/connect";
import Verify from "../pages/auth/verify";
import Register from "../pages/auth/register";
import Reset from "../pages/auth/reset";
import Forgot from "../pages/auth/forgot";
import Package from "../pages/package/package";
import Payment from "../pages/payment/payment";
import Deposit from "../pages/deposit/deposit";
import Customer from "../pages/customer/customer";

const CloseButton = ({ closeToast }) => (
  <i onClick={closeToast} className="la la-close notifications-close" />
);

class App extends React.PureComponent {
  render() {
    if (this.props.loadingInit) {
      return <div />;
    }

    return (
      <div>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          closeButton={<CloseButton />}
        />
        <ConnectedRouter history={getHistory()}>
          <Router>
            <Switch>
              {/* <Route path="/" exact component={Login} /> */}
              {/* <Route
                path="/app"
                exact
                render={() => <Redirect to="/app/linkinbio" />}
              /> */}
              <UserRoute
                path="/app"
                dispatch={this.props.dispatch}
                component={LayoutComponent}
              />
              {/* <AdminRoute
                path="/admin"
                currentUser={this.props.currentUser}
                dispatch={this.props.dispatch}
                component={LayoutComponent}
              /> */}
              {/* <Route path="/connect" exact component={Connect} /> */}
              <AuthRoute
                path="/package"
                exact
                component={Package}
                // dispatch={this.props.dispatch}
              />
              <Route path="/logout" exact component={Logout} />
              <AuthRoute path="/register" exact component={Register} />
              <AuthRoute path="/login" exact component={Login} />
              <AuthRoute path="/verify-email" exact component={Verify} />
              <AuthRoute path="/password-reset" exact component={Reset} />
              <AuthRoute path="/forgot" exact component={Forgot} />
              <UserRoute
                path="/payment"
                exact
                component={Payment}
                dispatch={this.props.dispatch}
              />
              <UserRoute
                path="/deposit"
                exact
                component={Deposit}
                dispatch={this.props.dispatch}
              />
              <UserRoute
                path="/customer"
                exact
                component={Customer}
                dispatch={this.props.dispatch}
              />
              <Route path="/error" exact component={ErrorPage} />

              <Redirect from="*" to="/login" />
            </Switch>
          </Router>
        </ConnectedRouter>
      </div>
    );
  }
}
const mapStateToProps = (store) => ({
  currentUser: store.auth.currentUser,
  loadingInit: store.auth.loadingInit,
});
export default connect(mapStateToProps)(App);
