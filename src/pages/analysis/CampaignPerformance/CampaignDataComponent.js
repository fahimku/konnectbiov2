import axios from "axios";
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import Loader from "../../../components/Loader/Loader"; // eslint-disable-line css-modules/no-unused-class
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import Select from "react-select";
import ReactPaginate from "react-paginate";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const twodecimalplace = (value = 0) => {
  return parseFloat(value).toFixed(2);
};
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
class CampaignDataComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      data: [],
      loading: false,
      fromDate: moment().subtract(30, "day").format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      today: moment(new Date()).format("YYYY-MM-DD"),
      lastYear: moment().startOf("year").format("YYYY-MM-DD"),
      page: "1",
      limit: "9",
      previous: "",
      myCategory: "",
      saveCategory: "",
      optionCategory: "",
      saveSort: "date",
      optionSort: "",
      saveSortOrder: "desc",
      optionStatus: "",
      saveStatus: "active",
      optionSortOrder: "",
      offset: 0,
      perPage: 9,
      currentPage: 0,
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    // const date_to = moment(this.state.today).format("YYYY-MM-DD");
    this.fetchPostPerformance(
      this.state.username,
      this.state.fromDate,
      moment(new Date()).format("YYYY-MM-DD"),
      this.state.saveStatus,
      this.state.limit,
      this.state.page,
      "",
      this.state.saveSort,
      this.state.saveSortOrder
    );
    this.fetchMyCategory();
  }
  async fetchPostPerformance(
    username,
    fromDate,
    toDate,
    status,
    limit,
    page,
    categoryId,
    sortId,
    orderBy
  ) {
    this.setState({ loading: true });
    await axios
      .post("analytics/receive/analyseAllPosts", {
        username: username,
        from_date: fromDate,
        to_date: toDate,
        status: status,
        page: page,
        limit: limit,
        post_type: "campaign",
        category_id: categoryId === "all" ? "" : categoryId,
        sort: sortId,
        order_by: orderBy,
      })
      .then((response) => {
        this.setState({ data: response.data.message.data, loading: false });
        this.postData();
        // if (response.data.message.hasOwnProperty("next")) {
        //   this.setState({ page: response.data.message.next.page });
        // } else {
        //   this.setState({ page: 0 });
        // }
        // if (response.data.message.hasOwnProperty("previous")) {
        //   this.setState({ previous: response.data.message.previous.page });
        // } else {
        //   this.setState({ previous: 0 });
        // }
      });
  }

  fetchMyCategory = async () => {
    await axios
      .get("/users/receive/categories")
      .then((response) => {
        const selectCategories = [];
        const myCategories = response.data.message;
        myCategories.map(({ category_id, category_name, image_url }) => {
          return selectCategories.push({
            value: category_id,
            label: category_name,
            image: image_url,
          });
        });
        let all = {};
        all.value = "all";
        all.label = "ALL";
        selectCategories.unshift(all);
        this.setState({ myCategory: selectCategories });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  dateRangePickerChanger(value, dataString) {
    let fromDate = dataString[0];
    let toDate = dataString[1];
    this.setState({ fromDate: fromDate, toDate: toDate });
    // this.fetchPostPerformance(
    //   this.state.username,
    //   fromDate,
    //   toDate,
    //   this.state.limit,
    //   1
    // );
  }
  pagination = () => {
    let { username, fromDate, saveStatus, toDate, limit, page } = this.state;
    this.fetchPostPerformance(
      username,
      fromDate,
      toDate,
      saveStatus,
      limit,
      page,
      this.state.saveCategory,
      this.state.saveSort,
      this.state.saveSortOrder
    );
  };

  paginationPrev = () => {
    let { username, fromDate, toDate, saveStatus, limit, previous } =
      this.state;
    this.fetchPostPerformance(
      username,
      fromDate,
      toDate,
      saveStatus,
      limit,
      previous,
      this.state.saveCategory,
      this.state.saveSort,
      this.state.saveSortOrder
    );
  };

  disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  handleSelect = (event) => {
    this.setState({
      saveCategory: event.value,
      optionCategory: event,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      offset: 0,
      currentPage: 0,
    });
    this.fetchPostPerformance(
      this.state.username,
      this.state.fromDate,
      this.state.toDate,
      this.state.saveStatus,
      this.state.limit,
      this.state.page,
      this.state.saveCategory,
      this.state.saveSort,
      this.state.saveSortOrder
    );
  };
  clearFilter = () => {
    this.setState({
      optionCategory: "",
      optionSort: "",
      optionSortOrder: "",
      saveCategory: "",
      optionStatus: "",
      // saveSort: "",
      // saveSortOrder: "",
      fromDate: moment().subtract(30, "day").format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
    });

    this.fetchPostPerformance(
      this.state.username,
      moment().subtract(30, "day").format("YYYY-MM-DD"),
      moment(new Date()).format("YYYY-MM-DD"),
      "active",
      this.state.limit,
      this.state.page,
      "",
      this.state.saveSort,
      "desc"
    );
  };
  handleSort = (event) => {
    this.setState({
      saveSort: event.value,
      optionSort: event,
    });
  };

  handleStatus = (event) => {
    console.log("event", event);
    this.setState({
      saveStatus: event.value,
      optionStatus: event,
    });
  };

  handleSortOrder = (event) => {
    this.setState({
      saveSortOrder: event.value,
      optionSortOrder: event,
    });
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    console.log(selectedPage, "selectedPage");
    console.log(offset, "offset");

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.postData();
      }
    );
  };

  postData = () => {
    const data = this.state.data;
    const slice = data.slice(
      this.state.offset,
      this.state.offset + this.state.perPage
    );
    const postData = slice.map((record) => (
      <React.Fragment>
        <Col xs={12} xl={4} md={6}>
          <div className="card analytic-box">
            <div className="card-row row">
              <div className="any-post-img-col col-6">
                <div className="any-post-image">
                  <div className="any-image-box">
                    <div className="any-image-box-iner">
                      <img
                        src={record.media_url}
                        className="img-fluid media-image"
                        alt={record.media_type}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 analytic-caption">
                <div className="row count-main-box">
                  <div className="col-12 count-box">
                    <h5 className="count-title">Impressions</h5>
                    <h3 className="count">{numberWithCommas(record.views)}</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Clicks</h5>
                    <h3 className="count">{numberWithCommas(record.clicks)}</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Engagement</h5>
                    <h3 className="count">{twodecimalplace(record.ctr)}%</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Start Date</h5>
                    <h3 className="count">{record.start_date}</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">End Date</h5>
                    <h3 className="count">{record.end_date}</h3>
                  </div>
                  {/* <div className="col-12 count-box">
                    <h5 className="count-title">Revenue</h5>
                    <h3 className="count">{record.revenue}</h3>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </React.Fragment>
    ));

    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      postData,
    });
  };
  render() {
    const sortOptions = [
      { value: "date", label: "DATE" },
      { value: "impressions", label: "IMPRESSIONS" },
      { value: "clicks", label: "CLICKS" },
      { value: "engagement", label: "ENGAGEMENT" },
      // { value: "revenue", label: "Revenue" },
    ];

    const statusOptions = [
      { value: "active", label: "ACTIVE" },
      { value: "deactive", label: "PAUSED" },
      { value: "expired", label: "EXPIRED" },
    ];

    const sortOrderOptions = [
      { value: "asc", label: "ASC" },
      { value: "desc", label: "DESC" },
    ];
    const style = {
      control: (base, state) => ({
        ...base,
        height: "44px",
        boxShadow: "none",
        "&:hover": {
          // border: "1px solid black",
        },
      }),
    };

    return (
      <>
        <Row className="post-analytics-tab">
          <Col xs={12} xl={12} md={12}>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Col xs={12} xl={2} md={6}>
                  <p>Select Start Date / End Date</p>
                  <RangePicker
                    disabledDate={this.disabledDate}
                    key={4}
                    defaultValue={[
                      moment(this.state.lastYear),
                      moment(this.state.today),
                    ]}
                    value={[
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
                </Col>
                <Col xs={12} xl={2} md={6}>
                  <p>Status</p>
                  <Select
                    name="status"
                    className="selectCustomization"
                    options={statusOptions}
                    value={
                      this.state.optionStatus === ""
                        ? { value: "active", label: "ACTIVE" }
                        : this.state.optionStatus
                    }
                    placeholder="Select Status"
                    onChange={(event) => this.handleStatus(event)}
                    // isDisabled={this.state.optionSort === "" ? true : false}
                    styles={style}
                  />
                </Col>
                <Col xs={12} xl={2} md={6}>
                  <p>Select Category</p>
                  <Select
                    name="category"
                    className="selectCustomization"
                    options={this.state.myCategory}
                    // value={this.state.optionCategory}
                    value={
                      this.state.optionCategory === ""
                        ? { value: "all", label: "ALL" }
                        : this.state.optionCategory
                    }
                    placeholder="Select Category"
                    onChange={(event) => this.handleSelect(event)}
                    styles={style}
                  />
                </Col>
                <Col xs={12} xl={2} md={6}>
                  <p>Sort By</p>
                  <Select
                    name="sort"
                    className="selectCustomization"
                    options={sortOptions}
                    // value={this.state.optionSort}
                    value={
                      this.state.optionSort === ""
                        ? { value: "date", label: "DATE" }
                        : this.state.optionSort
                    }
                    placeholder="Sort By"
                    onChange={(event) => this.handleSort(event)}
                    styles={style}
                  />
                </Col>
                <Col xs={12} xl={2} md={6}>
                  <p>Order By</p>
                  <Select
                    name="sort"
                    className="selectCustomization"
                    options={sortOrderOptions}
                    value={
                      this.state.optionSortOrder === ""
                        ? { value: "desc", label: "DESC" }
                        : this.state.optionSortOrder
                    }
                    placeholder="Order By"
                    onChange={(event) => this.handleSortOrder(event)}
                    // isDisabled={this.state.optionSort === "" ? true : false}
                    styles={style}
                  />
                </Col>
                <Col className="d-flex" xs={12} xl={2} md={6}>
                  <Button
                    type="submit"
                    variant="primary"
                    className="fltr-hpr btn btn-primary"
                  >
                    Search
                  </Button>
                  <Button
                    onClick={this.clearFilter}
                    variant="gray"
                    className="fltr-hpr btn btn-primary"
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>

        <hr />
        {this.state.loading ? (
          <Loader className="analytics-loading" size={60} />
        ) : !this.state.data.length ? (
          <NoDataFound />
        ) : (
          <>
            <Row className="af-rm-mn">{this.state.postData}</Row>

            <ReactPaginate
              previousLabel=""
              nextLabel=""
              pageClassName="page-item "
              pageLinkClassName="page-link custom-paginate-link btn btn-primary"
              previousClassName="page-item"
              previousLinkClassName="page-link custom-paginate-prev btn btn-primary"
              nextClassName="page-item"
              nextLinkClassName="page-link custom-paginate-next btn btn-primary"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={
                "pagination justify-content-center mt-2 custom-paginate"
              }
              // subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </>
        )}
        {/* {this.state.loading || !this.state.data.length ? null : (
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
        )} */}
      </>
    );
  }
}
export default CampaignDataComponent;
