import React from "react";
import moment from "moment";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { getBioShopSummary } from "../../../actions/bioShopSummary";

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

class BioShopSummaryComponent extends React.Component {
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
            getBioShopSummary(
                this.state.username,
                this.state.fromDate,
                this.state.toDate,
                this.state.limit,
                this.state.page
            )
        );
    }

    dateRangePickerChanger(value, dataString) {
        let fromDate = dataString[0];
        let toDate = dataString[1];
        this.setState({ fromDate: fromDate, toDate: toDate });
        this.props.dispatch(
            getBioShopSummary(
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
        const data = this.props.bioShopSummary.bioshop_summary;
        return (
            <>
                <div className="summary_container_main">
                    <div className="summary_box_main">
                        <div
                            className={`summary_block_profile ${this.props.packageName === "61d695e9bccdaf69f46efc66" ? "summary_height": ""}`}>
                            <div className="summary_content_profile">
                                <h4 className="page-title">BioShop Summary</h4>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
function mapStateToProps({ bioShopSummary }) {
    return {
        bioShopSummary: bioShopSummary,
    };
}
export default connect(mapStateToProps)(BioShopSummaryComponent);