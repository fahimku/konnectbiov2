import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import * as affiliateTransactionsActions from "../../../actions/marketPlaceSales";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import moment from "moment";
import { DatePicker } from "antd";
import numeral from "numeral";
// import CampaignDetailTransaction from "./CampaignDetailTransaction";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function AffiliateSalesInf({
  getAffiliateSalesByInfluencer,
  affiliateSalesInf,
}) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const fromDate = moment().startOf("month").format("YYYY-MM-DD");
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  const [groupBy, setGroupBy] = useState({
    label: "Summary",
    value: "influencer",
  });

  const [filterDisable, setFilterDisable] = useState("");
  const [submit, setSubmit] = useState("influencer");

  const groupByList = [
    {
      label: "Summary",
      value: "influencer",
    },
    {
      label: "Detailed",
      value: "",
    },
    {
      label: "Date",
      value: "date",
    },
    {
      label: "Campaign",
      value: "campaign",
    },
    {
      label: "Brand",
      value: "brand",
    },
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
  const limit = 12;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo"));
    const accountType = currentUser.account_type;

    if (accountType === "influencer") {
      getAffiliateSalesByInfluencer(
        groupBy.value,
        1,
        limit,
        startDate,
        endDate
      ).then(() => {
        setLoading(false);
      });
    }
  }, []);

  const dateRangePickerChanger = (value, dataString) => {
    const startDate = dataString[0];
    const endDate = dataString[1];
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setCurrentPage(0);
    getAffiliateSalesByInfluencer(
      groupBy.value,
      1,
      limit,
      startDate,
      endDate
    ).then((data) => {
      setLoading(false);
      setSubmit(groupBy.value);
    });
  };

  const handlePageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setLoading(true);
    getAffiliateSalesByInfluencer(
      groupBy.value,
      page + 1,
      limit,
      startDate,
      endDate
    ).then(() => {
      if (affiliateSalesInf?.message?.data?.length > 0) {
        setLoading(false);
      }
    });
  };

  const changegroupBy = (e) => {
    setGroupBy(e);
  };
  const refreshPage = (e) => {
    setCurrentPage(0);
    setLoading(true);
    setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
    setEndDate(moment(new Date()).format("YYYY-MM-DD"));
    getAffiliateSalesByInfluencer(
      "influencer",
      1,
      limit,
      moment().startOf("month").format("YYYY-MM-DD"),
      moment(new Date()).format("YYYY-MM-DD")
    ).then(() => {
      setLoading(false);
    });
    setGroupBy({
      label: "Summary",
      value: "influencer",
    });
    setSubmit("influencer");
  };

  const filterDate = (sDate, eDate, filterType) => {
    setLoading(true);
    setFilterDisable(filterType);
    setStartDate(sDate);
    setEndDate(eDate);
    setGroupBy({
      label: "Summary",
      value: "influencer",
    });
    getAffiliateSalesByInfluencer(groupBy.value, 1, limit, sDate, eDate).then(
      () => {
        setLoading(false);
      }
    );
  };

  function allTable() {
    let data = affiliateSalesInf?.message?.data;
    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box">
              <thead className="table_heading">
                <tr>
                  <th>S.#</th>
                  <th>Date</th>
                  <th>Campaign Name</th>
                  <th>Brand Name</th>
                  <th>Order#</th>
                  <th>Qty</th>
                  <th>Gross Sales</th>
                  <th>Net Sales</th>
                  <th>Commission Earn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {!item?.created_date
                          ? "-"
                          : moment(item?.created_date).format("YYYY-MM-DD")}
                      </td>
                      <td>{item?.campaign_name}</td>
                      <td>{item?.advertiser_name}</td>
                      <td>{item?.order_id}</td>
                      <td>{item?.total_qty}</td>
                      <td>{numeral(item?.total_sale).format("$0,0.0'")}</td>
                      <td>
                        {numeral(item?.order_totalprice).format("$0,0.0'")}
                      </td>
                      <td>
                        {item?.influencer_commission
                          ? numeral(item?.influencer_commission).format(
                              "$0,0.0'"
                            )
                          : "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  }

  function dateTable() {
    let data = affiliateSalesInf?.message?.data;
    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box">
              <thead className="table_heading">
                <tr>
                  <th>S.#</th>
                  <th>Date</th>
                  <th>Total Qty</th>
                  <th>Gross Sales</th>
                  <th>Net Sales</th>
                  <th>Commission Earn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {!item?.created_date
                          ? "-"
                          : moment(item?.created_date).format("YYYY-MM-DD")}
                      </td>
                      <td>{item?.total_qty}</td>
                      <td>{numeral(item?.total_sale).format("$0,0.0'")}</td>
                      <td>
                        {numeral(item?.order_totalprice).format("$0,0.0'")}
                      </td>
                      <td>
                        {item?.influencer_commission
                          ? numeral(item?.influencer_commission).format(
                              "$0,0.0'"
                            )
                          : "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  }
  function campaignTable() {
    let data = affiliateSalesInf?.message?.data;
    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box">
              <thead className="table_heading">
                <tr>
                  <th>S.#</th>
                  <th>Campaign Name</th>
                  <th>Brand Name</th>
                  <th>Total Qty</th>
                  <th>Gross Sales</th>
                  <th>Net Sales</th>
                  <th>Commission Earn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.campaign_name}</td>
                      <td>{item?.advertiser_name}</td>
                      <td>{item?.total_qty}</td>
                      <td>{numeral(item?.total_sale).format("$0,0.0'")}</td>
                      <td>
                        {numeral(item?.order_totalprice).format("$0,0.0'")}
                      </td>
                      <td>
                        {item?.influencer_commission
                          ? numeral(item?.influencer_commission).format(
                              "$0,0.0'"
                            )
                          : "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  }
  function brandTable() {
    let data = affiliateSalesInf?.message?.data;
    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box">
              <thead className="table_heading">
                <tr>
                  <th>S.#</th>
                  <th>Brand Name</th>
                  <th>Total Qty</th>
                  <th>Gross Sales</th>
                  <th>Net Sales</th>
                  <th>Commission Earn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.advertiser_name}</td>
                      <td>{item?.total_qty}</td>
                      <td>{numeral(item?.total_sale).format("$0,0.0'")}</td>
                      <td>
                        {numeral(item?.order_totalprice).format("$0,0.0'")}
                      </td>
                      <td>
                        {item?.influencer_commission
                          ? numeral(item?.influencer_commission).format(
                              "$0,0.0'"
                            )
                          : "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  }
  function summaryTable() {
    let data = affiliateSalesInf?.message?.data;
    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box">
              <thead className="table_heading">
                <tr>
                  <th>S.#</th>
                  <th>Influencer Name</th>
                  <th>Gross Sales</th>
                  <th>Net Sales</th>
                  <th>Commission Earn</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item?.influencer_name}</td>

                      <td>{numeral(item?.total_sale).format("$0,0.0'")}</td>
                      <td>
                        {numeral(item?.order_totalprice).format("$0,0.0'")}
                      </td>
                      <td>
                        {item?.influencer_commission
                          ? numeral(item?.influencer_commission).format(
                              "$0,0.0'"
                            )
                          : "$0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      );
    }
  }
  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Earnings</h4>
        <div className="brand_container_main aff-payment">
          <Row className="filter-date mb-3">
            <div className="col-md-12">
              <button
                class="btn btn-primary btn-sm"
                onClick={() =>
                  filterDate(
                    moment(new Date()).format("YYYY-MM-DD"),
                    moment(new Date()).format("YYYY-MM-DD"),
                    "today"
                  )
                }
                disabled={filterDisable === "today" ? true : false}
              >
                Today
              </button>
              <button
                class="btn btn-primary btn-sm"
                onClick={() =>
                  filterDate(
                    moment().startOf("month").format("YYYY-MM-DD"),
                    moment(new Date()).format("YYYY-MM-DD"),
                    "month"
                  )
                }
                disabled={
                  filterDisable === "month" || filterDisable === ""
                    ? true
                    : false
                }
              >
                MTD
              </button>
              <button
                class="btn btn-primary btn-sm"
                onClick={() =>
                  filterDate(
                    moment().startOf("year").format("YYYY-MM-DD"),
                    moment(new Date()).format("YYYY-MM-DD"),
                    "year"
                  )
                }
                disabled={filterDisable === "year" ? true : false}
              >
                YTD
              </button>
            </div>
          </Row>
          <Row>
            <div className="col-md-12">
              <form className="mb-3" onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} xl={3} md={6}>
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

                  <Col xs={12} xl={3} md={6}>
                    <p>Group By</p>
                    <Select
                      value={groupBy}
                      name="campaign"
                      className="selectCustomization"
                      options={groupByList}
                      placeholder="Select Group By"
                      onChange={changegroupBy}
                      styles={style}
                    />
                  </Col>

                  <Col
                    className="transaction-search d-flex"
                    xs={12}
                    xl={3}
                    md={3}
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      className="fltr-hpr"
                    >
                      Search
                    </Button>
                    {loading ? (
                      <Button
                        className="fltr-hpr btn-gray"
                        type="button"
                        variant="primary"
                      >
                        <Loader size="30" />
                      </Button>
                    ) : (
                      <Button
                        className="fltr-hpr btn-gray"
                        onClick={refreshPage}
                        type="button"
                        variant="primary"
                      >
                        Refresh
                      </Button>
                    )}
                  </Col>
                </Row>
              </form>

              {loading ? (
                <Loader size="30" />
              ) : (
                <>
                  {affiliateSalesInf?.message?.data?.length === 0 ? (
                    <>
                      <NoDataFound />
                    </>
                  ) : (
                    <>
                      {submit === "influencer" || submit === undefined
                        ? summaryTable()
                        : null}
                      {submit === "" || submit === undefined
                        ? allTable()
                        : null}
                      {submit === "date" || submit === undefined
                        ? dateTable()
                        : null}
                      {submit === "campaign" || submit === undefined
                        ? campaignTable()
                        : null}
                      {submit === "brand" || submit === undefined
                        ? brandTable()
                        : null}
                    </>
                  )}
                </>
              )}

              {affiliateSalesInf?.message?.data?.length > 0 && !loading && (
                <Row>
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
                    forcePage={currentPage}
                    pageCount={Math.ceil(
                      affiliateSalesInf?.message?.total_records / limit
                    )}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination justify-content-center mt-2 custom-paginate"
                    }
                    // subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </Row>
              )}
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({ affiliateSalesInf, getAffiliateSalesByInfluencer }) {
  return {
    affiliateSalesInf,
    getAffiliateSalesByInfluencer,
  };
}
export default connect(mapStateToProps, { ...affiliateTransactionsActions })(
  AffiliateSalesInf
);
