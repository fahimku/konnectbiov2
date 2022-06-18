import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as instagramActions from "../../../actions/instagramAnalytic";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import { Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import numeral from "numeral";
// import InfiniteScroll from "react-infinite-scroll-component";
import InfiniteScroll from "react-infinite-scroller";

import Select from "react-select";
// import { DatePicker } from "antd";
// const { RangePicker } = DatePicker;
// const dateFormat = "YYYY-MM-DD";

function InstagramDataComponent({
  getInstagramAnalytic,
  instagramAnalytic,
  filterInstagramAnalytic,
  type,
}) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [sortBy, setSortBy] = useState({
    value: "timestamp",
    label: "DATE",
  });
  const [orderBy, setOrderBy] = useState({ value: "desc", label: "DESC" });
  const [limitBy, setLimitBy] = useState({ value: 50, label: "50" });
  // const fromDate = moment().subtract(4, "year").format("YYYY-MM-DD");
  // const toDate = moment(new Date()).format("YYYY-MM-DD");
  // const [startDate, setStartDate] = useState(fromDate);
  // const [endDate, setEndDate] = useState(toDate);
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  useEffect(() => {
    getInstagramAnalytic(null, null, 300).then(() => {
      setClearLoading(false);
    });
  }, []);
  function onSubmitData(e) {
    e.preventDefault();
    setSearchLoading(true);
    filterInstagramAnalytic({
      sort: sortBy.value,
      order_by: orderBy.value,
      limit_by: limitBy.value,
    }).then(() => {
      setSearchLoading(false);
    });
  }
  const clearInstagramFilter = (e) => {
    setClearLoading(true);
    setSortBy({ value: "timestamp", label: "DATE" });
    setOrderBy({ value: "desc", label: "DESC" });
    setLimitBy({ value: 50, label: "50" });
    filterInstagramAnalytic({
      sort: "timestamp",
      order_by: "desc",
      limit_by: 50,
    }).then(() => {
      setClearLoading(false);
    });
  };

  const sortByOptions = [
    { value: "timestamp", label: "DATE" },
    { value: "like_count", label: "LIKES" },
    { value: "comments_count", label: "COMMENTS" },
    { value: "engagement", label: "ENGAGEMENT" },
    { value: "impressions", label: "IMPRESSIONS" },
    { value: "reach", label: "REACH" },
  ];
  // const sortOrderOptions = [
  //   { value: "asc", label: "ASC" },
  //   { value: "desc", label: "DESC" },
  // ];
  const limitOptions = [
    { value: 50, label: "50" },
    { value: 100, label: "100" },
    { value: 300, label: "300" },
    // { value: 500, label: "500" },
    // { value: 1000, label: "1000" },
  ];

  // const dateRangePickerChanger = (value, dataString) => {
  //   const startDate = dataString[0];
  //   const endDate = dataString[1];
  //   setStartDate(startDate);
  //   setEndDate(endDate);
  // };

  const style = {
    control: (base) => ({
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
      <div class="instagram-analytics">
        {instagramAnalytic?.loading ? (
          <Loader size={30} />
        ) : instagramAnalytic?.insta_data?.length > 0 ? (
          <>
            {true ? (
              <Row className="post-analytics-tab mb-4">
                <Col xs={12} xl={12} md={12}>
                  <form onSubmit={onSubmitData}>
                    <Row>
                      {/* <Col xs={12} xl={2} md={6}>
                  <p>Select Start Date / End Date</p>
                  <RangePicker
                    key={4}
                    value={
                      startDate && endDate
                        ? [moment(startDate), moment(endDate)]
                        : []
                    }
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
                    onChange={dateRangePickerChanger}
                  />
                </Col> */}
                      <Col xs={12} xl={2} md={6}>
                        <p>Sort By</p>
                        <Select
                          value={sortBy}
                          name="sort"
                          className="selectCustomization"
                          options={sortByOptions}
                          onChange={(e) => {
                            setSortBy(e);
                          }}
                          placeholder="Sort By"
                          styles={style}
                        />
                      </Col>
                      {/* <Col xs={12} xl={2} md={6}>
                        <p>Order By</p>
                        <Select
                          value={orderBy}
                          name="order"
                          className="selectCustomization"
                          options={sortOrderOptions}
                          onChange={(e) => {
                            setOrderBy(e);
                          }}
                          placeholder="Order By"
                          styles={style}
                        />
                      </Col> */}
                      <Col xs={12} xl={2} md={6}>
                        <p>Limit By</p>
                        <Select
                          value={limitBy}
                          name="order"
                          className="selectCustomization"
                          options={limitOptions}
                          onChange={(e) => {
                            setLimitBy(e);
                          }}
                          placeholder="Limit By"
                          styles={style}
                        />
                      </Col>
                      <Col className="d-flex" xs={12} xl={2} md={6}>
                        {searchLoading ? (
                          <Button
                            type="button"
                            variant="primary"
                            className="fltr-hpr"
                          >
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="primary"
                            className="fltr-hpr"
                          >
                            Search
                          </Button>
                        )}
                        {clearLoading ? (
                          <Button
                            variant="gray"
                            className="fltr-hpr btn-primary"
                          >
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            onClick={clearInstagramFilter}
                            variant="gray"
                            className="fltr-hpr btn-primary"
                          >
                            Reset
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </form>
                </Col>
              </Row>
            ) : (
              <Loader size={30} />
            )}
            <hr />
            <InfiniteScroll
              // getScrollParent={() => document.getElementById("scrollableDiv")}
              pageStart={0}
              className="af-rm-mn row"
              // loadMore={() =>
              //   getInstagramAnalytic(instagramAnalytic?.pagination?.next, true)
              // }
              // hasMore={instagramAnalytic?.pagination?.next ? true : false}
              hasMore={false}
              threshold={5}
              loader={
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    <i
                      className="la la-spinner la-spin"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </div>
              }
              useWindow={false}
            >
              {" "}
              {instagramAnalytic?.insta_data?.map((record) => (
                <Col xs={12} xl={4} md={6}>
                  <div className="card analytic-box">
                    <div className="card-row row">
                      <div className="any-post-img-col col-6">
                        <div className="any-post-image">
                          <div className="any-image-box">
                            <div className="any-image-box-iner">
                              {type !== "post" ? (
                                record.media_type === "IMAGE" ||
                                record.media_type === "CAROUSEL_ALBUM" ? (
                                  <img
                                    src={record.media_url}
                                    className="img-fluid media-image"
                                    alt={record.media_type}
                                  />
                                ) : (
                                  <video
                                    className="media-video media-image"
                                    // controlsList="nodownload"
                                    controls
                                  >
                                    <source
                                      src={record.media_url}
                                      type="video/mp4"
                                    ></source>
                                  </video>
                                )
                              ) : (
                                <a
                                  href={record.permalink}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {record.media_type === "IMAGE" ||
                                  record.media_type === "CAROUSEL_ALBUM" ? (
                                    <img
                                      src={record.media_url}
                                      className="img-fluid media-image"
                                      alt={record.media_type}
                                    />
                                  ) : (
                                    <video
                                      className="media-video media-image"
                                      // controlsList="nodownload"
                                      controls
                                    >
                                      <source
                                        src={record.media_url}
                                        type="video/mp4"
                                      ></source>
                                    </video>
                                  )}
                                </a>
                              )}
                            </div>
                            {record.media_type === "VIDEO" ? (
                              <i class="fa fa-play video-icon"></i>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 analytic-caption">
                        <div className="row count-main-box">
                          <div className="col-12 count-box">
                            <h5 className="count-title">Like Count</h5>
                            <h3 className="count">
                              {numeral(record.like_count).format("0,0")}
                            </h3>
                          </div>
                          <div className="col-12 count-box">
                            <h5 className="count-title">Comment Count</h5>
                            <h3 className="count">
                              {numeral(record.comments_count).format("0,0")}
                            </h3>
                          </div>
                          <div className="col-12 count-box">
                            <h5 className="count-title">Engagement</h5>
                            <h3 className="count">
                              {numeral(record.insights[0].engagement).format(
                                "0,0"
                              )}
                            </h3>
                          </div>
                          <div className="col-12 count-box">
                            <h5 className="count-title">Impressions</h5>
                            <h3 className="count">
                              {numeral(record.insights[1].impressions).format(
                                "0,0"
                              )}
                            </h3>
                          </div>
                          <div className="col-12 count-box">
                            <h5 className="count-title">Reach</h5>
                            <h3 className="count">
                              {numeral(record.insights[2].reach).format("0,0")}
                            </h3>
                          </div>
                          <div className="col-12 count-box">
                            <h5 className="count-title">Posted Date</h5>
                            <h3 className="count">
                              {moment(record.timestamp).format("YYYY-MM-DD")}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </InfiniteScroll>

            <i
              class="fa fa fa-angle-up scrollTop"
              onClick={scrollTop}
              style={{ height: 40, display: showScroll ? "flex" : "none" }}
            ></i>
          </>
        ) : (
          <div
            style={{
              height: 300,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NoDataFound />
          </div>
        )}
      </div>
    </>
  );
}
function mapStateToProps({ instagramAnalytic }) {
  return {
    instagramAnalytic,
  };
}
export default connect(
  mapStateToProps,
  instagramActions
)(InstagramDataComponent);
