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
import jsPDF from "jspdf";
import "jspdf-autotable";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

function ALLTAGS({
  title,
  getHashtag,
  tags,
  getTags,
  createTags,
  refreshTags,
}) {
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
    var msg = '';
    setSearchLoading(true);
    createTags().then((res) => {
      msg = res.data.message;
      getTags(
        {
          from_date: startDate.toString(),
          to_date: endDate.toString(),
          sort: sortBy.value,
          order_by: orderBy.value,
        },
        1
      ).then(() => {
        if(msg === "Tag already added!"){
            console.log('refresh call')
          refreshTags().then(() => {
          getTags(
            {
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
      }
        //setSearchLoading(false);
      });
    });
  }, []);

  const Onrefresh = () => {
    setSearchLoading(true);
    refreshTags().then(() => {
      getTags(
        {
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
  };

  function onSubmitData(e) {
    e.preventDefault();
    setSearchLoading(true);
    getTags(
      {
        from_date: startDate.toString(),
        to_date: endDate.toString(),
        sort: sortBy.value,
        order_by: orderBy.value,
      },
      
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
    // { value: "comments", label: "COMMENTS" },
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

  // define a generatePDF function that accepts a tickets argument
  const generatePDF = (tickets) => {
    // initialize jsPDF
    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = [
      "Sno",
      "Username",
      "Followers Count",
      "Like Count",
      "Comments Count",
      "Date",
      // "image",
    ];
    // define an empty array of rows
    const tableRows = [];

    // for each ticket pass all its data into an array
    tickets.forEach((ticket, i) => {
      const ticketData = [
        i + 1,
        ticket.username,
        ticket.followers_count,
        ticket.like_count,
        ticket.comments_count,
        new Date(ticket.timestamp).toDateString(),
        // ticket.media_url
      ];
      // push each tickcet's info into a row
      tableRows.push(ticketData);
    });

    // startY is basically margin-top
    doc.autoTable(tableColumn, tableRows);
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    // ticket title. and margin-top + margin-left
    // doc.text("Closed tickets within the last one month.", 14, 15);
    // we define the name of our PDF file.
    doc.save(`report_${dateStr}.pdf`);
  };

  return (
    <>
      <div className="container-fluid">
        <h4 className="page-title">Tags</h4>
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
                  <Button
                    onClick={Onrefresh}
                    variant="primary"
                    className="fltr-hpr"
                  >
                    Refresh
                  </Button>
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

                  {searchLoading ? (
                    <Button type="button" variant="gray" className="fltr-hpr">
                      <Loader />
                    </Button>
                  ) : (
                    <Button
                      variant="gray"
                      className="fltr-hpr btn-primary"
                      onClick={() => generatePDF(tags.message)}
                      disabled={tags.message.length === 0 ? true : false}
                    >
                      <i class="fa fa-file-pdf-o" aria-hidden="true"></i>{" "}
                      Download PDF
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

export default connect(mapStateToProps, tagActions)(ALLTAGS);
