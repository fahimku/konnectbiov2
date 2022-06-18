import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { Switch, Route, withRouter, Redirect } from "react-router";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Hammer from "rc-hammerjs";

import { SidebarTypes } from "../../reducers/layout";
import Header from "../Header";
import Sidebar from "../Sidebar";
import placeholder from "../../images/placeholder.png";
import s from "./Layout.module.scss";
import { DashboardThemes } from "../../reducers/layout";
import BreadcrumbHistory from "../BreadcrumbHistory";
/*ROI SWITCH DASHBOARD PAGES*/
import LinkinBio from "../../pages/linkinbio/LinkinBio";
import Analysis from "../../pages/analysis/analysis";
import BioShop from "../../pages/bioshop/BioShop";
import AccountDelete from "../../pages/accountdelete/AccountDelete";
import MyLinks from "../../pages/mylinks/MyLinks";
import MyProfile from "../../pages/myprofile/MyProfile";
import MyCategory from "../../pages/mycategory/MyCategory";
import AccountSetup from "../../pages/accountsetup/AccountSetup";
import Dashboard from "../../pages/dashboard/Dashboard";
import { createBrowserHistory } from "history";
import Affiliate from "../../pages/affiliate/Affiliate";
import Marketplace from "../../pages/marketplace/Marketplace";
import ComingSoon from "../../pages/comingsoon/comingsoon";
import { PrivateRoute } from "../RouteComponents";
import DirectMessaging from "../../pages/directMessaging/Index";
import MonitorHashTags from "../../pages/monitorhash/index";
import MonitorMentions from "../../pages/monitortag/index";
import ChatPage from "../../pages/chat";
import AllPosts from "../../pages/allposts/BioShop";
import SearchProfile from "../../pages/searchProfile/index";
import AllPostDataComponent from "../../pages/myposts/MyPosts";
import InstagramAllPosts from "../../pages/myposts1/MyPosts";
import CustomCards from "../../pages/customCards/customCards";
import customCards from "../../pages/customCards/customCards";
import SchedulePost from "../../pages/schedulePost/index";
import AffiliateSetup from "../../pages/affiliatesetup/AffiliateSetup";
import SubcriptionSetup from "../../pages/subcriptionsetup/SubcriptionSetup";
import MediaGallery from "../../pages/mediaGallery";
import EcommerceSetup from "../../pages/ecommercesetup/EcommerceSetup";
import Shopifytracker from "../../pages/affiliate/shopifyTracker/tracker";
import BioShopSetup from "../../pages/bioshopsetup/BioShopSetup";

export const history = createBrowserHistory({
  forceRefresh: false,
});

