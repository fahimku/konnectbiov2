import React from "react";
import { Row, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import s from "./analysis.module.scss";
import BioShopPost from "../bioshopsetup/BioShopPost/BioShopPost";
import BioShopLink from "./BioShopLink/BioShopLink";

class BioShopSetup extends React.Component {
  constructor(props) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    super(props);
    this.toggleSecondTabs = this.toggleSecondTabs.bind(this);

    this.state = {
      activeSecondTab: "posttab",
      username: userInfo.username,
      packageId: userInfo.package.package_id,
    };
  }

  toggleSecondTabs(tab) {
    const url = new URL(window.location.href.split("?")[0]);
    window.history.replaceState(null, null, url.href);
    if (this.state.activeSecondTab !== tab) {
      this.setState({
        activeSecondTab: tab,
      });
    }
  }

  render() {
    return (
      <>
        <div className="analytics-page affiliate-page linkin-bio">
          <Row className="ml-0 mr-0 tab-section">
            <div className="affiliate_p_col">
              <Row className="ml-0 mr-0">
                <div className="affiliate_in_col marketing-tabs">
                  <Nav tabs className={`${s.coloredNav}`}>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeSecondTab === "posttab",
                        })}
                        onClick={() => {
                          this.toggleSecondTabs("posttab");
                        }}
                      >
                        <span>BioShop Post</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeSecondTab === "linktab",
                        })}
                        onClick={() => {
                          this.toggleSecondTabs("linktab");
                        }}
                      >
                        <span>BioShop Link</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className="affiliate_tab_ift"
                    activeTab={this.state.activeSecondTab}
                  >
                    <TabPane tabId="posttab">
                      {this.state.activeSecondTab === "posttab" ? (
                        <BioShopPost />
                      ) : null}
                    </TabPane>
                    <TabPane tabId="linktab">
                      {this.state.activeSecondTab === "linktab" ? (
                        <BioShopLink />
                      ) : null}
                    </TabPane>
                  </TabContent>
                </div>
              </Row>
            </div>
          </Row>
        </div>
      </>
    );
  }
}

export default BioShopSetup;
