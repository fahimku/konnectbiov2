import axios from "axios";
import React from "react";
// import { Row, Col } from "react-bootstrap";
import moment from "moment";
// import Loader from "../../../components/Loader/Loader"; // eslint-disable-line css-modules/no-unused-class
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { getPostSummary } from "../../../actions/postSummary";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const twodecimalplace = (value = 0) => {
  if (value) {
    return parseFloat(value).toFixed(2);
  }
};

const numberWithCommas = (x) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

class SummaryDataComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      data: "",
      loading: false,
      fromDate: moment().subtract(30, "day").format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      today: moment(new Date()).format("YYYY-MM-DD"),
      lastYear: moment().startOf("year").format("YYYY-MM-DD"),
      page: 1,
      limit: 6,
      previous: "",
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      getPostSummary(
        this.state.username,
        this.state.fromDate,
        this.state.toDate,
        this.state.limit,
        this.state.page
      )
    );
  }
  // fetchSummeryPerformance = async (username, fromDate, toDate, limit, page) => {
  //   this.setState({ loading: true });
  //   await axios
  //     .post("analytics/receive/analyseSummary", {
  //       username: username,
  //       from_date: fromDate,
  //       to_date: toDate,
  //       page: page,
  //       limit: limit,
  //       post_type: "image",
  //     })
  //     .then((response) => {
  //       this.setState({ data: response.data.message, loading: false });
  //     });
  // };

  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    this.props.dispatch(
      getPostSummary(
        this.state.username,
        fromDate,
        toDate,
        this.state.limit,
        this.state.page
      )
    );
  }

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  render() {
    const data = this.props.postSummary.post_summary;
    return (
      <>
        <div className="summary_container_main">
            <div className="summary_box_main">
              <div
                className={`summary_block_profile ${
                  this.props.packageName ==="61d695e9bccdaf69f46efc66"
                    ? "summary_height"
                    : ""
                }`}
              >
                <div className="summary_content_profile">
                  <h4 className="page-title">Post Summary</h4>
                  <label>Select Start Date / End Date</label>
                  <RangePicker
                    disabledDate={this.disabledDate}
                    key={4}
                    defaultValue={[
                      moment(this.state.fromDate),
                      moment(this.state.today),
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
                  {/* {this.state.loading ? (
                    <Loader
                      className="analytics-loading summary-loading"
                      size={40}
                    />
                  ) : ( */}
                  <div className="card analytic-box">
                    <div className="col-12 count-box">
                      <h5 className="count-title">Total Impressions</h5>
                      <h3 className="count">
                        {data.post_views === 0 || data.post_views === undefined
                          ? "0"
                          : numberWithCommas(data.post_views)}
                      </h3>
                    </div>
                    <div className="col-12 count-box">
                      <h5 className="count-title">Total Clicks</h5>
                      <h3 className="count">
                        {data.post_clicks === 0 ||
                        data.post_clicks === undefined
                          ? "0"
                          : numberWithCommas(data.post_clicks)}
                      </h3>
                    </div>
                    <div className="col-12 count-box">
                      <h5 className="count-title">Engagement</h5>
                      <h3 className="count">
                        {data.ctr === null ||
                        data.ctr === 0 ||
                        data.ctr === undefined
                          ? "0%"
                          : twodecimalplace(data.ctr) + "%"}
                      </h3>
                    </div>
                    {/* <div className="col-12 count-box mb-0">
                        <h5 className="count-title">Revenue</h5>
                        <h3 className="count">{data.revenue}</h3>
                      </div> */}
                  </div>
                  {/* )} */}
                </div>
              </div>
            </div>
        </div>
      </>
    );
  }
}
function mapStateToProps({ postSummary }) {
  return {
    postSummary: postSummary,
  };
}
export default connect(mapStateToProps)(SummaryDataComponent);
