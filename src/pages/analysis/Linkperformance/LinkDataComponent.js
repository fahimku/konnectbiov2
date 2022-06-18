import axios from "axios";
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import Loader from "../../../components/Loader/Loader"; // eslint-disable-line css-modules/no-unused-class
import { DatePicker } from "antd";
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const twodecimalplace = (value = 0) => {
  return parseFloat(value).toFixed(2);
};
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
class LinkDataComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      data: [],
      loading: false,
      fromDate: moment().startOf("year").format("YYYY-MM-DD"),
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
    this.fetchLinkPerformance(
      this.state.username,
      this.state.lastYear,
      moment(new Date()).format("YYYY-MM-DD"),
      this.state.limit,
      this.state.page
    );
  }
  async fetchLinkPerformance(username, fromDate, toDate, limit, page) {
    this.setState({ loading: true });
    await axios
      .post("analytics/receive/analyseAllPosts", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
        page: page,
        limit: limit,
        post_type: "link",
      })
      .then((response) => {
        this.setState({ data: response.data.message.data, loading: false });
        if (response.data.message.hasOwnProperty("next")) {
          this.setState({ page: response.data.message.next.page });
        } else {
          this.setState({ page: 0 });
        }
        if (response.data.message.hasOwnProperty("previous")) {
          this.setState({ previous: response.data.message.previous.page });
        } else {
          this.setState({ previous: 0 });
        }
      });
  }
  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    this.fetchLinkPerformance(
      this.state.username,
      fromDate,
      toDate,
      this.state.limit,
      1
    );
  }
  pagination = () => {
    let { username, fromDate, toDate, limit, page } = this.state;
    this.fetchLinkPerformance(username, fromDate, toDate, limit, page);
  };
  paginationPrev = () => {
    let { username, fromDate, toDate, limit, previous } = this.state;
    this.fetchLinkPerformance(username, fromDate, toDate, limit, previous);
  };
  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  render() {
    return (
      <>
        <Row>
          <Col xs={12} xl={12} md={12}>
            <p>Select Start Date / End Date</p>
            <RangePicker
              disabledDate={this.disabledDate}
              key={4}
              defaultValue={[
                moment(this.state.lastYear),
                moment(this.state.today),
              ]}
              defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
              allowClear={false}
              ranges={{
                Today: [moment(), moment()],
                Tomorrow: [moment().add(1, "days"), moment().add(1, "days")],
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
          </Col>
        </Row>
        <hr />
        {this.state.loading ? (
          <Loader className="analytics-loading" size={60} />
        ) : (
          <>
            <Row className="af-rm-mn">
              {!this.state.data.length ? (
                <div className="col-md-12 no-data">No Data Available</div>
              ) : (
                this.state.data.map((record) => (
                  <>
                    <Col xs={12} xl={4} md={6}>
                      <div className="card analytic-box">
                        <div className="row">
                          <div className="col-4">
                            <span className="link-icon glyphicon glyphicon-link"></span>
                          </div>
                          <div className="col-8 analytic-caption">
                            <div className="card-block px-2">
                              <h5 className="card-text link-caption">
                                {record.caption === ""
                                  ? "No Caption Added"
                                  : record.caption}
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="row count-main-box">
                          <div className="col-6 count-box">
                            <h5 className="count-title">Impressions</h5>
                            <h3 className="count">
                              {numberWithCommas(record.views)}
                            </h3>
                          </div>
                          <div className="col-6 count-box">
                            <h5 className="count-title">Clicks</h5>
                            <h3 className="count">
                              {numberWithCommas(record.clicks)}
                            </h3>
                          </div>
                          <div className="col-6 count-box">
                            <h5 className="count-title">Engagement</h5>
                            <h3 className="count">
                              {twodecimalplace(record.ctr)}%
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </>
                ))
              )}
            </Row>
          </>
        )}
        {this.state.loading || !this.state.data.length ? null : (
          <div className="text-right next-button">
            <Button
              variant="primary"
              onClick={this.paginationPrev}
              disabled={this.state.previous !== 0 ? false : true}
            >
              Prev
            </Button>
            <Button
              variant="primary"
              onClick={this.pagination}
              disabled={this.state.page !== 0 ? false : true}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  }
}
export default LinkDataComponent;
