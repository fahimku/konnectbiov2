import axios from "axios";
import HtmlTable from "../../../components/HtmlTable";
import React from "react";
// import { DatePicker } from "antd";
// import moment from "moment";
import "antd/dist/antd.css";

// const {RangePicker} = DatePicker;
// const dateFormat = "YYYY-MM-DD";

class PostPerfomance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      columns: [],
      data: [],
    };
  }

  componentDidMount() {
    this.fetchPostPerformance(this.state.username, "2020-01-01", "2021-12-31");
  }

  fetchPostPerformance(username, fromDate, toDate) {
    axios
      .post("analytics/receive/analyseAllPosts", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
      })
      .then((response) => {
        this.setState({ columns: response.data.message.columns });
        this.setState({ data: response.data.message.data });
      });
  }

  render() {
    return (
      <>
        {/* <RangePicker
          key={1}
          defaultValue={[
         //   moment(this.state.lastSevenDays),
           // moment(this.state.today),
          ]}
          defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
          allowClear={false}
          ranges={{
            Today: [moment(), moment()],
            "Get All Records": [
              moment().subtract(200, "month"),
              moment().add(200, "month"),
            ],
            Today: [moment(), moment()],
            Tomorrow: [moment().add(1, "days"), moment().add(1, "days")],
            Yesterday: [
              moment().subtract(1, "days"),
              moment().subtract(1, "days"),
            ],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month"),
            ],
          }}
          style={{width: "20%"}}
          format={dateFormat}
       //   onChange={this.dateRangePickerChanger.bind(this)}
        /> */}
        <div className="container-fluid">
          {" "}
          <h3 className="page-title">Detailed Post Performance</h3>
          <HtmlTable columns={this.state.columns} rows={this.state.data} />
        </div>
      </>
    );
  }
}
export default PostPerfomance;
