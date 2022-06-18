import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Modal } from "react-bootstrap";
import * as marketplaceTransactionsActions from "../../../actions/MarketplaceTransactions";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import moment from "moment";
import numeral from "numeral";

function MarketplaceTransaction({
  getMarketplaceActiveCampaign,
  marketplaceCampaigns,
  // getActiveInfluencer,
  // affiliateInfluencers,
  getMarketplaceBrand,
  marketplaceBrands,
  getMarketplaceTransactions,
  marketplaceTransactions,
  getMarketplaceDetailTransactions,
  marketplaceDetailTransactions,
}) {
  const [loading, setLoading] = useState(true);
  const [transactionModal, setTransactionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [campaignId, setCampaignId] = useState({
    label: "ALL",
    value: "",
  });
  const [brandId, setBrandId] = useState({
    label: "ALL",
    value: "",
  });
  const [transactionType, setTransactionType] = useState("");
  const [brandStatus, setBrandStatus] = useState("");
  const [influencerStatus, setInfluencerStatus] = useState("");
  const [singleData, setSingleData] = useState([]);
  const [groupBy, setGroupBy] = useState("");
  const [submit, setSubmit] = useState("");
  const [campaignModal, setCampaignModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [userTransctionType, setUserTransactionType] = useState({
    label: "ALL",
    value: "all",
  });

  const transactionTypeList = [
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

  const brandStatusList = [
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
  const influencerStatusList = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Paused",
      value: "paused",
    },
    // {
    //   label: "Expired",
    //   value: "expired",
    // },
  ];
  const groupByList = [
    {
      label: "Brand",
      value: "brand",
    },
    {
      label: "Campaign",
      value: "campaign",
    },
  ];

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

  const styleObj = {
    textTransform: 'capitalize',
    fontsize: '14px'
  }

  
  useEffect(() => {
    setBrandStatus({ value: "active", label: "Active" });
    setInfluencerStatus({ value: "active", label: "Active" });
    setLoading(true);
    getMarketplaceActiveCampaign("active", "active");
    // getActiveInfluencer("");
    getMarketplaceBrand("");
    getMarketplaceTransactions("", "active", "active", "", 1, limit).then(
      () => {
        setLoading(false);
      }
    );
  }, []);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    // let page = currentPage === 0 ? 1 : currentPage;
    // console.log('pages',page)
    setCurrentPage(0);
    getMarketplaceTransactions(
      // brandStatus.value,
      // influencerStatus.value,
      // campaignId.value,

      // transactionType.value,
      // groupBy.value,
      brandId.value,
      brandStatus.value,
      influencerStatus.value,
      campaignId.value,
      1,
      limit
    ).then((data) => {
      setLoading(false);
      // setSubmit(groupBy.value);
    });
  };

  const filterInfluencer = (e) => {
    setDetailLoading(true);
    e.preventDefault();
    // setCurrentPage(0);
    getMarketplaceDetailTransactions(
      singleData.campaign_id,
      userTransctionType.value,
      1,
      detailLimit
    ).then(() => {
      setDetailLoading(false);
    });
  };

  const refreshPage = (e) => {
    setCurrentPage(0);
    setLoading(true);
    getMarketplaceActiveCampaign("active", "active", "all");
    // getActiveInfluencer("");
    getMarketplaceBrand("");
    getMarketplaceTransactions("", "active", "active", "", 1, limit).then(
      () => {
        setLoading(false);
      }
    );
    setBrandStatus({ value: "active", label: "Active" });
    setInfluencerStatus({ value: "active", label: "Active" });
    setCampaignId({
      label: "ALL",
      value: "",
    });
    setBrandId({
      label: "ALL",
      value: "",
    });
    // setTransactionType("");
    // setGroupBy("");
    // setSubmit("");
  };
  const refreshCampaignPage = (e) => {
    setCurrentPage(0);
    setDetailLoading(true);

    getMarketplaceDetailTransactions(
      singleData.campaign_id,
      "",
      1,
      detailLimit
    ).then(() => {
      setDetailLoading(false);
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
    getMarketplaceTransactions(
      // brandStatus.value,
      // influencerStatus.value,
      // campaignId.value,

      // transactionType.value,
      // groupBy.value,
      brandId.value,
      brandStatus.value,
      influencerStatus.value,
      campaignId.value,
      page + 1,
      limit
    ).then(() => {
      if (marketplaceTransactions?.message?.data?.length > 0) {
        setLoading(false);
      }
    });
  };

  const changeCampaign = (e) => {
    // setBrandId("");
    // getActiveInfluencer(e.value);
    setCampaignId(e);
  };

  const changeBrand = (e) => {
    // setCampaignId("");
    setBrandId(e);
    // getMarketplaceActiveCampaign(
    //   brandStatus.value,
    //   influencerStatus.value,
    //   e.value
    // );
  };

  const changeTransactionType = (e) => {
    setTransactionType(e);
  };

  const changeBrandStatus = (e) => {
    setCampaignId("");
    setBrandStatus(e);
    setInfluencerStatus(e);
    getMarketplaceActiveCampaign(e.value, e.value, brandId.value);
  };
  const changeInfluencerStatus = (e) => {
    setCampaignId("");
    setInfluencerStatus(e);
    getMarketplaceActiveCampaign(brandStatus.value, e.value, brandId.value);
  };
  const changeGroupBy = (e) => {
    setGroupBy(e);
  };
  const changeTransectionType = (e) => {
    setUserTransactionType(e);
  };

  const handleDetailPageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setDetailLoading(true);
    getMarketplaceDetailTransactions(
      singleData.campaign_id,
      "",
      page + 1,
      detailLimit
    ).then(() => {
      if (marketplaceDetailTransactions?.message?.data?.length > 0) {
        setDetailLoading(false);
      }
    });
  };

  function dataTable() {
    let data = marketplaceTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Campaign</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                {/* <th>Budget </th> */}
                <th>Rate / 1000 Clicks</th>
                <th>Rate / Click</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Earned</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item?.brand_name}</td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => {
                          setCampaignModal(true);
                          setDetailLoading(true);
                          setSingleData(item);
                          getMarketplaceDetailTransactions(
                            item?.campaign_id,
                            "",
                            1,
                            detailLimit
                          ).then(() => {
                            setDetailLoading(false);
                          });
                        }}
                      >
                        {item?.campaign_name}
                      </button>
                    </td>
                    <td>{item?.c_category}</td>
                    <td>{moment(item?.start_date).format("YYYY-MM-DD")}</td>
                    <td>{moment(item?.end_date).format("YYYY-MM-DD")}</td>
                    <td className="text-capitalize">{item?.campaign_type}</td>
                    {/* <td>{numeral(item?.budget).format("$0,0.0'")}</td> */}
                    <td>{numeral(item?.pay_per_hundred).format("$0,0.0'")}</td>
                    <td>{numeral(item?.rate).format("$0,0.00'")}</td>
                    <td>{numeral(item?.clicks).format("0,0'")}</td>
                    <td>{numeral(item?.impressions).format("0,0'")}</td>
                    <td>{numeral(item?.ctr).format("0.00") + "%"}</td>
                    <td>{numeral(item?.earned).format("$0,0.00'")}</td>
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

  // function dataTable1() {
  //   let data = marketplaceTransactions?.message?.data;
  //   if (data) {
  //     return (
  //       <>
  //         <Table responsive="sm" className="transactions-box">
  //           <thead>
  //             <tr>
  //               <th>PID</th>
  //               <th>Date/Time</th>
  //               <th>Brand </th>
  //               <th>Campaign </th>
  //               <th>Start Date</th>
  //               <th>End Date</th>
  //               <th>Category</th>
  //               <th>Campaign Type</th>
  //               <th>Budget</th>
  //               <th>Click Rate</th>
  //               <th>Transaction Type</th>
  //               <th>Count</th>
  //               {/* <th className="text-center">View</th> */}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {data.map((item, i) => {
  //               return (
  //                 <tr key={i}>
  //                   <td>{item?.doc?.user?.pixel_id}</td>
  //                   <td>
  //                     {moment(item?.doc?.created_at).format(
  //                       "YYYY-MM-DD h:mm A"
  //                     )}
  //                   </td>
  //                   <td>{item?.brand_name}</td>
  //                   <td>{item?.doc?.campaign?.campaign_name}</td>
  //                   <td>
  //                     {moment(item?.doc?.campaign?.start_date).format(
  //                       "YYYY-MM-DD"
  //                     )}
  //                   </td>
  //                   <td>
  //                     {moment(item?.doc?.campaign?.end_date).format(
  //                       "YYYY-MM-DD"
  //                     )}
  //                   </td>
  //                   <td>{item?.doc?.parent_category?.category_name}</td>
  //                   <td>{item?.doc?.campaign?.campaign_type}</td>
  //                   <td>${item?.doc?.campaign?.budget}</td>
  //                   <td>${item?.doc?.campaign?.pay_per_hundred}</td>
  //                   <td>{item?.doc?.transaction_type}</td>
  //                   <td>{item?.count}</td>
  //                   {/* <td className="text-center">
  //                     <i
  //                       role="button"
  //                       onClick={() => {
  //                         setSingleData(item);
  //                         setTransactionModal(true);
  //                       }}
  //                       className="fa fa-eye"
  //                     ></i>
  //                   </td> */}
  //                 </tr>
  //               );
  //             })}
  //           </tbody>
  //         </Table>
  //       </>
  //     );
  //   }
  // }

  function dataDetailTable() {
    let data = marketplaceDetailTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Brand</th>
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
                    <td>{item?.brand?.brand_name}</td>

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
                  <Col xs={12} xl md={6}>
                    <p>Select Brand</p>
                    <Select
                      value={brandId}
                      name="category"
                      className="selectCustomization"
                      options={marketplaceBrands}
                      placeholder="Select Brand"
                      onChange={changeBrand}
                      styles={style}
                    />
                  </Col>
                  <Col xs={12} xl md={6}>
                    <p>Brand Status</p>
                    <Select
                      value={brandStatus}
                      name="status"
                      className="selectCustomization"
                      options={brandStatusList}
                      placeholder="Select Brand Status"
                      onChange={changeBrandStatus}
                      styles={style}
                    />
                  </Col>
                  <Col xs={12} xl md={6}>
                    <p>Influencer Status</p>
                    <Select
                      value={influencerStatus}
                      name="status"
                      className="selectCustomization"
                      options={influencerStatusList}
                      placeholder="Select Influencer Status"
                      onChange={changeInfluencerStatus}
                      styles={style}
                      isDisabled={
                        brandStatus.value === "paused" ||
                        brandStatus.value === "expired"
                          ? true
                          : false
                      }
                    />
                  </Col>
                  <Col xs={12} xl md={6}>
                    <p>Select Campaign</p>
                    <Select
                      value={campaignId}
                      name="category"
                      className="selectCustomization"
                      options={marketplaceCampaigns}
                      placeholder="Select Campaign"
                      onChange={changeCampaign}
                      styles={style}
                    />
                  </Col>

                  {/*
                  
                  
                  <Col xs={12} xl md={6}>
                    <p>Transaction Type</p>
                    <Select
                      value={transactionType}
                      name="transactionType"
                      className="selectCustomization"
                      options={transactionTypeList}
                      placeholder="Transaction Type"
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
                  </Col>*/}

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
                  {marketplaceTransactions?.message?.data?.length === 0 ? (
                    <>
                      <NoDataFound />
                    </>
                  ) : (
                    <>
                      {dataTable()}
                      {/* {submit === "" || submit === undefined
                        ? dataTable()
                        : dataTable1()} */}
                    </>
                  )}
                </>
              )}
              {marketplaceTransactions?.message?.data?.length > 0 && !loading && (
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
                      marketplaceTransactions?.message?.total_records / limit
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
            </div>
          </Row>
        </div>
      </div>
      <Modal
        show={transactionModal}
        onHide={() => {
          setTransactionModal(false);
        }}
        className="change-password"
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Information</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white transection-detail">
          <Row>
            <Col xs={12} xl={6} md={6}>
              <div class="card analytic-box analytics-page">
                <h5 className="mb-4">User Information</h5>
                <div class="col-12 count-box">
                  <h5 class="count-title">Pixel ID</h5>
                  <h3 class="count">{singleData?.user?.pixel_id}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">Username</h5>
                  <h3 class="count">{singleData?.instagram_username}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">Email</h5>
                  <h3 class="count">{singleData?.user?.email}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">Country</h5>
                  <h3 class="count">{singleData?.user?.country}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">State</h5>
                  <h3 class="count">{singleData?.user?.state}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">City</h5>
                  <h3 class="count">{singleData?.user?.city}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">Gender</h5>
                  <h3 class="count">{singleData?.user?.gender}</h3>
                </div>
              </div>
            </Col>
            <Col xs={12} xl={6} md={6}>
              <div class="card analytic-box analytics-page">
                <h5 className="mb-4">Campaign Information</h5>
                <div class="card-row row">
                  <div class="any-post-img-col col-5">
                    <div class="any-post-image">
                      <div class="any-image-box">
                        <div class="any-image-box-iner">
                          <img
                            src={singleData?.campaign?.media_url}
                            class="img-fluid media-image"
                            alt="IMAGE"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-7 analytic-caption">
                    <div class="row count-main-box">
                      <div class="col-12 count-box">
                        <h5 class="count-title">Campaign Name</h5>
                        <h3 class="count" title="Test 3">
                          {singleData?.campaign?.campaign_name}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Campaign Username</h5>
                        <h3 class="count" title="Test 3">
                          {singleData?.campaign?.instagram_username}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Campaign Type</h5>
                        <h3 style={styleObj}>
                          {singleData?.campaign?.campaign_type}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Category</h5>
                        <h3 class="count">
                          {singleData?.parent_category?.category_name}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Budget</h5>
                        <h3 class="count">${singleData?.campaign?.budget}</h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Click Rate</h5>
                        <h3 class="count">
                          ${singleData?.campaign?.pay_per_hundred}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">Start Date</h5>
                        <h3 class="count">
                          {moment(singleData?.campaign?.start_date).format(
                            "YYYY-MM-DD"
                          )}
                        </h3>
                      </div>
                      <div class="col-12 count-box">
                        <h5 class="count-title">End Date</h5>
                        <h3 class="count">
                          {moment(singleData?.campaign?.end_date).format(
                            "YYYY-MM-DD"
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} xl={6} md={6}>
              <div class="card analytic-box analytics-page">
                <h5 className="mb-4">System Information</h5>
                <div class="col-12 count-box">
                  <h5 class="count-title">IP Address</h5>
                  <h3 class="count">{singleData?.ip_address}</h3>
                </div>
                <div class="col-12 count-box">
                  <h5 class="count-title">User Agent</h5>
                  <h3 class="count">{singleData?.user_agent?.substr(0, 50)}</h3>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setTransactionModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={campaignModal}
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
              setCurrentPage(0);
              setUserTransactionType({
                label: "ALL",
                value: "all",
              });
              setCampaignModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-white transection-detail aff-payment">
          {/* <Row>
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
          </Row> */}
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
                    onClick={refreshCampaignPage}
                    type="button"
                    variant="primary"
                  >
                    Refresh
                  </Button>
                )}
              </Col>
            </Row>
          </form>

          {detailLoading ? (
            <Loader size="30" />
          ) : (
            <>
              {marketplaceDetailTransactions?.message?.data?.length === 0 ? (
                <>
                  <NoDataFound />
                </>
              ) : (
                dataDetailTable()
              )}
            </>
          )}
          {marketplaceDetailTransactions?.message?.data?.length > 0 &&
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
                    marketplaceDetailTransactions?.message?.total_records /
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
  marketplaceTransactions,
  marketplaceBrands,
  marketplaceCampaigns,
  marketplaceDetailTransactions,
}) {
  return {
    marketplaceTransactions,
    marketplaceBrands,
    marketplaceCampaigns,
    marketplaceDetailTransactions,
  };
}
export default connect(mapStateToProps, { ...marketplaceTransactionsActions })(
  MarketplaceTransaction
);
