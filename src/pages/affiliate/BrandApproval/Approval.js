import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import * as affiliateTransactionsActions from "../../../actions/affiliateRequest";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import Select from "react-select";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import moment from "moment";
import numeral from "numeral";
// import CampaignDetailTransaction from "./CampaignDetailTransaction";
import Swal from "sweetalert2";

function Approvals({
  AddAffiliateRequest,
  addAffiliateRequest,
  getAffiliateRequest,
  affiliateRequest,
}) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusLoading, setStatusLoading] = useState(false);

  const [status, setStatus] = useState({
    label: "ALL",
    value: "",
  });
  const limit = 12;
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

  useEffect(() => {
    getAffiliateRequest(status.value, 1, limit).then(() => {
      setLoading(false);
    });
  }, []);

  const handlePageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setLoading(true);
    getAffiliateRequest(status.value, page + 1, limit).then(() => {
      setLoading(false);
    });
  };

  const refreshPage = (e) => {
    setCurrentPage(0);
    setLoading(true);
    getAffiliateRequest("", 1, limit).then(() => {
      setLoading(false);
    });
    setStatus({
      label: "ALL",
      value: "",
    });
  };

  const approveMethod = (id, updated) => {
    // setLoading(true);

    Swal.fire({
      title: `Are you sure you want to Approve this Influencer?`,
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setStatusLoading(true);
        let payload = {
          influencer_id: id,
          status: "Approved",
          // updated: updated,
        };
        AddAffiliateRequest(payload).then(() => {
          toast.success("Approved Successfully!");
          getAffiliateRequest(status.value, 1, limit).then(() => {
            setLoading(false);
            setStatusLoading(false);
          });
        });
      }
    });
  };

  const rejectMethod = (id, updated) => {
    // setLoading(true);

    Swal.fire({
      title: `Are you sure you want to ${
        updated === "Pending" ? "Reject" : "Suspend"
      } this Influencer?`,
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setStatusLoading(true);
        let payload = {
          influencer_id: id,
          status: "Rejected",
          // updated: updated,
        };
        AddAffiliateRequest(payload).then(() => {
          toast.success(
            updated === "Pending"
              ? "Rejected Successfully!"
              : "Suspended Successfully!"
          );
          getAffiliateRequest(status.value, 1, limit).then(() => {
            setLoading(false);
            setStatusLoading(false);
          });
        });
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(0);
    getAffiliateRequest(status.value, 1, limit).then(() => {
      setLoading(false);
    });
  };

  function dataTable() {
    let data = affiliateRequest?.message?.data;

    if (data) {
      return (
        <>
          {loading ? (
            <Loader size="30" />
          ) : (
            <Table responsive="sm" className="transactions-box approve-brand">
              <thead className="table_heading">
                <tr>
                  <th>Full Name</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  <th title="Instagram username">IG Name</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="pt-3"> {item?.influencer_name} </td>
                      <td>{item?.country}</td>
                      <td>{item?.state}</td>
                      <td>{item?.city}</td>
                      <td>
                        <a
                          target="_blank"
                          href={`https://www.instagram.com/${item?.instagram_username}`}
                        >
                          {item?.instagram_username}
                        </a>
                      </td>
                      <td>
                        {item?.status === "Rejected" ? "Disapproved" : null}
                        {item?.status === "Pending" ? "Under Review" : null}
                        {item?.status === "Approved" ? "Approved" : null}
                        {/* {item?.status} */}
                      </td>
                      <td className="status-action">
                        {item?.status === "Approved" ? (
                          <button
                            class="btn badge-danger btn-sm ml-1 btn-approve"
                            onClick={() =>
                              rejectMethod(
                                item?.influencer_id
                                // item?.status === "Pending" ? false : true
                              )
                            }
                            disabled={statusLoading ? true : false}
                          >
                            {statusLoading ? (
                              <>
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span class="sr-only">Loading...</span>
                              </>
                            ) : (
                              "Suspend"
                            )}
                          </button>
                        ) : // <button
                        //   class="btn badge-success btn-sm btn-approve"
                        //   onClick={() =>
                        //     approveMethod(
                        //       item?.influencer_id
                        //       // item?.status === "Pending" ? false : true
                        //     )
                        //   }
                        // >
                        //   Approve
                        // </button>
                        null}

                        {item?.status === "Rejected" ? (
                          <button
                            class="btn badge-success btn-sm btn-approve"
                            onClick={() =>
                              approveMethod(
                                item?.influencer_id
                                // item?.status === "Pending" ? false : true
                              )
                            }
                            disabled={statusLoading ? true : false}
                          >
                            {statusLoading ? (
                              <>
                                <span
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span class="sr-only">Loading...</span>
                              </>
                            ) : (
                              "Approve"
                            )}
                          </button>
                        ) : // <button
                        //   class="btn badge-danger btn-sm ml-1 btn-approve"
                        //   onClick={() =>
                        //     rejectMethod(
                        //       item?.influencer_id
                        //       // item?.status === "Pending" ? false : true
                        //     )
                        //   }
                        // >
                        //   Suspend
                        // </button>
                        null}
                        {item?.status === "Pending" ? (
                          <>
                            <button
                              class="btn badge-success btn-sm btn-approve"
                              onClick={() =>
                                approveMethod(
                                  item?.influencer_id
                                  // item?.status === "Pending" ? false : true
                                )
                              }
                              disabled={statusLoading ? true : false}
                            >
                              {statusLoading ? (
                                <>
                                  <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="sr-only">Loading...</span>
                                </>
                              ) : (
                                "Approve"
                              )}
                            </button>
                            <button
                              class="btn badge-danger btn-sm ml-1 btn-approve"
                              onClick={() =>
                                rejectMethod(
                                  item?.influencer_id,
                                  "Pending"
                                  // item?.status === "Pending" ? false : true
                                )
                              }
                              disabled={statusLoading ? true : false}
                            >
                              {statusLoading ? (
                                <>
                                  <span
                                    class="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  <span class="sr-only">Loading...</span>
                                </>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          </>
                        ) : null}
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
        <h4 className="page-title">Influencer Requests</h4>
        <div className="brand_container_main aff-payment">
          <div className="">
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
                  <Button type="submit" variant="primary" className="fltr-hpr">
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
                        affiliateRequest?.message?.data?.length === 0
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
                {affiliateRequest?.message?.data?.length === 0 ? (
                  <>
                    <NoDataFound />
                  </>
                ) : (
                  <>{dataTable()}</>
                )}
              </>
            )}
            {affiliateRequest?.message?.data?.length > 0 && !loading && (
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
                    affiliateRequest?.message?.total_records / limit
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
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({
  AddAffiliateRequest,
  addAffiliateRequest,
  getAffiliateRequest,
  affiliateRequest,
}) {
  return {
    AddAffiliateRequest,
    addAffiliateRequest,
    getAffiliateRequest,
    affiliateRequest,
  };
}
export default connect(mapStateToProps, { ...affiliateTransactionsActions })(
  Approvals
);
