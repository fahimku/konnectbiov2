import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import * as shopifyTracker from "../../../actions/shopifyTracker";
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

function Shopifytracker({ getShopifyTracker, shopifyTracker }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const fromDate = moment().startOf("month").format("YYYY-MM-DD");
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  const [groupBy, setGroupBy] = useState({
    label: "Summary",
    value: "brand",
  });
  const [submit, setSubmit] = useState("brand");
  const [filterDisable, setFilterDisable] = useState("");

  const groupByList = [
    {
      label: "Summary",
      value: "brand",
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
      label: "Influencer",
      value: "influencer",
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
  const upperLimit = (currentPage + 1) * limit;
  const lowerLimit = upperLimit - limit + 1;

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo"));
    const accountType = currentUser.account_type;

    if (accountType === "brand") {
      getShopifyTracker(
      
      ).then((res) => {
        console.log(res,"fhh")
        setLoading(false);
      });
    }
  }, []);



  
  function allTable() {
    let data = shopifyTracker?.message;
    console.log(data,"ciao")
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
                  <th>Pixel ID</th>
                  <th>Publisher ID</th>
                  <th>Page Title</th>
                  <th>Roi Event</th>
                  <th>Canonical Url</th>
                  
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i++}</td>
                     
                      <td>{item?.data.pixel_id}</td>
                      <td>{item?.data.publisher_id}</td>
                      <td>{item?.data.pageTitle}</td>
                      <td>{item?.data.roiEvent}</td>
                        <td>
                          
                            {item?.data.canonical_url}
                          
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
        <h4 className="page-title">Shopify Tracker</h4>
        <div className="brand_container_main aff-payment">
      
          <Row>
            <div className="col-md-12">
              <form className="mb-3">
       
              </form>

              {loading ? (
                <Loader size="30" />
              ) : (
                <>
                  {shopifyTracker?.message?.data?.length === 0 ? (
                    <>
                      <NoDataFound />
                    </>
                  ) : (
                    <>
                   
                      { allTable()}
                        
                    </>
                  
                
              )}
              </>
              )}

              {shopifyTracker?.message?.data?.length > 0 && !loading && (
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
                      shopifyTracker?.message?.total_records / limit
                    )}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                    // onPageChange={handlePageClick}
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

function mapStateToProps({ shopifyTracker, getShopifyTracker }) {
  return {
    shopifyTracker,
    getShopifyTracker,
  };
}
export default connect(mapStateToProps, { ...shopifyTracker })(
  Shopifytracker
);
