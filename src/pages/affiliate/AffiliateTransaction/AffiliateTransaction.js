import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import * as affiliateTransactionsActions from "../../../actions/affiliateTransactions";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import moment from "moment";
import numeral from "numeral";
// import CampaignDetailTransaction from "./CampaignDetailTransaction";

function AffiliateTransaction({
  getAffiliateActiveCampaign,
  affiliateCampaigns,
  getActiveInfluencer,
  affiliateInfluencers,
  getAffiliateTransactions,
  affiliateTransactions,
  getCampaignDetailTransactions,
  campaignDetailTransactions,
  getInfluencerDetailTransactions,
  influencerDetailTransactions,
}) {
  const [loading, setLoading] = useState(true);
  const [transactionModal, setTransactionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [campaignId, setCampaignId] = useState({
    label: "ALL",
    value: "all",
  });
  const [influencerId, setInfluencerId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [status, setStatus] = useState("");
  const [singleData, setSingleData] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [submit, setSubmit] = useState("");
  const [campaignModal, setCampaignModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [influencerLoading, setInfluencerLoading] = useState(false);
  const [userTransctionType, setUserTransactionType] = useState({
    label: "ALL",
    value: "all",
  });

  // const transactionTypeList = [
  //   {
  //     label: "ALL",
  //     value: "",
  //   },
  //   {
  //     label: "Click",
  //     value: "click",
  //   },
  //   {
  //     label: "Impression",
  //     value: "impression",
  //   },
  // ];

  const statusList = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Paused",
      value: "paused",
    },
    {
      label: "Expired",
      value: "expired",
    },
  ];
  // const groupByList = [
  //   {
  //     label: "Influencer",
  //     value: "influencer",
  //   },
  //   {
  //     label: "Campaign",
  //     value: "campaign",
  //   },
  // ];
  const transactionTypeOption = [
    {
      label: "ALL",
      value: "",
    },
    {
      label: "Click",
      value: "click",
    },
    {
      label: "Impression",
      value: "impression",
    },
  ];

  const limit = 12;
  const detailLimit = 12;
  const influncerLimit = 12;
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
    setStatus({ value: "active", label: "Active" });
    setLoading(true);
    getAffiliateActiveCampaign("active");
    getActiveInfluencer("");
    getAffiliateTransactions("active", "", 1, limit).then(() => {
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setCurrentPage(0);
    getAffiliateTransactions(
      status.value,
      campaignId.value,
      // influencerId.value,
      // transactionType.value,
      // groupBy.value,
      1,
      limit
    ).then((data) => {
      setLoading(false);
      setSubmit(groupBy.value);
    });
  };

  const refreshPage = (e) => {
    setCurrentPage(0);
    setLoading(true);
    getAffiliateActiveCampaign("active");
    getActiveInfluencer("");
    getAffiliateTransactions("active".value, "", 1, limit).then(() => {
      setLoading(false);
    });
    setStatus({ value: "active", label: "Active" });
    setCampaignId({
      label: "ALL",
      value: "all",
    });

    // setInfluencerId("");
    // setTransactionType("");
    // setGroupBy("");
    setSubmit("");
  };

  const refreshCampaignPage = (e) => {
    setCurrentPage(0);
    setDetailLoading(true);

    getCampaignDetailTransactions(singleData.campaign_id, 1, detailLimit).then(
      () => {
        setDetailLoading(false);
      }
    );
  };

  const refreshInfluencerPage = (e) => {
    setCurrentPage(0);
    setInfluencerLoading(true);

    getInfluencerDetailTransactions(
      influencerId,
      singleData.campaign_id,
      "",
      1,
      influncerLimit
    ).then(() => {
      setInfluencerLoading(false);
    });
    setUserTransactionType({
      label: "ALL",
      value: "all",
    });
  };

  const handlePageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setLoading(true);
    getAffiliateTransactions(
      status.value,
      campaignId.value,
      // influencerId.value,
      // transactionType.value,
      // groupBy.value,
      page + 1,
      limit
    ).then(() => {
      if (affiliateTransactions?.message?.data?.length > 0) {
        setLoading(false);
      }
    });
  }


  const changeCampaign = (e) => {
    // setInfluencerId("");
    // getActiveInfluencer(e.value);
    setCampaignId(e);
  };

  // const changeInfluencer = (e) => {
  //   setInfluencerId(e);
  // };

  // const changeTransactionType = (e) => {
  //   setTransactionType(e);
  // };
  const changeTransectionType = (e) => {
    setUserTransactionType(e);
  };

  const changeStatus = (e) => {
    setStatus(e);
    getAffiliateActiveCampaign(e.value);
  };

  // const changeGroupBy = (e) => {
  //   setGroupBy(e);
  // };
  const handleDetailPageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setDetailLoading(true);
    getCampaignDetailTransactions(campaignId.value, page + 1, detailLimit).then(
      () => {
        if (campaignDetailTransactions?.message?.data?.length > 0) {
          setDetailLoading(false);
        }
      }
    );
  };
  const handleInfluencerPageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setInfluencerLoading(true);
    getInfluencerDetailTransactions(
      influencerId,
      singleData.campaign_id,
      userTransctionType.value,
      page + 1,
      influncerLimit
    ).then(() => {
      if (influencerDetailTransactions?.message?.data?.length > 0) {
        setInfluencerLoading(false);
      }
    });
  };

  const filterInfluencer = (e) => {
    setInfluencerLoading(true);
    e.preventDefault();
    // setCurrentPage(0);
    getInfluencerDetailTransactions(
      influencerId,
      singleData.campaign_id,
      userTransctionType.value,
      1,
      influncerLimit
    ).then(() => {
      setInfluencerLoading(false);
    });
  };

  function dataTable() {
    let data = affiliateTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>No. of Influencers</th>
                <th>Category </th>
                <th>Start Date</th>
                <th>End Date</th>
                {/* <th>Type</th>
                <th>Budget </th>
                <th>Rate / 1000 Clicks</th> */}
                {/* <th>Rate / Click</th> */}
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Spent</th>
                {/* <th className="text-center">View</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => {
                          setCampaignModal(true);
                          setDetailLoading(true);
                          setSingleData(item);
                          getCampaignDetailTransactions(
                            item?.campaign_id,
                            1,
                            detailLimit
                          ).then(() => {
                            setDetailLoading(false);
                          });
                          // getCampaignDetailTransactions(item?.campaign_id);
                        }}
                      >
                        {item?.campaign_name}
                      </button>
                    </td>
                    <td>{numeral(item?.influencers).format("0,0'")}</td>
                    <td>{item?.c_category}</td>

                    <td>{moment(item?.start_date).format("YYYY-MM-DD")}</td>
                    <td>{moment(item?.end_date).format("YYYY-MM-DD")}</td>
                    {/* <td className="text-capitalize">{item?.campaign_type}</td>
                    <td>{numeral(item?.budget).format("$0,0.0'")}</td>
                    <td>{numeral(item?.pay_per_hundred).format("$0,0.0'")}</td> */}
                    {/* <td>{numeral(item?.rate).format("$0,0.00'")}</td> */}
                    <td>{numeral(item?.clicks).format("0,0'")}</td>
                    <td>{numeral(item?.impressions).format("0,0'")}</td>
                    <td>{numeral(item?.ctr).format("0.00") + "%"}</td>
                    <td>{numeral(item?.spent).format("$0,0.00'")}</td>

                    {/* <td className="text-center">
                      <i
                        role="button"
                        onClick={() => {
                          setSingleData(item);
                          setTransactionModal(true);
                        }}
                        className="fa fa-eye"
                      ></i>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      );
    }
  }

  function dataTable1() {
    let data = affiliateTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>PID</th>
                <th>Date/Time</th>
                <th>Influencer </th>
                <th>Campaign </th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Category</th>
                <th>Campaign Type</th>
                <th>Budget</th>
                <th>Click Rate</th>
                <th>Transaction Type</th>
                <th>Count</th>
                {/* <th className="text-center">View</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item?.doc?.user?.pixel_id}</td>
                    <td>
                      {moment(item?.doc?.created_at).format(
                        "YYYY-MM-DD h:mm A"
                      )}
                    </td>
                    <td>{item?.doc?.instagram_username}</td>
                    <td>{item?.doc?.campaign?.campaign_name}</td>
                    <td>
                      {moment(item?.doc?.campaign?.start_date).format(
                        "YYYY-MM-DD"
                      )}
                    </td>
                    <td>
                      {moment(item?.doc?.campaign?.end_date).format(
                        "YYYY-MM-DD"
                      )}
                    </td>
                    <td>{item?.doc?.parent_category?.category_name}</td>
                    <td>{item?.doc?.campaign?.campaign_type}</td>
                    <td>${item?.doc?.campaign?.budget}</td>
                    <td>${item?.doc?.campaign?.pay_per_hundred}</td>
                    <td>{item?.doc?.transaction_type}</td>
                    <td>{item?.count}</td>
                    {/* <td className="text-center">
                      <i
                        role="button"
                        onClick={() => {
                          setSingleData(item);
                          setTransactionModal(true);
                        }}
                        className="fa fa-eye"
                      ></i>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      );
    }
  }

  function dataDetailTable() {
    let data = campaignDetailTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Category </th>
                <th>Influencer </th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Spent</th>
                <th className="text-center">BioShop</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item?.campaign_name}</td>
                    <td>{item?.c_category}</td>
                    <td>
                      <button
                        onClick={() => {
                          setTransactionModal(true);
                          setInfluencerLoading(true);
                          setInfluencerId(item?.influencer_id);
                          getInfluencerDetailTransactions(
                            item?.influencer_id,
                            singleData.campaign_id,
                            userTransctionType.value,
                            1,
                            influncerLimit
                          ).then(() => {
                            setInfluencerLoading(false);
                          });
                        }}
                        className="btn-link"
                      >
                        {item?.instagram_username}
                      </button>
                    </td>
                    <td>{numeral(item?.clicks).format("0,0'")}</td>
                    <td>{numeral(item?.impressions).format("0,0'")}</td>
                    <td>{numeral(item?.ctr).format("0.00") + "%"}</td>
                    <td>{numeral(item?.spent).format("$0,0.00'")}</td>
                    <td className="text-center">
                      <a
                        href={`https://konnect.bio/${item?.instagram_username}`}
                        target="_blank"
                      >
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                      </a>
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

  function dataInfluencerDetailTable() {
    let data = influencerDetailTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Influencer</th>
                <th>Date</th>
                <th>Country</th>
                <th>City</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item?.instagram_username}</td>

                    <td>
                      {moment(item?.created_at).format("YYYY-MM-DD h:mm A")}
                    </td>
                    <td>{item?.country}</td>
                    <td>{item?.city}</td>
                    <td>{item?.transaction_type}</td>
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
        <h4 className="page-title">Transactions</h4>
        <div className="brand_container_main aff-payment">
          <Row>
            <div className="col-md-12">
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
                      onChange={changeStatus}
                      styles={style}
                    />
                  </Col>
                  <Col xs={12} xl={3} md={6}>
                    <p>Select Campaign</p>
                    <Select
                      value={campaignId}
                      name="category"
                      className="selectCustomization"
                      options={affiliateCampaigns}
                      placeholder="Select Campaign"
                      onChange={changeCampaign}
                      styles={style}
                    />
                  </Col>

                  {/* <Col xs={12} xl md={6}>
                    <p>Select Influencer</p>
                    <Select
                      value={influencerId}
                      name="category"
                      className="selectCustomization"
                      options={affiliateInfluencers}
                      placeholder="Select Influencer"
                      onChange={changeInfluencer}
                      styles={style}
                    />
                  </Col>
                  <Col xs={12} xl md={6}>
                    <p>Transaction Type</p>
                    <Select
                      value={transactionType}
                      name="transactionType"
                      className="selectCustomization"
                      options={transactionTypeList}
                      placeholder="Select Transaction Type"
                      onChange={changeTransactionType}
                      styles={style}
                    />
                  </Col>
                  <Col xs={12} xl md={6}>
                    <p>Group By</p>
                    <Select
                      value={groupBy}
                      name="transactionType"
                      className="selectCustomization"
                      options={groupByList}
                      placeholder="Select Group By"
                      onChange={changeGroupBy}
                      styles={style}
                    />
                  </Col> */}
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
                  {affiliateTransactions?.message?.data?.length === 0 ? (
                    <>
                      <NoDataFound />
                    </>
                  ) : (
                    <>
                      {submit === "" || submit === undefined
                        ? dataTable()
                        : dataTable1()}
                    </>
                  )}
                </>
              )}
              {affiliateTransactions?.message?.data?.length > 0 && !loading && (
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
                      affiliateTransactions?.message?.total_records / limit
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
      <Modal
        show={transactionModal}
        // onHide={() => {
        //   setTransactionModal(false);
        // }}
        // className="change-password"
        centered
        className="campaign-detail-modal aff-payment"
        animation={false}
        backdrop={true}
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>User Information</Modal.Title>
          <button
            type="button"
            class="close"
            onClick={() => {
              setCurrentPage(0);
              setUserTransactionType({
                label: "ALL",
                value: "all",
              });
              setTransactionModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-white transection-detail">
          <form className="mb-3" onSubmit={filterInfluencer}>
            <Row>
              <Col xs={12} xl={3} md={6}>
                <p>Select Transaction Type</p>
                <Select
                  value={userTransctionType}
                  name="status"
                  className="selectCustomization"
                  options={transactionTypeOption}
                  placeholder="Transaction Type"
                  onChange={changeTransectionType}
                  styles={style}
                />
              </Col>

              <Col className="transaction-search d-flex" xs={12} xl={3} md={3}>
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
                    onClick={refreshInfluencerPage}
                    type="button"
                    variant="primary"
                  >
                    Refresh
                  </Button>
                )}
              </Col>
            </Row>
          </form>
          {influencerLoading ? (
            <Loader size="30" />
          ) : (
            <>
              {influencerDetailTransactions?.message?.data?.length === 0 ? (
                <>
                  <NoDataFound />
                </>
              ) : (
                dataInfluencerDetailTable()
              )}
            </>
          )}
          {influencerDetailTransactions?.message?.data?.length > 0 &&
            !influencerLoading && (
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
                    influencerDetailTransactions?.message?.total_records /
                      influncerLimit
                  )}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                  onPageChange={handleInfluencerPageClick}
                  containerClassName={
                    "pagination justify-content-center mt-2 custom-paginate"
                  }
                  // subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Row>
            )}
        </Modal.Body>
      </Modal>

      {/* <CampaignDetailTransaction
        campaignModal={campaignModal}
        setCampaignModal={() => setCampaignModal()}
        detailLoading={detailLoading}
        campaignDetailTransactions={campaignDetailTransactions}
        campaignId={campaignId}
        getCampaignDetailTransactions={getCampaignDetailTransactions}
      /> */}

      <Modal
        show={campaignModal}
        // onHide={() => {
        //   setCampaignModal(false);
        // }}
        className="campaign-detail-modal"
        centered
        // size="xl"
        animation={false}
        backdrop={true}
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>Campaign Details</Modal.Title>
          <button
            type="button"
            class="close"
            onClick={() => {
              setCampaignModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-white transection-detail aff-payment">
          <Row>
            <Col className="text-right mb-3">
              <Button
                className="fltr-hpr btn-gray"
                onClick={refreshCampaignPage}
                type="button"
                variant="primary"
              >
                Refresh
              </Button>
            </Col>
          </Row>

          {detailLoading ? (
            <Loader size="30" />
          ) : (
            <>
              {campaignDetailTransactions?.message?.data?.length === 0 ? (
                <>
                  <NoDataFound />
                </>
              ) : (
                dataDetailTable()
              )}
            </>
          )}
          {campaignDetailTransactions?.message?.data?.length > 0 &&
            !detailLoading && (
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
                    campaignDetailTransactions?.message?.total_records /
                      detailLimit
                  )}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                  onPageChange={handleDetailPageClick}
                  containerClassName={
                    "pagination justify-content-center mt-2 custom-paginate"
                  }
                  // subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Row>
            )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

function mapStateToProps({
  affiliateTransactions,
  affiliateCampaigns,
  affiliateInfluencers,
  campaignDetailTransactions,
  influencerDetailTransactions,
}) {
  return {
    affiliateTransactions,
    affiliateCampaigns,
    affiliateInfluencers,
    campaignDetailTransactions,
    influencerDetailTransactions,
  };
}
export default connect(mapStateToProps, { ...affiliateTransactionsActions })(
  AffiliateTransaction
);
