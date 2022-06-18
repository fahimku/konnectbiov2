import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";
//import { toast } from "react-toastify";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import Loader from "../../../components/Loader/Loader";
import Box from "../Box";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
//import ReactPaginate from "react-paginate";
import { DatePicker } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import * as hashActions from "../../../actions/hashtags";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

function TopHashTag({
  getHashtag,
  hashtags,
  hashtag,
  clearHashtag,
}) {

  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [brand, setBrand] = useState("");

  const [sortBy, setSortBy] = useState({
    value: "date",
    label: "DATE",
  });

  const [orderBy, setOrderBy] = useState({ value: "desc", label: "DESC" });
  const [currentPage, setCurrentPage] = useState(0);

  // const fromDate = moment().subtract(2, "year").format("YYYY-MM-DD");
  const fromDate = moment()
    .subtract(2, "year")
    .startOf("year")
    .format("YYYY-MM-DD");
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  const limit = 8;


  useEffect(() => {

    return () => clearHashtag();
  }, []);

  function onSubmitData(e) {
    e.preventDefault();
    if (brand.value) {
      setSearchLoading(true);
      getHashtag(
        {
          hashtag_id: brand.value,
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
  }


  const clearMarketPlace = (e) => {
    // setClearLoading(true);
    // setBrand({ value: "all", label: "ALL" });
    setBrand("");
    setSortBy({ value: "date", label: "DATE" });
    setOrderBy({ value: "desc", label: "DESC" });
    clearHashtag();

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
  ];
 

  const dateRangePickerChanger = (value, dataString) => {
    const startDate = dataString[0];
    const endDate = dataString[1];
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // if (!loading) {
  return (
    <>
      <div className="container-fluid">
        <h4 className="page-title">Monitor</h4>
        <Row className="post-analytics-tab mb-4">
          <Col xs={12} xl={12} md={12}>
            <form onSubmit={onSubmitData}>
              <Row>
                <Col xs={12} className="col-xl-2dot4" md={6}>
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
                <Col xs={12} className="col-xl-2dot4" md={6}>
                  <p>Hashtags</p>
                  <Select
                    value={brand}
                    name="sort"
                    className="selectCustomization"
                    options={[
                      // { hashtag_id: "all", hashtag: "ALL" },
                      ...hashtags.message,
                    ].map((item) => {
                      return {
                        value: item.hashtag_id,
                        label: item.hashtag,
                      };
                    })}
                    onChange={(e) => {
                      setBrand(e);
                    }}
                    placeholder="Select Hashtags"
                    styles={style}
                    isSearchable={false}
                  />
                </Col>
               
                <Col xs={12} className="col-xl-2dot4" md={6}>
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
                      disabled={brand.value ? false : true}
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
          ) : hashtag.message.length > 0 ? (
            <InfiniteScroll
              dataLength={hashtag.message.length}
              next={() => {
                getHashtag(
                  {
                    hashtag_id: brand.value,
                    from_date: startDate.toString(),
                    to_date: endDate.toString(),
                    sort: sortBy.value,
                    order_by: orderBy.value,
                  },
                  hashtag.pagination.next?.page,
                  true
                );
              }}
              // hasMore={hashtag.pagination.next ? true : false}
              hasMore={
                hashtag.pagination.next
                  ? hashtag.pagination.next?.page >= 1
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
            // pullDownToRefreshThreshold={50}
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
                    {hashtag.message.map((item) => {
                      return <Box data={item} />;
                    })}
                  </Masonry>
                </ResponsiveMasonry>
              </div>
            </InfiniteScroll>
          ) : hashtag.success ? (
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
          ) : null}
        </div>
      </div>
    </>
  );
}

function mapStateToProps({ hashtags, hashtag }) {
  return { hashtags, hashtag };
}

export default connect(mapStateToProps, hashActions)(TopHashTag);
