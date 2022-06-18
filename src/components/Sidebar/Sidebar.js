import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import {Progress, Alert} from "reactstrap";
import { withRouter } from "react-router-dom";
import { dismissAlert } from "../../actions/alerts";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup";
import {
  openSidebar,
  closeSidebar,
  changeActiveSidebarItem,
} from "../../actions/navigation";
import isScreen from "../../core/screenHelper";
import { logoutUser } from "../../actions/auth";
import PermissionHelper from "../PermissionHelper";

class Sidebar extends React.Component {
  static propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    sidebarStatic: true,
    sidebarOpened: true,
    activeItem: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      userType: "",
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.doLogout = this.doLogout.bind(this);
  }

  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({ userType: userInfo.user_type });
  }

  onMouseEnter() {
    if (!this.props.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      const paths = this.props.location.pathname.split("/");
      paths.pop();
      this.props.dispatch(openSidebar());
      this.props.dispatch(changeActiveSidebarItem(paths.join("/")));
    }
  }

  onMouseLeave() {
    if (!this.props.sidebarStatic && (isScreen("lg") || isScreen("xl"))) {
      this.props.dispatch(closeSidebar());
      this.props.dispatch(changeActiveSidebarItem(null));
    }
  }

  dismissAlert(id) {
    this.props.dispatch(dismissAlert(id));
  }

  doLogout() {
    this.props.dispatch(logoutUser());
  }

  render() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return (
      <div className={`${s.sidebarWrapper} sidebar`}>
        <nav className={s.root}>
          <header
            className={s.logo}
            onClick={() => {
              this.props.history.push("/app/dashboard");
            }}
          >
            <span className={s.logoStyle}>&nbsp;</span> {/* </a> */}
          </header>

          <ul className={s.nav}>
            <>
              <LinksGroup
                id="dashboard"
                className="sidebar-nav-links"
                header="Dashboard"
                link="/app/dashboard"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-dashboard"></span>
                }
                iconName="flaticon-users"
                labelColor="info"
              />
              <LinksGroup
                id="my-posts"
                className="sidebar-nav-links"
                header="My Posts"
                link="/app/my/posts"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-shopping-cart"></span>
                }
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />
              {/* <LinksGroup
                id="manage-bioshop"
                className="sidebar-nav-links"
                header="Manage BioShop"
                link="/app/linkinbio"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-th-list"></span>
                }
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              /> */}
              <LinksGroup
                id="manage-bioshop"
                className="sidebar-nav-links "
                onActiveSidebarItemChange={(activeItem) =>
                  this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                activeItem={
                  this.props.activeItem === "/app" ||
                  this.props.activeItem === "/app/linkinbio/" ||
                  this.props.activeItem === "/app/linkinbio"
                    ? "/app/bioshops/"
                    : this.props.activeItem
                }
                header="Manage BioShop"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-th-list"></span>
                }
                iconName="flaticon-users"
                link="/app/bioshops"
                index="app/bioshops"
                childrenLinks={[
                  {
                    header: "Create/Edit BioShop",
                    link: "/app/linkinbio",
                  },
                  {
                    header: "Reorder BioShop",
                    link: "/app/bioshop/setup",
                  },
                ]}
              />

              {PermissionHelper.validate(["marketplace_access"]) ? (
                <LinksGroup
                  id="marketplace"
                  className="sidebar-nav-links"
                  header="Marketplace"
                  link="/app/marketplace"
                  isHeader
                  iconElement={<span className="fa fa-shopping-bag"></span>}
                  // label="Awesome"
                  iconName="flaticon-users"
                  labelColor="info"
                />
              ) : null}

              {userInfo?.email === "smasadadm@gmail.com" ? (
                <></>
              ) : (
                <>
                  {PermissionHelper.validate(["affiliate_access"]) ? (
                    <LinksGroup
                      id="affiliate"
                      className="sidebar-nav-links"
                      header="Campaigns"
                      link="/app/campaign"
                      isHeader
                      iconElement={
                        <span className="glyphicon glyphicon-bullhorn"></span>
                      }
                      // label="Awesome"
                      iconName="flaticon-users"
                      labelColor="info"
                    />
                  ) : null}
                </>
              )}
              {userInfo?.email === "smasadadm@gmail.com" ? (
                <>
                  <LinksGroup
                    id="shopify-tracker"
                    className="sidebar-nav-links"
                    header="Shopify Tracker"
                    link="/app/shopifytracker"
                    isHeader
                    iconElement={
                      <span className="glyphicon glyphicon-th-list"></span>
                    }
                    // label="Awesome"
                    iconName="flaticon-users"
                    labelColor="info"
                  />
                </>
              ) : (
                <></>
              )}

              <LinksGroup
                id="manage-links"
                className="sidebar-nav-links"
                header="Manage Links"
                link="/app/my/links"
                isHeader
                iconElement={<span className="glyphicon glyphicon-link"></span>}
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />

              {/* <LinksGroup
                className="sidebar-nav-links"
                header="Manage BioShop"
                link="/app/linkinbio-shop"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-shopping-cart"></span>
                }
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              /> */}
              {/* {PermissionHelper.validate(["affiliate_access"]) ? ( */}
              <LinksGroup
                id="media-gallery"
                className="sidebar-nav-links"
                header="Media Gallery"
                link="/app/gallery"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-picture"></span>
                }
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />

              {/* ) : null} */}
              <LinksGroup
                id="schedule-post"
                className="sidebar-nav-links"
                header="Schedule Post"
                link="/app/schedule/posts"
                isHeader
                iconElement={
                  <span className="glyphicon glyphicon-th-list"></span>
                }
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />

              {/* <LinksGroup
                className="sidebar-nav-links"
                header="Monitor Mentions"
                link="/app/monitor/mentions"
                isHeader
                iconElement={<span className="fa fa-at"></span>}
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />

              <LinksGroup
                className="sidebar-nav-links"
                header="Monitor Hashtags"
                link="/app/monitor/hash/tags"
                isHeader
                iconElement={<span className="fa fa-hashtag"></span>}
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              />
              <LinksGroup
                className="sidebar-nav-links"
                header="Monitor Profiles"
                link="/app/search/profile"
                isHeader
                iconElement={<span className="glyphicon glyphicon-user"></span>}
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              /> */}

              {/* <LinksGroup
                className="sidebar-nav-links"
                header="Direct Messaging"
                link="/app/direct/messaging"
                isHeader
                iconElement={<span className="fa fa-envelope"></span>}
                // label="Awesome"
                iconName="flaticon-users"
                labelColor="info"
              /> */}
              <LinksGroup
                id="ugc"
                className="sidebar-nav-links "
                onActiveSidebarItemChange={(activeItem) =>
                  this.props.dispatch(changeActiveSidebarItem(activeItem))
                }
                activeItem={this.props.activeItem}
                header="UGC"
                isHeader
                iconElement={<span className="fa fa-at"></span>}
                iconName="flaticon-network"
                link="/app/core"
                index="core"
                childrenLinks={[
                  {
                    header: "Monitor Mentions",
                    link: "/app/monitor/mentions",
                  },
                  {
                    header: "Monitor Hashtags",
                    link: "/app/monitor/hash/tags",
                  },
                  {
                    header: "Monitor Profiles",
                    link: "/app/search/profile",
                  },
                ]}
              />

              {PermissionHelper.validate(["analytics_access"]) ? (
                <LinksGroup
                  id="analysis"
                  className="sidebar-nav-links"
                  header="Analytics"
                  link="/app/analysis"
                  isHeader
                  iconElement={<span className="fa fa-bar-chart-o"></span>}
                  // label="Awesome"
                  iconName="flaticon-users"
                  labelColor="info"
                />
              ) : null}

              <br></br>
              <div className={`settings-bottom ${s.bottomLinks}`}>
                <LinksGroup
                  id="settings"
                  className="sidebar-nav-links "
                  onActiveSidebarItemChange={(activeItem) =>
                    this.props.dispatch(changeActiveSidebarItem(activeItem))
                  }
                  activeItem={this.props.activeItem}
                  header="Settings"
                  isHeader
                  labelColor="danger"
                  iconElement={<span className="fa fa-cogs"></span>}
                  iconName="flaticon-user"
                  link="/admin"
                  index="admin"
                  // exact={false}

                  childrenLinks={
                    userInfo?.package?.package_id === "61d695e9bccdaf69f46efc66"
                      ? userInfo?.email === "smasadadm@gmail.com"
                        ? [
                            {
                              header: "Basic Setup",
                              link: "/app/account/profile",
                            },
                            // {
                            //   header: "BioShop Setup",
                            //   link: "/app/bioshop/setup",
                            // },
                            {
                              header: "Category Setup",
                              link: "/app/account/categories",
                            },
                            {
                              header: "Brand Setup",
                              link: "/app/account/affiliate",
                            },

                            {
                              header: "Connection Setup",
                              link: "/app/account/setup",
                            },
                            {
                              header: "Subscription Setup",
                              link: "/app/subcription/setup",
                            },
                            {
                              header: "Delete Account",
                              link: "/app/account/delete",
                            },
                          ]
                        : [
                            {
                              header: "Basic Setup",
                              link: "/app/account/profile",
                            },
                            // {
                            //   header: "BioShop Setup",
                            //   link: "/app/bioshop/setup",
                            // },
                            {
                              header: "Category Setup",
                              link: "/app/account/categories",
                            },
                            {
                              header: "Brand Setup",
                              link: "/app/account/affiliate",
                            },

                            {
                              header: "Ecommerce Setup",
                              link: "/app/account/ecommerce",
                            },
                            {
                              header: "Connection Setup",
                              link: "/app/account/setup",
                            },
                            {
                              header: "Subscription Setup",
                              link: "/app/subcription/setup",
                            },
                            {
                              header: "Delete Account",
                              link: "/app/account/delete",
                            },
                          ]
                      : [
                          {
                            header: "Basic Setup",
                            link: "/app/account/profile",
                          },
                          // {
                          //   header: "BioShop Setup",
                          //   link: "/app/bioshop/setup",
                          // },
                          {
                            header: "Category Setup",
                            link: "/app/account/categories",
                          },
                          {
                            header: "Connection Setup",
                            link: "/app/account/setup",
                          },
                          {
                            header: "Subscription Setup",
                            link: "/app/subcription/setup",
                          },
                          {
                            header: "Delete Account",
                            link: "/app/account/delete",
                          },
                        ]
                  }
                />
                <LinksGroup
                  id="logout"
                  className="sidebar-nav-links"
                  header="Logout"
                  link="/logout"
                  isHeader
                  iconElement={
                    <span className="glyphicon glyphicon-log-out"></span>
                  }
                  // label="Awesome"
                  iconName="flaticon-users"
                  labelColor="info"
                />
              </div>
            </>
          </ul>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
    alertsList: store.alerts.alertsList,
    activeItem: store.navigation.activeItem,
    navbarType: store.navigation.navbarType,
    sidebarColor: store.layout.sidebarColor,
  };
}
export default withRouter(connect(mapStateToProps)(Sidebar));
