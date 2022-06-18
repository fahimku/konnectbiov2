import React, { PureComponent } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
//import chartsData from "./mock";
import { DatePicker } from "antd";
import moment from "moment";
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

class HighCharts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      today: moment(new Date()).format("YYYY-MM-DD"),
      lastSevenDays: moment().subtract(7, "days").format("YYYY-MM-DD"),
      totalClicks: "",
      totalProfileViews: "",
      totalClickThrough: "",
      fromDate: "",
      toDate: "",
      postClicks: {
        credits: {
          enabled: false,
        },
        colors: ["#1A86D0"],
        chart: {
          zoomType: "x",
        },
        title: {
          text: "",
        },
        subtitle: {
          text:
            document.ontouchstart === undefined
              ? ""
              : "Pinch the chart to zoom in",
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            text: "",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.Color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba"),
                ],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            type: "area",
            name: "Clicks",
            data: "",
          },
        ],
      },
      profileViews: {
        credits: {
          enabled: false,
        },
        colors: ["#1A86D0"],
        chart: {
          zoomType: "x",
        },
        title: {
          text: "",
        },
        subtitle: {
          text:
            document.ontouchstart === undefined
              ? ""
              : "Pinch the chart to zoom in",
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            text: "",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.Color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba"),
                ],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },

        series: [
          {
            type: "area",
            name: "Page Views",
            data: "",
          },
        ],
      },
      clickThrough: {
        credits: {
          enabled: false,
        },
        colors: ["#1A86D0"],
        chart: {
          zoomType: "x",
        },
        title: {
          text: "",
        },
        subtitle: {
          text:
            document.ontouchstart === undefined
              ? ""
              : "Pinch the chart to zoom in",
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            text: "",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.Color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba"),
                ],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            type: "area",
            name: "Click-Through %",
            data: "",
          },
        ],
      },
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }

  componentDidMount() {
    this.fetchPostClicks(
      this.state.username,
      this.state.lastSevenDays,
      this.state.today
    );
    this.fetchProfileViews(
      this.state.username,
      this.state.lastSevenDays,
      this.state.today
    );
    this.fetchClickThrough(
      this.state.username,
      this.state.lastSevenDays,
      this.state.today
    );
  }

  async fetchPostClicks(username, fromDate, toDate) {
    await axios
      .post("analytics/receive/analysePostClicks", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
      })
      .then((response) => {
        let data = response.data.message.data;
        this.setState({
          postClicks: {
            series: [{ data: data }],
          },
        });
        this.setState({ totalClicks: response.data.message.total_clicks });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async fetchProfileViews(username, fromDate, toDate) {
    await axios
      .post("analytics/receive/analyseProfileViews", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
      })
      .then((response) => {
        let data = response.data.message.data;
        this.setState({
          profileViews: {
            series: [{ data: data }],
          },
        });

        this.setState({ totalProfileViews: response.data.message.total_views });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async fetchClickThrough(username, fromDate, toDate) {
    await axios
      .post("analytics/receive/analyseClickThrough", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
      })
      .then((response) => {
        let data = response.data.message.data;
        this.setState({
          clickThrough: {
            series: [{ data: data }],
          },
        });
        this.setState({ totalClickThrough: response.data.message.total_ctp });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    this.fetchPostClicks(this.state.username, fromDate, toDate);
    this.fetchProfileViews(this.state.username, fromDate, toDate);
    this.fetchClickThrough(this.state.username, fromDate, toDate);
  }

  render() {
    const {
      postClicks,
      totalClicks,
      profileViews,
      totalProfileViews,
      clickThrough,
      totalClickThrough,
    } = this.state;

    return (
      <>
        <div className="container-fluid highchart-container">
          <h3 className="page-title">Konnect.bio Interactions</h3>
          <p>
            See how people are interacting with your Konnect.Bio page over time.
          </p>
          <RangePicker
            key={1}
            defaultValue={[
              moment(this.state.lastSevenDays),
              moment(this.state.today),
            ]}
            defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
            allowClear={false}
            ranges={{
              Today: [moment(), moment()],
              "Get All Records": [
                moment().subtract(200, "month"),
                moment().add(200, "month"),
              ],

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
          <hr />
          <Row>
            <Col lg={12} xs={12}>
              <Row className="analytics-heading">
                <Col lg={10} xs={12}>
                  <h5>
                    <span className="fw-semi-bold">Page Views</span>
                  </h5>
                </Col>
                <Col lg={2} xs={12}>
                  <h5>
                    <span className="right-views fw-semi-bold">
                      {totalProfileViews}
                    </span>
                  </h5>
                  <span className="">Page Views</span>
                </Col>
              </Row>
              <HighchartsReact highcharts={Highcharts} options={profileViews} />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={12} xs={12}>
              <Row className="analytics-heading">
                <Col lg={10} xs={12}>
                  <h5>
                    <span className="fw-semi-bold">Post Clicks</span>
                  </h5>
                </Col>
                <Col lg={2} xs={12}>
                  <h5>
                    <span className="right-views fw-semi-bold">
                      {totalClicks}
                    </span>
                  </h5>
                  <span className="">Post Clicks</span>
                </Col>
              </Row>
              <HighchartsReact highcharts={Highcharts} options={postClicks} />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg={12} xs={12}>
              <Row className="analytics-heading">
                <Col lg={10} xs={12}>
                  <h5>
                    <span className="fw-semi-bold">CLICK-THROUGH %</span>
                  </h5>
                </Col>
                <Col lg={2} xs={12}>
                  <h5>
                    <span className="right-views fw-semi-bold">
                      {totalClickThrough}
                    </span>
                  </h5>
                  <span className="">AVG. CLICK-THROUGH %</span>
                </Col>
              </Row>
              <HighchartsReact highcharts={Highcharts} options={clickThrough} />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default HighCharts;
