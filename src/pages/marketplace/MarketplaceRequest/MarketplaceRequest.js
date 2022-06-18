import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import * as marketplaceBrandActions from "../../../actions/MarketplaceBrands";
import { connect } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import ReactPaginate from "react-paginate";
import Select from "react-select";

function MarketplaceRequest({ getMarketplaceApproval, marketplaceApproval }) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState({
    label: "ALL",
    value: "",
  });
  const statusList = [
    {
      label: "ALL",
      value: "",
    },
    {
      label: "Approved",
      value: "approved",
    },
    {
      label: "Under Review",
      value: "pending",
    },
    {
      label: "Disapproved",
      value: "rejected",
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
    getMarketplaceApproval(status.value, 1, limit).then(() => {
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(0);
    getMarketplaceApproval(status.value, 1, limit).then(() => {
      setLoading(false);
    });
  };
  const refreshPage = (e) => {
    setCurrentPage(0);
    setLoading(true);
    getMarketplaceApproval("", 1, limit).then(() => {
      setLoading(false);
    });
    setStatus({
      label: "ALL",
      value: "",
    });
  };

  const handlePageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setLoading(true);
    getMarketplaceApproval(page + 1, limit).then(() => {
      if (marketplaceApproval?.message?.data?.length > 0) {
        setLoading(false);
      }
    });
  };

  function dataTable() {
    let data = marketplaceApproval?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="approval-box">
            <thead className="table_heading">
              <tr>
                <th>Brand Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className="pt-3">{item?.brand_name}</td>

                    <td>
                      {item?.status === "Pending" ? (
                        <button
                          class="btn btn-info btn-sm btn-approve_disable"
                          disabled
                        >
                          Under Review
                        </button>
                      ) : (
                        ""
                      )}
                      {item?.status === "Approved" ? (
                        <button
                          class="btn btn-success btn-sm btn-approve_disable"
                          disabled
                        >
                          Approved
                        </button>
                      ) : (
                        ""
                      )}
                      {item?.status === "Rejected" ? (
                        <button
                          class="btn badge-danger btn-sm btn-approve_disable"
                          disabled
                        >
                          Disapproved
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Requests</h4>
        <div className="brand_container_main request_container">
          <Row>
            <div className="col-md-8">
              <form className="mb-3" onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} xl={3} md={6}>
                    <p>Select Status</p>
                    <Select
                      value={status}
                      name="status"
                      className="selectCustomization"
                      options={statusList}
                      placeholder="Select Status"
                      onChange={(e) => setStatus(e)}
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
                        disabled={
                          marketplaceApproval?.message?.data?.length === 0
                            ? true
                            : false
                        }
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
                  {marketplaceApproval?.message?.data?.length === 0 ? (
                    <>
                      <NoDataFound />
                    </>
                  ) : (
                    <div
                      className={
                        "brand-section dash_block_profile request_table"
                      }
                    >
                      {dataTable()}
                    </div>
                  )}
                </>
              )}

              {marketplaceApproval?.message?.data?.length > 0 && !loading && (
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
                      marketplaceApproval?.message?.total_records / limit
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

function mapStateToProps({ marketplaceApproval }) {
  return {
    marketplaceApproval,
  };
}
export default connect(mapStateToProps, { ...marketplaceBrandActions })(
  MarketplaceRequest
);
