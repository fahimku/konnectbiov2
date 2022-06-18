import React from "react";
import "antd/dist/antd.css";
import SummaryDataComponent from "./SummaryDataComponent";
import CampaignSummaryComponent from "./CampaignSummaryComponent";
import AffiliateSummaryComponent from "../../affiliate/AffiliateDashboard/AffiliateSummaryComponent";
import BioShopSummaryComponent from "./BioShopSummaryComponent";

class SummaryComponent extends React.Component {
  state = {
    username: this.props.username,
    packageName: this.props.packageName,
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <h4 className="page-title">Analytics</h4>
            </div>
           

            <div
              className={`analytics-summery-box ${
                this.state.packageName === "61d695e9bccdaf69f46efc66"
                  ? "col-md-6"
                  : "col-md-4"
              } `}
            >
              {/* <h4 className="page-title">Post Summary</h4> */}
              <BioShopSummaryComponent
                username={this.state.username}
                packageName={this.state.packageName}
              />
            </div>

            <div
              className={`analytics-summery-box ${
                this.state.packageName === "61d695e9bccdaf69f46efc66"
                  ? "col-md-6"
                  : "col-md-4"
              } `}
            >
              {/* <h4 className="page-title">Post Summary</h4> */}
              <SummaryDataComponent
                username={this.state.username}
                packageName={this.state.packageName}
              />
            </div>
            
            {this.state.packageName !== "61d695e9bccdaf69f46efc66" && (
              <div className="analytics-summery-box col-md-4">
                <CampaignSummaryComponent
                  username={this.state.username}
                  packageName={this.state.packageName}
                />
              </div>
            )}
            {this.state.packageName === "61d695e9bccdaf69f46efc66" && (
              <div
                className={`analytics-summery-box ${
                  this.state.packageName === "61d695e9bccdaf69f46efc66"
                    ? "col-md-6"
                    : "col-md-4"
                } `}
              >
                <AffiliateSummaryComponent
                  username={this.state.username}
                  // className="col-md-12"
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SummaryComponent;