//import ConnectPagee from "../../pages/auth/connect";
class Layout extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dashboardTheme: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarStatic: false,
    sidebarOpened: true,
    dashboardTheme: DashboardThemes.DARK,
  };

  constructor(props) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const username = userInfo.username;
    super(props);

    this.state = {
      username: username,
    };
  }

  render() {
    return (
      <div
        className={[
          s.root,
          `${s.sidebarStatic}`,
          "sing-dashboard",
          `dashboard-${
            localStorage.getItem("sidebarType") === SidebarTypes.TRANSPARENT
              ? "light"
              : localStorage.getItem("dashboardTheme")
          }`,
          `header-${
            localStorage.getItem("navbarColor")
              ? localStorage.getItem("navbarColor").replace("#", "")
              : "FFFFFF"
          }`,
        ].join(" ")}
      >
        <Sidebar />
        <div className={"LayoutWrap " + s.wrap}>
          <Header username={this.state.username} placeholder={placeholder} />
          <Hammer onSwipe={this.handleSwipe}>
            <main className={s.content}>
              <BreadcrumbHistory url={this.props.location.pathname} />
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  classNames="fade"
                  timeout={0}
                >
                  <Router history={history}>
                    <Switch>
                      <Route
                        path="/app"
                        exact
                        // render={() => {
                        //   this.props.history.push("/app/linkinbio");
                        // }}
                        render={() => <Redirect to="/app/linkinbio" />}
                      />
                      <Route
                        path="/admin"
                        exact
                        render={() => <Redirect to="/admin/users" />}
                      />
                      <PrivateRoute
                        path="/app/linkinbio"
                        exact
                        component={LinkinBio}
                        permissions={["dashboard_access"]}
                      />

                      <PrivateRoute
                        path="/app/linkinbio-shop"
                        exact
                        component={BioShop}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        exact
                        path="/app/analysis"
                        component={Analysis}
                        permissions={["analytics_access"]}
                        dispatch={this.props.dispatch}
                      />
                      <Route
                        path="/app/linkinbio/:code"
                        exact
                        component={LinkinBio}
                      />
                      <PrivateRoute
                        path="/app/account/delete"
                        exact
                        component={AccountDelete}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/account/profile"
                        exact
                        component={MyProfile}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/account/categories"
                        exact
                        component={MyCategory}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/account/setup"
                        exact
                        component={AccountSetup}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/my/links"
                        exact
                        component={MyLinks}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/dashboard"
                        exact
                        component={Dashboard}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/campaign"
                        exact
                        component={Affiliate}
                        dispatch={this.props.dispatch}
                        permissions={["affiliate_access"]}
                      />
                      <PrivateRoute
                        path="/app/marketplace"
                        exact
                        component={Marketplace}
                        dispatch={this.props.dispatch}
                        permissions={["marketplace_access"]}
                      />
                      <PrivateRoute
                        path="/app/schedule/posts"
                        exact
                        component={SchedulePost}
                        permissions={["schedule_post_access"]}
                      />

                      <PrivateRoute
                        path="/app/monitor/hash/tags"
                        exact
                        component={MonitorHashTags}
                        permissions={["monitor_hashtag_access"]}
                      />

                      <PrivateRoute
                        path="/app/monitor/mentions"
                        exact
                        component={MonitorMentions}
                        permissions={["monitor_mentions_access"]}
                      />
                      <PrivateRoute
                        path="/app/search/profile"
                        exact
                        component={SearchProfile}
                        permissions={["search_profile_access"]}
                      />
                      <PrivateRoute
                        path="/app/my/posts"
                        exact
                        component={AllPostDataComponent}
                        dispatch={this.props.dispatch}
                        permissions={["all_posts_access"]}
                      />
                      <PrivateRoute
                        path="/app/my/posts1"
                        exact
                        component={InstagramAllPosts}
                        dispatch={this.props.dispatch}
                        permissions={["all_posts_access"]}
                      />
                      <PrivateRoute
                        path="/app/direct/messaging"
                        exact
                        component={ComingSoon}
                        dispatch={this.props.dispatch}
                        permissions={["all_posts_access"]}
                      />
                      <PrivateRoute
                        path="/app/custom/cards"
                        exact
                        component={customCards}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/chat"
                        exact
                        component={ChatPage}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/account/affiliate"
                        exact
                        component={AffiliateSetup}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/subcription/setup"
                        exact
                        component={SubcriptionSetup}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/gallery"
                        exact
                        component={MediaGallery}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/shopifytracker"
                        exact
                        component={Shopifytracker}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/account/ecommerce"
                        exact
                        component={EcommerceSetup}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                      <PrivateRoute
                        path="/app/bioshop/setup"
                        exact
                        component={BioShopSetup}
                        dispatch={this.props.dispatch}
                        permissions={["dashboard_access"]}
                      />
                    </Switch>
                  </Router>
                </CSSTransition>
              </TransitionGroup>
            </main>
          </Hammer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    dashboardTheme: store.layout.dashboardTheme,
    navbarColor: store.layout.navbarColor,
    sidebarType: store.layout.sidebarType,
    currentUser: store.auth.currentUser,
  };
}
export default withRouter(connect(mapStateToProps)(Layout));
