import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Row, Col, Modal, Button } from "react-bootstrap";
//import Dropdown from "react-bootstrap/Dropdown";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import UpdateModal from "./UpdateModal";
import Loader from "../../../components/Loader/Loader";
import * as countryAct from "../../../actions/countries";
import * as campAct from "../../../actions/campaign";
import * as catActions from "../../../actions/category";
import * as promo from "../../../actions/promoRequest";
import { connect } from "react-redux";
import AnalyticModal from "./AnalyticModal";
import { DatePicker } from "antd";
import moment from "moment";
import Select from "react-select";

let dataPromo;
let PassPromoCode;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function AffiliateCampaign(
  props,
  { getPromoRequest, promoRequest, PromoPayload }
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const perPage = 8;
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [analyticModal, setAnalyticModal] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentCampaign, setCurrentCampaign] = useState({});
  // const [campaignId, setCampaignId] = useState();
  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const fromDate =
    props.type !== "expired"
      ? moment(new Date()).format("YYYY-MM-DD")
      : moment().startOf("year").format("YYYY-MM-DD");
  const toDate =
    props.type !== "expired"
      ? moment().add(1, "year").format("YYYY-MM-DD")
      : moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  // const limit = 8;
  const [category, setCategory] = useState({ value: "all", label: "ALL" });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sortBy, setSortBy] = useState({ value: "date", label: "DATE" });
  const [orderBy, setOrderBy] = useState({ value: "desc", label: "DESC" });
  const [loader, setLoader] = useState(true);
  // const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (props.getCountries()) {
      props.getCountries();
      fetchSchedulePosts();
    }
  }, [props]);

  useEffect(() => {
    props.getUserCategories().then(
      function (res) {
        setCategoryOptions([
          { value: "all", label: "ALL" },
          ...res.map((item) => {
            return { value: item.category_id, label: item.category_name };
          }),
        ]);
      },
      function (error) {
        toast.error(error?.response?.data?.message);
      }
    );
    setLoader(false);
    props.getPromoRequest().then((res) => {
      setLoader(true);
    });
  }, []);

  if (loader == true) {
    dataPromo = props.promoRequest.message;
    const promo = dataPromo;

    if (dataPromo != undefined) {
      const selectState = [];
      promo.map((x) => {
        return selectState.push({
          value: x.promo,
          label: x.promo,
          discount: x.promo_percent,
        });
      });
      PassPromoCode = selectState;
    } else {
    }
  }

  // const toggleCampaigns = async (status, campaignId) => {
  //   let statusName = status ? "disable" : "enable";
  //   Swal.fire({
  //     title: `Are you sure you want to ${statusName} this campaign?`,
  //     icon: status ? "warning" : "success",
  //     cancelButtonText: "No",
  //     showCancelButton: true,
  //     confirmButtonColor: "#010b40",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: `Yes`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       axios
  //         .put(`campaigns/revise/campaignstatus/${campaignId}`, {
  //           is_active: !status,
  //         })
  //         .then(() => {
  //           let data1 = [...data];
  //           let objIndex = data1.findIndex(
  //             (obj) => obj.campaign_id === campaignId
  //           );
  //           data1[objIndex].is_active = !status;
  //           setData(data1);
  //           setTimeout(() => {
  //             let data2 = [...data].filter(function (item) {
  //               return item.campaign_id !== campaignId;
  //             });
  //             setData(data2);
  //             const page = Math.ceil(data2.length / perPage) - 1;
  //             const selectedPage = page;
  //             const offset = selectedPage * perPage;
  //             setPageCount(page + 1);
  //             setCurrentPage(selectedPage);
  //             setOffset(offset);
  //           }, 300);
  //           toast.success("Campaign " + statusName + " Successfully");
  //         })
  //         .catch((err) => {
  //           toast.error(err.response?.data.message);
  //         });
  //     }
  //   });
  // };

  const deleteCampaign = async (campaignId) => {
    Swal.fire({
      title: `Are You Sure You Want To Delete This Campaign?`,
      text: "You Won't Be Able To Revert This!",
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/campaigns/remove/${campaignId}`)
          .then(() => {
            let data1 = [...data].filter(function (item) {
              return item.campaign_id !== campaignId;
            });
            setData(data1);
            toast.success("Campaign Deleted Successfully");
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    });
  };

  const formatOptionLabel = ({ value, label, discount }) => (
    <div style={{ display: "flex", position: "relative" }}>
      <div>{label}</div>
      <div
        style={{
          position: "absolute",
          color: "black",
          right: "0",
          fontSize: "12px",
        }}
      >
        {discount}
      </div>
    </div>
  );

  const fetchSchedulePosts = async () => {
    setLoading(true);
    await axios
      .get(
        `campaigns/receive/getUpcoming?status=${props.type}&sort_by=${sortBy.value}&order_by=desc&start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setData(response.data.message);
        setLoading(false);
        setPageCount(Math.ceil(response.data.totalCount / perPage));
        /// postData();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;
    setCurrentPage(selectedPage);
    setOffset(offset);
    // postData();
  };

  const postData = () => {
    const styleObj = {
      fontSize: "14px",
      textTransform: "capitalize",
    };
    const data1 = data;
    const truncate = (str, max, suffix) =>
      str.length < max
        ? str
        : `${str.substr(
            0,
            str.substr(0, max - suffix.length).lastIndexOf(" ")
          )}${suffix}`;
    const slice = data1.slice(offset, offset + perPage);
    const postDataInner = slice.map((record, index) => (
      <React.Fragment>
        <Col xs={12} xl={3} md={6}>
          <div
            className={`card any_bx analytic-box campaign-box ${
              props.type !== "expired" ? "" : "pb-0"
            }`}
          >
            <div className="camp-row row">
              <div className="campaign-header col-12">
                <h6 title={record.campaign_name}>
                  {truncate(record.campaign_name, 40, "...")}
                </h6>
              </div>
              <div className="any-post-img-col col-12">
                <div className="any-post-image">
                  <div className="any-image-box">
                    <div className="any-image-box-iner">
                      {record.media_type === "VIDEO" ? (
                        <video
                          id={`post-video-${record.campaign_id}`}
                          //autoPlay
                          controls
                          controlsList="nodownload"
                          className="img-fluid"
                          style={{
                            height: "100%",
                          }}
                        >
                          <source
                            src={record.media_url + "#t=0.001"}
                            type="video/mp4"
                          ></source>
                        </video>
                      ) : (
                        <img
                          src={record.media_url}
                          alt="media_url"
                          className="img-fluid media-image"
                        />
                      )}
                      {/* <img
                        src={record.media_url}
                        className="img-fluid media-image"
                        alt={record.media_type}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 analytic-caption">
                <div className="row count-main-box">
                  <div className="col-12 count-box">
                    <h5 className="count-title">Category</h5>
                    <h3 className="count">
                      {record.categories.map((item) => item.category_name)}
                    </h3>
                  </div>
                  {/* <div className="col-12 count-box">
                    <h5 className="count-title">Campaign Type</h5>
                    <h3 style={styleObj}>{record.campaign_type}</h3>
                  </div> */}
                  {record.campaign_type === "clicks" ? (
                    <>
                      <div className="col-12 count-box">
                        <h5 className="count-title">Total Budget</h5>
                        <h3 className="count">${record.budget}</h3>
                      </div>
                      <div className="col-12 count-box">
                        <h5 className="count-title">
                          Pay Per 1000 {record.campaign_type}
                        </h5>
                        <h3 className="count">${record.pay_per_hundred}</h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-12 count-box">
                        <h5 className="count-title">Promo Code For Customer</h5>
                        <h3 className="count">{record.promo}</h3>
                      </div>
                      <div className="col-12 count-box">
                        <h5 className="count-title">Discount</h5>
                        <h3 className="count">
                          {record?.discount ? record?.discount : "0%"}
                        </h3>
                      </div>
                      <div className="col-12 count-box">
                        <h5 className="count-title">Commission Rate</h5>
                        <h3 className="count">{record.commission}%</h3>
                      </div>
                    </>
                  )}
                  {/* <div className="col-12 count-box">
                    <h5 className="count-title">Total Spent</h5>
                    <h3 className="count">${record.total_spent}</h3>
                  </div> */}
                  <div className="col-12 count-box">
                    <h5 className="count-title">Number of Influencers</h5>
                    <h3 className="count">{record.total_participant}</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">Start Date</h5>
                    <h3 className="count">{record.start_date}</h3>
                  </div>
                  <div className="col-12 count-box">
                    <h5 className="count-title">End Date</h5>
                    <h3 className="count">{record.end_date}</h3>
                  </div>
                </div>
              </div>
            </div>
            {props.type !== "expired" ? (
              <div className="cam-buttons col-12">
                <button
                  className="btn"
                  onClick={() => {
                    setCurrentCampaign(record);
                    setModal(true);
                  }}
                >
                  <i className="fa fa-pencil-square-o" /> Edit
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    deleteCampaign(record.campaign_id);
                  }}
                >
                  <i className="fa fa-trash" /> Delete
                </button>
                {/* <button
                className="btn"
                onClick={() => {
                  setCampaignId(record.campaign_id);
                  setAnalyticModal(true);
                }}
              >
                <i className="fa fa-bar-chart" /> Analytics
              </button> */}
              </div>
            ) : null}
          </div>
        </Col>
      </React.Fragment>
    ));
    return postDataInner;
  };
  const searchCampaign = async (e) => {
    setSearchLoading(true);
    // setCurrentPage(0);
    e.preventDefault();
    setLoading(true);
    await axios
      .get(
        `campaigns/receive/getUpcoming?status=${props.type}&category_id=${category.value}&sort_by=${sortBy.value}&order_by=${orderBy.value}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setData(response.data.message);
        setLoading(false);
        setSearchLoading(false);
        setPageCount(Math.ceil(response.data.totalCount / perPage));
        setCurrentPage(0);
        setOffset(0);
        postData();
      })
      .catch(() => {
        setLoading(false);
        setSearchLoading(false);
      });
  };

  const clearCampaign = async (e) => {
    e.preventDefault();
    let page = data.length === 1 ? currentPage : currentPage + 1;
    if (page === 0) {
      page = 1;
    }
    setCurrentPage(page - 1);
    setClearLoading(true);
    setLoading(true);
    setCategory({ value: "all", label: "ALL" });
    setSortBy({ value: "date", label: "DATE" });
    setOrderBy({ value: "desc", label: "DESC" });
    setStartDate(fromDate);
    setEndDate(toDate);
    await axios
      .get(
        `campaigns/receive/getUpcoming?status=${props.type}&sort_by=${sortBy.value}&order_by=desc&start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setData(response.data.message);
        setLoading(false);
        setSearchLoading(false);
        setClearLoading(false);
        setPageCount(Math.ceil(response.data.totalCount / perPage));
        postData();
      })
      .catch((err) => {
        setLoading(false);
        setSearchLoading(false);
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
    { value: "commission", label: "INFLUENCER COMMISSION" },
  ];

  // const sortOrderOptions = [
  //   { value: "asc", label: "ASC" },
  //   { value: "desc", label: "DESC" },
  // ];

  const dateRangePickerChanger = (value, dataString) => {
    const startDate = dataString[0];
    const endDate = dataString[1];
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <>
      <div className="container-fluid">
        <h4 className="page-title">{props.title}</h4>
        <Row className="post-analytics-tab mb-4">
          <Col xs={12} xl={12} md={12}>
            <form onSubmit={searchCampaign}>
              <Row>
                <Col xs={12} xl md={6}>
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
                <Col xs={12} xl md={6}>
                  <p>Select Category</p>
                  <Select
                    value={category}
                    name="sort"
                    className="selectCustomization"
                    options={categoryOptions}
                    onChange={(e) => {
                      setCategory(e);
                    }}
                    placeholder="Select Category"
                    styles={style}
                  />
                </Col>
                <Col xs={12} xl md={6}>
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
                {/* <Col xs={12} xl md={6}>
                  <p>Order By</p>
                  <Select
                    value={orderBy}
                    name="sort"
                    className="selectCustomization"
                    options={sortOrderOptions}
                    onChange={(e) => {
                      setOrderBy(e);
                    }}
                    placeholder="Order By"
                    styles={style}
                  />
                </Col> */}
                <Col className="d-flex" xs={12} xl md={6}>
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
                      onClick={clearCampaign}
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
        {!loading ? (
          data.length > 0 ? (
            <>
              <Row className="post-analytics-tab-boxes-ift">{postData()}</Row>
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
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                onPageChange={handlePageClick}
                containerClassName={
                  "pagination justify-content-center mt-2 custom-paginate"
                }
                // subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </>
          ) : (
            <>
              <NoDataFound />
            </>
          )
        ) : (
          <div className="container-fluid">
            <Loader size={60} />
          </div>
        )}
        <Modal
          show={modal}
          onHide={() => setModal(false)}
          className="edit-campaign linkin-bio"
          centered
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Campaign</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white affiliate-model image-edit-box p-3">
            <UpdateModal
              affData={currentCampaign}
              promoCodes={dataPromo}
              countries={props.countries}
              affCloseModal={() => setModal(false)}
              reload={() => {
                fetchSchedulePosts();
              }}
            />
          </Modal.Body>
        </Modal>
        {/* Analytics Modal */}
        <Modal
          show={analyticModal}
          onHide={() => setAnalyticModal(false)}
          className="edit-campaign linkin-bio"
          centered
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Analytics Campaign</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white affiliate-model image-edit-box p-3">
            <AnalyticModal
              affId={currentCampaign.campaign_id}
              analyticCloseModal={() => setAnalyticModal(false)}
            />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

function mapStateToProps({
  getPromoRequest,
  promoRequest,
  countries,
  campaign,
}) {
  return { getPromoRequest, promoRequest, countries, campaign };
}
export default connect(mapStateToProps, {
  ...promo,
  ...countryAct,
  ...campAct,
  ...catActions,
})(AffiliateCampaign);
