import React, { useState, useEffect } from "react";
import Loader from "../../../components/Loader/Loader";
import * as brandActions from "../../../actions/brands";
import { connect } from "react-redux";
import { Row, Col, Button, Modal } from "react-bootstrap";
import Select from "react-select";
// import InputNumberValidation from "../../../components/InputValidation/InputNumberValidation";
import BrandMarketPlace from "../BrandMarketPlace";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import placeholder from "../../../../src/images/placeholder.svg";

function ModalCategories({ catData, categoryById, getCatbrands }) {
  const [loading, setLoading] = useState(true);
  const [brandModal, setBrandModal] = useState(false);
  const [brandId, setBrandId] = useState();
  const [brandName, setBrandName] = useState();
  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [minCommission, setMinCommission] = useState("10");
  const [maxCommission, setMaxCommission] = useState("50");
  const [status, setStatus] = useState({ value: "all", label: "ALL" });

  let parent_id = catData.value;
  useEffect(() => {
    if (catData) {
      getCatbrands(parent_id).then((res) => {
        setLoading(false);
      });
    }
  }, [catData]);

  let data = categoryById;
  let catName = catData.label;

  const brandSelect = (id, brand_name) => {
    setBrandModal(true);
    setBrandId(id);
    setBrandName(brand_name);
  };

  const brandApproval = (item) => {
    Swal.fire({
      title: `Need To Be Approved By Brand Please Request Participation.`,
      imageUrl: item?.profile_image_url,
      customClass: {
        image: "swal-brand-image",
      },
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`users/marketPlace/requestbrand`, {
            brand_id: item.brand_id,
          })
          .then((response) => {
            toast.success("Request has been send Successfully");
            getCatbrands(parent_id).then((res) => {
              setLoading(false);
            });
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
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

  const statusOptions = [
    { value: "all", label: "ALL" },
    // { value: "new", label: "NEW" },
    { value: "Approved", label: "APPROVED" },
    { value: "Pending", label: "UNDER REVIEW" },
    { value: "Rejected", label: "DISAPPROVED" },
  ];
  const searchMarketPlace = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchLoading(true);
    getCatbrands(parent_id, status.value, minCommission, maxCommission).then(
      (res) => {
        setLoading(false);
        setSearchLoading(false);
      }
    );
  };
  const clearMarketPlace = (e) => {
    e.preventDefault();
    setLoading(true);
    setClearLoading(true);
    setSearchLoading(true);
    setMinCommission("10");
    setMaxCommission("50");
    setStatus({ value: "all", label: "ALL" });
    getCatbrands(parent_id, "all", "0", "50").then((res) => {
      setLoading(false);
      setSearchLoading(false);
      setClearLoading(false);
    });
  };

  return (
    <div className="brand-section">
      <div className="filter_marketplace post-analytics-tab mb-4">
        <form onSubmit={searchMarketPlace}>
          <Row>
            <Col xs={12} xl={4} md={6}>
              <p>Status</p>
              <Select
                value={status}
                name="status"
                className="selectCustomization"
                options={statusOptions}
                onChange={(e) => {
                  setStatus(e);
                }}
                placeholder="Select Status"
                styles={style}
              />
            </Col>
            <Col xs={12} xl={2} md={6} className="com-box">
              <p>Min Commission</p>
              <div className="commission-range-box">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  className="commission-range"
                  value={minCommission}
                  onChange={(event) => setMinCommission(event.target.value)}
                  autoComplete="off"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                />
              </div>
            </Col>
            <Col xs={12} xl={2} md={6} className="com-box">
              <p>Max Commission</p>
              <div className="commission-range-box">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  className="commission-range"
                  value={maxCommission}
                  onChange={(event) => setMaxCommission(event.target.value)}
                  autoComplete="off"
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                />
              </div>
            </Col>

            <Col className="d-flex" xs={12} xl={4} md={6}>
              {searchLoading ? (
                <Button type="button" variant="primary" className="fltr-hpr">
                  <Loader />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className="fltr-hpr"
                  id="fltr-camp"
                  disabled={clearLoading ? true : false}
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
                  id="fltr-reset"
                  disabled={searchLoading ? true : false}
                >
                  Reset
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </div>
      <hr />

      {loading ? (
        <Loader size="30" />
      ) : (
        <>
          <Row>
            {data.length === 0 ? (
              <div className="col-md-12 no-data-cat">
                <p className="text-muted">
                  No brand available at this time. Please check back later.
                </p>
              </div>
            ) : (
              data.map((item, i) => {
                return (
                  <div key={i} className="brand-box col-sm-3 col-6">
                    <div className="brand-inner">
                      <span
                        className={`brand_status ${
                          item.status === "Approved" ? "status_green" : ""
                        } ${item.status === "Rejected" ? "status_red" : ""}`}
                      >
                        {item.status === "Pending"
                          ? "Under Review"
                          : item.status === "Rejected"
                          ? "Disapproved"
                          : item.status}
                      </span>
                      <img
                        alt="profile-icon"
                        src={
                          item?.profile_image_url
                            ? item?.profile_image_url
                            : placeholder
                        }
                        // style={{ width: "100px", height: "100px" }}
                        className={`img-fluid brand-cat ${
                          item.brand_id === "61baedec5ab558359825084e"
                            ? "custom-brand-cat"
                            : ""
                        } ${
                          // item.status === "Pending" ||
                          // item.status === "Rejected"
                          item.status !== "" ? "pending-brand-cat" : ""
                        }`}
                        onClick={
                          () => (item.status === "" ? brandApproval(item) : "")
                          //brandSelect(item.brand_id, item.brand_name)
                        }
                      />
                      <div className="cat-lable">{item.brand_name}</div>
                    </div>
                  </div>
                );
              })
            )}
          </Row>
        </>
      )}
      <Modal
        show={brandModal}
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
          <Modal.Title>
            {brandName} Campaigns
            <br />
            <button class="btn btn-info btn-sm btn-approve_disable" disabled>
              {catName}
            </button>
          </Modal.Title>
          <button
            type="button"
            class="close"
            onClick={() => {
              setBrandModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <BrandMarketPlace
            brandId={brandId}
            catId={catData.category_id}
            type="marketplace"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
function mapStateToProps({ getCatbrands, categoryById }) {
  return { getCatbrands, categoryById };
}
export default connect(mapStateToProps, {
  ...brandActions,
})(ModalCategories);
