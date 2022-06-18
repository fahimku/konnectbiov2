import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Modal } from "react-bootstrap";
import Loader from "../../../components/Loader/Loader";
// import * as marketplaceBrandActions from "../../../actions/MarketplaceBrands";
// import { connect } from "react-redux";
import placeholder from "../../../../src/images/placeholder.svg";
import BrandMarketPlace from "../BrandMarketPlace";

function BrandFilterComponent({ title }) {
  const [myBrand, setMyBrand] = useState("");
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandId, setBrandId] = useState();
  const [brandName, setBrandName] = useState();
  const [brandModal, setBrandModal] = useState(false);

  useEffect(() => {
    getMyBrand();
  }, []);

  const getMyBrand = async () => {
    await axios
      .post("/users/marketPlace/getUserBrands")
      .then((response) => {
        const myBrands = response.data.data;
        setMyBrand(myBrands);
        setBrandLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const brandSelect = (id, brand_name) => {
    setBrandModal(true);
    setBrandId(id);
    setBrandName(brand_name);
  };

  return (
    <React.Fragment>
      <div className="profile-page account-setup">
        <div className="container-fluid">
          <h4 class="page-title">Campaigns</h4>
          <div className="profile_container_main container">
            <div className="row">
              <div className="profile_box_main col-md-8">
                <div className="dash_block_profile">
                  <div className="dash_content_profile">
                    <span className="cat_heading">My Campaigns</span>
                    {brandLoading ? (
                      <Loader size="30" />
                    ) : (
                      <Row>
                        {myBrand.length === 0 ? (
                          <div className="col-md-12 no-data-cat">
                            <p className="text-muted">No Brand</p>
                          </div>
                        ) : (
                          myBrand.map((item) => (
                            <div
                              key={item.brand_id}
                              className="brand-box col-sm-3 col-6"
                            >
                              <div className="inner-brand-box">
                                <img
                                  key={item.brand_id}
                                  src={
                                    item.profile_image_url === "" ||
                                    item.profile_image_url === undefined
                                      ? placeholder
                                      : item.profile_image_url
                                  }
                                  alt="cat-logo"
                                  className={`img-fluid brand-cat ${
                                    item.brand_id === "61baedec5ab558359825084e"
                                      ? "custom-brand-cat"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    brandSelect(item.brand_id, item.brand_name)
                                  }
                                  style={{ width: "100px", height: "100px" }}
                                />
                                {item?.promo !== "KB0" && item?.promo ? (
                                  <span className="skew_label">
                                    GET {item?.discount}{" "}
                                    {/* {item?.discount_type === "%" ||
                                    item?.discount_type === undefined
                                      ? item?.website_discount + "%"
                                      : "$" + item?.website_discount}{" "} */}
                                    OFF
                                  </span>
                                ) : null}
                                {/* <div className="cat-lable">
                                  {item.brand_name}
                                </div> */}
                              </div>
                            </div>
                          ))
                        )}
                      </Row>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={brandModal}
        centered
        className="campaign-detail-modal aff-payment"
        animation={false}
        backdrop={true}
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>{brandName} Campaigns</Modal.Title>
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
        <Modal.Body className="bg-white transection-detail">
          <BrandMarketPlace brandId={brandId} type="marketplace" catId="all" />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
// function mapStateToProps({}) {
//   return {};
// }
export default BrandFilterComponent;
