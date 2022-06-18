import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { connect } from "react-redux";
import * as dashActions from "../../actions/dashboard";
import numeral from "numeral";
import { Link } from "react-router-dom";
// import { Redirect } from "react-router";
// import LinksGroup from "../../components/Sidebar/LinksGroup/LinksGroup";

function Dashboard({ getDashboard, dashboard }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userData = userInfo;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getDashboard("image,campaign,link,video", userData.access_token).then(
      function () {
        setLoading(false);
      },
      function () {
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <div className="dashboard_main_ift container">
        <div className="dsh-top dashboard_inr row">
          <div className="dashboard_col col-md-3">
            <div className="dash_block">
              <div className="dash_content clearfix">
                <span className="dash_icon-top">
                  <i className="fa fa-eye fa-3x" aria-hidden="true"></i>
                </span>
                <div className="imp-t text-right">
                  {loading ? (
                    <Loader className="dashboard-loader" />
                  ) : dashboard.post_views ? (
                    numeral(dashboard.post_views).format("0,0")
                  ) : (
                    "0"
                  )}
                </div>
                <div className="imp-tx text-uppercase text-muted text-right">
                  Total Impressions
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard_col col-md-3">
            <div className="dash_block">
              <div className="dash_content clearfix">
                <span className="dash_icon-top">
                  <i
                    className="fa fa-hand-pointer-o fa-3x"
                    aria-hidden="true"
                  ></i>
                </span>
                <div className="imp-t text-right">
                  {loading ? (
                    <Loader className="dashboard-loader" />
                  ) : dashboard.post_clicks ? (
                    numeral(dashboard.post_clicks).format("0,0")
                  ) : (
                    "0"
                  )}
                </div>
                <div className="imp-tx text-uppercase text-muted text-right">
                  Total Clicks
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-3">
            <div className="dash_block">
              <div className="dash_content clearfix">
                <span className="dash_icon-top">
                  <i className="fa fa-handshake-o fa-3x" aria-hidden="true"></i>
                </span>
                <div className="imp-t text-right">
                  {loading ? (
                    <Loader className="dashboard-loader" />
                  ) : dashboard.ctr ? (
                    dashboard.ctr + " %"
                  ) : (
                    "0%"
                  )}
                </div>
                <div className="imp-tx text-uppercase text-muted text-right">
                  Total Engagement
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-3">
            <div className="dash_block">
              <div className="dash_content clearfix">
                <span className="dash_icon-top">
                  <i className="fa fa-usd fa-3x" aria-hidden="true"></i>
                </span>
                <div className="imp-t text-right">
                  {" "}
                  {loading ? (
                    <Loader className="dashboard-loader" />
                  ) : dashboard.revenue ? (
                    dashboard.revenue
                  ) : (
                    "$0.00"
                  )}
                </div>
                <div className="imp-tx text-uppercase text-muted text-right">
                  Total Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dsh-mid dashboard_inr row">
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i className="fa fa-user fa-3x" aria-hidden="true"></i>
                  </span>
                  <h4>Settings - Home Screen</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    <Link
                      to="/app/account/profile"
                      // onClick={() => {
                      //   props.history.push("/app/account/profile");
                      // }}
                      className="btn btn-rounded btn-primary"
                      // href="javascript:void(0)"
                    >
                      <i className="fa fa-cog mr-1"></i> Manage Home Screen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i className="fa fa-th-list fa-3x" aria-hidden="true"></i>
                  </span>
                  <h4>My Posts</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    {userData.package.package_id ===
                    "61c02d43f40bec74fac2c9a0" ? (
                      <Link
                        to="my/posts"
                        className="btn btn-rounded btn-primary"
                      >
                        <i className="fa fa-cog mr-1"></i> My Posts
                      </Link>
                    ) : (
                      <Link
                        to="analysis?type=mypost"
                        className="btn btn-rounded btn-primary"
                      >
                        <i className="fa fa-cog mr-1"></i> My Posts
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i
                      className="fa fa-shopping-cart fa-3x"
                      aria-hidden="true"
                    ></i>
                  </span>
                  <h4>Bio Shop</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    <Link
                      to="/app/linkinbio"
                      // onClick={() => {
                      //   props.history.push("/app/linkinbio-shop");
                      // }}
                      className="btn btn-rounded btn-primary"
                      // href="javascript:void(0)"
                    >
                      <i className="fa fa-cog mr-1"></i> Manage Bio Shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dsh-mid2 dashboard_inr row">
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i
                      className="glyphicon glyphicon-link fa-3x"
                      aria-hidden="true"
                    ></i>
                  </span>
                  <h4>Links</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    <Link
                      to="/app/my/links"
                      // onClick={() => {
                      //   props.history.push("/app/my/links");
                      // }}
                      className="btn btn-rounded btn-primary"
                      //                      href="javascript:void(0)"
                    >
                      <i className="fa fa-cog mr-1"></i> Manage Links
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i className="fa fa-bar-chart fa-3x" aria-hidden="true"></i>
                  </span>
                  <h4>Analytics</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    <Link
                      to="/app/analysis"
                      // onClick={() => {
                      //   props.history.push("/app/analysis");
                      // }}
                      className="btn btn-rounded btn-primary"
                      //   href="javascript:void(0)"
                    >
                      <i className="fa fa-cog mr-1"></i> Analytics
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-4">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_inr text-center">
                  <span className="dash_icon">
                    <i className="fa fa-list-alt fa-3x" aria-hidden="true"></i>
                  </span>
                  <h4>Category Setup</h4>
                  <div className="text-muted">kbiouser3</div>
                  <div className="pt-20">
                    <Link
                      to="/app/account/categories"
                      // onClick={() => {
                      //   props.history.push("/app/account/categories");
                      // }}
                      className="btn btn-rounded btn-primary"
                      //href="javascript:void(0)"
                    >
                      <i className="fa fa-cog mr-1"></i> Manage Category Setup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dsh-bottom dashboard_inr row">
          <div className="dashboard_col col-md-6">
            <div className="dash_block">
              <div className="dash_content">
                <i className="fa fa-list-alt fa-2x text-body-bg-dark"></i>{" "}
                <span className="text-muted" style={{ verticalAlign: "super" }}>
                  Instagram
                </span>
                <div className="row pb-3 pt-3">
                  <div className="col-6 text-right border-r">
                    <div className="imp-t text-right">
                      {loading ? (
                        <Loader className="dashboard-loader" />
                      ) : dashboard.total_posts ? (
                        dashboard.total_posts
                      ) : (
                        "0"
                      )}
                    </div>
                    <div className="imp-tx text-uppercase text-muted text-right">
                      Total Posts
                    </div>
                  </div>
                  <div className="col-6 text-left">
                    <div className="imp-t">
                      {" "}
                      {loading ? (
                        <Loader className="dashboard-loader" />
                      ) : dashboard.linked_posts ? (
                        dashboard.linked_posts
                      ) : (
                        "0"
                      )}
                    </div>
                    <div className="imp-tx text-uppercase text-muted">
                      Linked Posts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard_col col-md-6">
            <div className="dash_block">
              <div className="dash_content">
                <div className="dash_c_pkg text-center">
                  <span className="dash_icon">
                    <i className="fa fa-check fa-3x" aria-hidden="true"></i>
                  </span>
                  <h4>{userData.package.package_name}</h4>
                  <div className="text-muted">
                    This Is Your Current Active Plan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function mapStateToProps({ dashboard }) {
  return {
    dashboard,
  };
}
export default connect(mapStateToProps, dashActions)(Dashboard);
