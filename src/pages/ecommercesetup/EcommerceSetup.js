import React from "react";
import { Row, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import ShopifySetup from "./shopifysetup/ShopifySetup";

class EcommerceSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "shopify",
    };
    this.toggleTabs = this.toggleTabs.bind(this);
  }

  toggleTabs(tab) {
    const url = new URL(window.location.href.split("?")[0]);
    window.history.replaceState(null, null, url.href);
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
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
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "shopify",
                        })}
                        onClick={() => {
                          this.toggleTabs("shopify");
                        }}
                      >
                        <span>Shopify Setup</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent
                    className="affiliate_tab_ift"
                    activeTab={this.state.activeTab}
                  >
                    <TabPane tabId="shopify">
                      {this.state.activeTab === "shopify" ? (
                        <ShopifySetup />
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

export default EcommerceSetup;
