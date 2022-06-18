import React from "react";
import s from "./Affiliate.module.scss";
import "./selector.css";
import { Row, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import AllMarketPlace from "./AllMarketPlace";
import ActiveMarketPlace from "./ActiveMarketPlace/ActiveMarketPlace";
// import BrandComponent from "./Brand/BrandComponent";
//import MyCategory from "../mycategory/MyCategory";
import Categories from "./Categories/categoriesMarketPlace";
import MarketplaceEarning from "./MarketplaceEarning/MarketplaceEarning";
import AffiliateSalesInf from "./MarketplaceSale/InfSales";
// import MarketplaceTransaction from "../marketplace/MarketplaceTransaction/MarketplaceTransaction";
import axios from "axios";
import MarketplaceRequest from "./MarketplaceRequest/MarketplaceRequest";
import BrandFilterComponent from "./Brand/BrandFilterComponent";

class MarketPlace extends React.Component {
  constructor(props) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let username = userInfo.username;
    super(props);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.state = {
      activeTab: "categories",
      username: username,
      brandtab: [],
      brandLoading: true,
      catTab: [],
      catLoading: true,
    };
  }
  componentDidMount() {
    this.fetchMyBrand();
  }

  fetchMyBrand = async () => {
    await axios
      .post("/users/marketPlace/getUserBrands")
      .then((response) => {
        const myBrands = response.data.data;
        this.setState({ brandtab: myBrands });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  // brandTab = (brand, brandLoading) => {
  //   this.setState({ brandtab: brand, brandLoading: brandLoading });
  // };
  catTab = (categories, catLoading) => {
    this.setState({ catTab: categories, catLoading: catLoading });
    // this.fetchMyBrand();
  };

  render() {
    const { brandtab, catTab, catLoading } = this.state;

    return (
      <div className="analytics-page affiliate-page linkin-bio">
        <Row className="ml-0 mr-0 tab-section">
          <div className="affiliate_p_col">
            <Row className="ml-0 mr-0">
              <div className="affiliate_in_col marketing-tabs">
                <Nav tabs className={`${s.coloredNav}`}>
                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "category",
                      })}
                      id="mark-category"
                      onClick={() => {
                        this.toggleTabs("category");
                      }}
                    >
                      <span>Category</span>
                    </NavLink>
                  </NavItem> */}

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "categories",
                      })}
                      id="mark-category"
                      onClick={() => {
                        this.toggleTabs("categories");
                      }}
                    >
                      <span>Brand</span>
                    </NavLink>
                  </NavItem>

                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "brand",
                      })}
                      id="mark-brand"
                      onClick={() => {
                        this.toggleTabs("brand");
                      }}
                      // disabled={
                      //   !catLoading && catTab.length === 0 ? true : false
                      // }
                    >
                      <span>Brands</span>
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "marketplace",
                      })}
                      id="mark-new"
                      onClick={() => {
                        this.toggleTabs("marketplace");
                      }}
                      disabled={
                        brandtab.length === 0 ||
                        (!catLoading && catTab.length === 0)
                          ? true
                          : false
                      }
                    >
                      <span>Campaigns</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "active",
                      })}
                      id="mark-active"
                      onClick={() => {
                        this.toggleTabs("active");
                      }}
                      disabled={
                        brandtab.length === 0 ||
                        (!catLoading && catTab.length === 0)
                          ? true
                          : false
                      }
                    >
                      <span>Active</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "in-active",
                      })}
                      id="mark-paused"
                      onClick={() => {
                        this.toggleTabs("in-active");
                      }}
                      disabled={
                        brandtab.length === 0 ||
                        (!catLoading && catTab.length === 0)
                          ? true
                          : false
                      }
                    >
                      <span>Paused</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "expired",
                      })}
                      id="mark-expired"
                      onClick={() => {
                        this.toggleTabs("expired");
                      }}
                      disabled={
                        brandtab.length === 0 ||
                        (!catLoading && catTab.length === 0)
                          ? true
                          : false
                      }
                    >
                      <span>Expired</span>
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "earning",
                      })}
                      id="mark-earning"
                      onClick={() => {
                        this.toggleTabs("earning");
                      }}
                    >
                      <span>Earning</span>
                    </NavLink>
                  </NavItem> */}
                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "transaction",
                      })}
                      id="mark-transaction"
                      onClick={() => {
                        this.toggleTabs("transaction");
                      }}
                    >
                      <span>Transactions</span>
                    </NavLink>
                  </NavItem> */}

                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "sale",
                      })}
                      id="mark-transaction"
                      onClick={() => {
                        this.toggleTabs("sale");
                      }}
                    >
                      <span>Earnings</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "request",
                      })}
                      id="mark-transaction"
                      onClick={() => {
                        this.toggleTabs("request");
                      }}
                    >
                      <span>Requests</span>
                    </NavLink>
                  </NavItem>

                  {/* <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "accounting",
                      })}
                      onClick={() => {
                        this.toggleTabs("accounting");
                      }}
                    >
                      <span>Accounting</span>
                    </NavLink>
                  </NavItem> */}
                </Nav>
                <TabContent
                  className="affiliate_tab_ift"
                  activeTab={this.state.activeTab}
                >
                  {/* <TabPane tabId="category">
                    {this.state.activeTab === "category" ? (
                      <MyCategory catTab={this.catTab} type="marketcategory" />
                    ) : null}
                  </TabPane> */}

                  <TabPane tabId="categories">
                    {this.state.activeTab === "categories" ? (
                      <Categories catTab={this.catTab} type="marketcategory" />
                    ) : null}
                  </TabPane>

                  <TabPane tabId="brand">
                    {this.state.activeTab === "brand" ? (
                      // <BrandComponent
                      //   title="Brand"
                      //   type="brand"
                      //   // brandTab={this.brandTab}
                      // />
                      <BrandFilterComponent />
                    ) : null}
                  </TabPane>
                  <TabPane tabId="marketplace">
                    {this.state.activeTab === "marketplace" ? (
                      <AllMarketPlace title="Campaigns" type="marketplace" />
                    ) : null}
                  </TabPane>
                  <TabPane tabId="active">
                    {this.state.activeTab === "active" ? (
                      <ActiveMarketPlace
                        title="Active Campaign"
                        type="active"
                        endPoint="users/marketPlace/getCampaigns"
                      />
                    ) : null}
                  </TabPane>
                  <TabPane type="inActive" tabId="in-active">
                    {this.state.activeTab === "in-active" ? (
                      <ActiveMarketPlace
                        title="Paused Campaign"
                        type="in_active"
                        endPoint="users/marketPlace/getAllPusedCampaignPost"
                      />
                    ) : null}
                  </TabPane>
                  <TabPane tabId="expired" className="tab-expired">
                    {this.state.activeTab === "expired" ? (
                      <ActiveMarketPlace
                        title="Expired Campaign"
                        type="expired"
                        endPoint="users/marketPlace/getExpiredCampaigns"
                      />
                    ) : null}
                  </TabPane>
                  <TabPane tabId="earning">
                    {this.state.activeTab === "earning" ? (
                      <MarketplaceEarning />
                    ) : null}
                  </TabPane>
                  {/* <TabPane tabId="transaction">
                    {this.state.activeTab === "transaction" ? (
                      <MarketplaceTransaction />
                    ) : null}
                  </TabPane> */}
                  <TabPane tabId="sale">
                    {this.state.activeTab === "sale" ? (
                      <AffiliateSalesInf />
                    ) : null}
                  </TabPane>
                  <TabPane tabId="request">
                    {this.state.activeTab === "request" ? (
                      <MarketplaceRequest />
                    ) : null}
                  </TabPane>

                  {/* <TabPane tabId="accounting" className="tab-accounting">
                    {this.state.activeTab === "accounting" ? "" : null}
                  </TabPane> */}
                </TabContent>
              </div>
            </Row>
          </div>
        </Row>
      </div>
    );
  }
}
export default MarketPlace;
