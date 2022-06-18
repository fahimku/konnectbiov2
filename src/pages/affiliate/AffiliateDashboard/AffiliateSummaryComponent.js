import React from "react";
import moment from "moment";
// import Loader from "../../../components/Loader/Loader"; // eslint-disable-line css-modules/no-unused-class
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { getCampaignSummary } from "../../../actions/campaignSummary";
import { getAffiliateSalesByBrand } from "../../../actions/affiliateSales";
import numeral from "numeral";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

// const twodecimalplace = (value = 0) => {
//   if (value) {
//     return parseFloat(value).toFixed(2);
//   }
// };

// const numberWithCommas = (x) => {
//   if (x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }
// };

class AffiliateSummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      data: "",
      loading: false,
      fromDate: moment().startOf("year").format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      getCampaignSummary(this.state.fromDate, this.state.toDate)
    );
    this.props.dispatch(
      getAffiliateSalesByBrand(
        "brand",
        1,
        12,
        this.state.fromDate,
        this.state.toDate
      )
    );
  }

  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    this.props.dispatch(getCampaignSummary(fromDate, toDate));
    this.props.dispatch(
      getAffiliateSalesByBrand("brand", 1, 12, fromDate, toDate)
    );
  }

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  render() {
    const data = this.props.campaignSummary;
    let affiliateSales = this.props.affiliateSales?.message?.data[0];
    return (
      <>
        <div
          className={`summary_container_main ${
            this.props.className ? this.props.className : ""
          }`}
        >
          <div
            className="summary_box_main"
            // className={`summary_box_main ${
            //   this.props.className ? this.props.className : "col-md-12"
            // }`}
          >
            <div className="summary_block_profile">
              <div className="summary_content_profile">
                <h4 className="page-title">Campaign Summary</h4>
                <label>Select Start Date / End Date</label>
                <RangePicker
                  disabledDate={this.disabledDate}
                  key={4}
                  defaultValue={[
                    moment(this.state.fromDate),
                    moment(this.state.toDate),
                  ]}
                  defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
                  allowClear={false}
                  ranges={{
                    Today: [moment(), moment()],
                    Tomorrow: [
                      moment().add(1, "days"),
                      moment().add(1, "days"),
                    ],
                    Yesterday: [
                      moment().subtract(1, "days"),
                      moment().subtract(1, "days"),
                    ],
                    "This Month": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                    "Last Month": [
                      moment().subtract(1, "month").startOf("month"),
                      moment().subtract(1, "month").endOf("month"),
                    ],
                  }}
                  format={dateFormat}
                  onChange={this.dateRangePickerChanger.bind(this)}
                />

                <div className="card analytic-box">
                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Campaigns</h5>
                    <h3 className="count">
                      {data.loading
                        ? data.campaign_summary.total_campaigns
                          ? data.campaign_summary.total_campaigns
                          : "0"
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Active Campaigns</h5>
                    <h3 className="count">
                      {data.loading
                        ? data.campaign_summary.active_campaigns
                          ? data.campaign_summary.active_campaigns
                          : "0"
                        : "0"}
                    </h3>
                  </div>

                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Paused Campaigns</h5>
                    <h3 className="count">
                      {data.loading
                        ? data.campaign_summary.in_active_campaigns
                          ? data.campaign_summary.in_active_campaigns
                          : "0"
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Expired Campaigns</h5>
                    <h3 className="count">
                      {data.loading
                        ? data.campaign_summary.expired_campaigns
                          ? data.campaign_summary.expired_campaigns
                          : "0"
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Gross Sales</h5>
                    <h3 className="count">
                      {data.loading
                        ? numeral(affiliateSales?.total_sale).format("$0,0.0'")
                        : "$0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Customer Discount</h5>
                    <h3 className="count">
                      {data.loading
                        ? numeral(affiliateSales?.discount).format("$0,0.0'")
                        : "$0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Net Sales</h5>
                    <h3 className="count">
                      {data.loading
                        ? numeral(affiliateSales?.order_totalprice).format(
                            "$0,0.0'"
                          )
                        : "$0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Commission Paid</h5>
                    <h3 className="count">
                      {data.loading
                        ? numeral(affiliateSales?.total_commission).format(
                            "$0,0.0'"
                          )
                        : "$0"}
                    </h3>
                  </div>

                  {/* <div className="col-12 count-box">
                    <h5 className="count-title">Total Budget</h5>
                    <h3 className="count">
                      {data.campaign_summary.total_budget
                        ? data.campaign_summary.total_budget
                        : "$0"}
                    </h3>
                  </div>*/}
                  {/* <div className="col-12 count-box">
                    <h5 className="count-title">Total Clicks</h5>
                    <h3 className="count">
                      {data.campaign_summary.total_clicks
                        ? data.campaign_summary.total_clicks
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Spent</h5>
                    <h3 className="count">
                      {data.campaign_summary.total_spent
                        ? data.campaign_summary.total_spent
                        : "$0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Number of Participants</h5>
                    <h3 className="count">
                      {data.campaign_summary.total_participant
                        ? data.campaign_summary.total_participant
                        : "0"}
                    </h3>
                  </div>
                </div> */}
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps({ campaignSummary, affiliateSales }) {
  return {
    campaignSummary: campaignSummary,
    affiliateSales: affiliateSales,
  };
}
export default connect(mapStateToProps)(AffiliateSummaryComponent);
