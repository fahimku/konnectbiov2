import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import Box from "./Box";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { DatePicker } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import * as tagActions from "../../../actions/tags";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

function CommentTags({ title, getHashtag, tags, getTags, createTags }) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const [brand, setBrand] = useState({ value: "all", label: "All" });
  const [sortBy, setSortBy] = useState({
    value: "date",
    label: "DATE",
  });
  const [orderBy, setOrderBy] = useState({ value: "desc", label: "DESC" });
  const fromDate = moment().subtract(4, "year").format("YYYY-MM-DD");
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);

  useEffect(() => {
    setSearchLoading(true);
    createTags().then(() => {
      getTags(
        {
          type: "caption",
          from_date: startDate.toString(),
          to_date: endDate.toString(),
          sort: sortBy.value,
          order_by: orderBy.value,
        },
        1
      ).then(() => {
        setSearchLoading(false);
      });
    });
  }, []);

  function onSubmitData(e) {
    e.preventDefault();
    setSearchLoading(true);
    getTags(
      {
        type: "caption",
        from_date: startDate.toString(),
        to_date: endDate.toString(),
        sort: sortBy.value,
        order_by: orderBy.value,
      },
      1
    ).then(() => {
      setSearchLoading(false);
    });
  }

  const clearMarketPlace = (e) => {
    setClearLoading(true);
    setBrand({ value: "all", label: "ALL" });
    setSortBy({ value: "date", label: "DATE" });
    setOrderBy({ value: "desc", label: "DESC" });
    getTags({
      type: "caption",
      from_date: fromDate.toString(),
      to_date: toDate.toString(),
      sort: "date",
      order_by: "desc",
    }).then(() => {
      setClearLoading(false);
    });
  };

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

  const sortByOptions = [
    { value: "date", label: "DATE" },
    { value: "followers", label: "MOST INFLUENTIAL" },
    // { value: "likes", label: "LIKES" },
  ];
  const sortOrderOptions = [
    { value: "asc", label: "ASC" },
    { value: "desc", label: "DESC" },
  ];

  const dateRangePickerChanger = (value, dataString) => {
    const startDate = dataString[0];
    const endDate = dataString[1];
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <>
      <div className="container-fluid">
        <h4 className="page-title">Captions</h4>
        <Row className="post-analytics-tab mb-4">
          <Col xs={12} xl={12} md={12}>
            <form onSubmit={onSubmitData}>
              <Row>
                <Col className="col-xl-2dot4" xs={12} md={6}>
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
                </Col>
                <Col className="col-xl-2dot4" xs={12} md={6}>
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
                    isSearchable={false}
                  />
                </Col>
                {/* <Col className="col-xl-2dot4" xs={12} md={6}>
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
                    isSearchable={false}
                  />
                </Col> */}
                <Col className="d-flex col-xl-2dot4" xs={12} md={6}>
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
                    <Button variant="gray" className="fltr-hpr btn-primary">
                      <Loader />
                    </Button>
                  ) : (
                    <Button
                      onClick={clearMarketPlace}
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
        <hr />
        <div style={{ marginTop: 20 }}>
          {searchLoading || clearLoading ? (
            <div
              style={{
                height: 300,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Loader size={30} />
            </div>
          ) : tags.message.length > 0 ? (
            <InfiniteScroll
              dataLength={tags.message.length}
              next={() => {
                getTags(
                  {
                    type: "caption",
                    from_date: startDate.toString(),
                    to_date: endDate.toString(),
                    sort: sortBy.value,
                    order_by: orderBy.value,
                  },
                  tags.pagination.next?.page,
                  true
                );
              }}
              // hasMore={tags.pagination.next ? true : false}
              hasMore={
                tags.pagination.next
                  ? tags.pagination.next?.page >= 1
                    ? false
                    : true
                  : false
              }
              loader={
                <div
                  style={{
                    height: 100,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Loader size={40} />
                </div>
              }
            >
              <div>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{
                    350: 1,
                    700: 2,
                    1100: 3,
                    1500: 4,
                  }}
                >
                  <Masonry gutter="15px">
                    {tags.message.map((item) => {
                      return <Box data={item} />;
                    })}
                  </Masonry>
                </ResponsiveMasonry>
              </div>
            </InfiniteScroll>
          ) : (
            <NoDataFound />
          )}
        </div>
      </div>
    </>
  );
}

function mapStateToProps({ tags }) {
  return { tags };
}

export default connect(mapStateToProps, tagActions)(CommentTags);
