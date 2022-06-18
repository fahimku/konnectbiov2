import React from "react";
import moment from "moment";
// import Loader from "../../../components/Loader/Loader"; // eslint-disable-line css-modules/no-unused-class
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { getMediaSummary } from "../../../../actions/mediaSummary";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

class GallerySummaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      data: "",
      loading: false,
      fromDate: moment().subtract(30, "day").format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(
      getMediaSummary(this.state.fromDate, this.state.toDate)
    );
  }

  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    this.props.dispatch(getMediaSummary(fromDate, toDate));
  }

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  render() {
    const data = this.props.mediaSummary;
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
                <h4 className="page-title">Media Summary</h4>
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
                {/* {data.loading ? (
                    <Loader
                      className="analytics-loading campaign-sum-loading"
                      size={60}
                    />
                  ) : ( */}
                <div className="card analytic-box">
                  <div className="col-12 count-box">
                    <h5 className="count-title">Total Media</h5>
                    <h3 className="count">
                      {data.media_summary.total
                        ? data.media_summary.total
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Active Media</h5>
                    <h3 className="count">
                      {data.media_summary.active
                        ? data.media_summary.active
                        : "0"}
                    </h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">In-Active Media</h5>
                    <h3 className="count">
                      {data.media_summary.in_active
                        ? data.media_summary.in_active
                        : "0"}
                    </h3>
                  </div>
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
function mapStateToProps({ mediaSummary }) {
  return {
    mediaSummary: mediaSummary,
  };
}
export default connect(mapStateToProps)(GallerySummaryComponent);
