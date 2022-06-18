import React, { useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/Loader";
// import moment from "moment";

export default function Box({
  item,
  addCampaignToShop,
  index,
  activateDeactivateCampaign,
}) {
  const [addCampaign, setAddCampaign] = useState(false);
  const [loading, setLoading] = useState(false);

  const styleObj = {
    textTransform: "capitalize",
    fontsize: "14px",
  };

  const confirmAddToCampaign = (campaignId, categoryId, userId) => {
    Swal.fire({
      title: `Are You Sure You Want To Add This Campaign?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        addCampaignToShop(campaignId, categoryId, userId).then(
          function () {
            setAddCampaign(true);
            toast.success("Campaign Added Successfully");
            setLoading(false);
          },
          function (error) {
            toast.error(error?.response?.data?.message, {
              autoClose: false,
            });
            setLoading(false);
          }
        );
      }
    });
  };

  const confirmReActiveCampaigns = async (status, campaignId) => {
    Swal.fire({
      title: `Are You Sure You Want To Add This Campaign?`,
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        activateDeactivateCampaign(campaignId, status).then(
          function () {
            setAddCampaign(true);
            toast.success("Campaign Added Successfully");
            setLoading(false);
            // getMarketPlace(
            //   1,
            //   8,
            //   "all",
            //   "commission",
            //   "desc",
            //   moment(new Date()).format("YYYY-MM-DD"),
            //   moment().add(1, "year").format("YYYY-MM-DD"),
            //   "marketplace",
            //   "all",
            //   "users/marketPlace/getCampaigns"
            // ).then(function () {
            //   setLoading(false);
            // });
          },
          function (error) {
            toast.error(error?.response?.data?.message, {
              autoClose: false,
            });
            setLoading(false);
          }
        );
      }
    });
  };

  return (
    <React.Fragment>
      {/* {!addCampaign && ( */}
      <Col key={index} xs={12} xl={3} md={6}>
        <div className="card any_bx analytic-box campaign-box">
          <div className="camp-row row">
            <div className="campaign-header col-12">
              <h6>{item.campaign_name}</h6>
            </div>
            <div className="any-post-img-col col-12">
              <div className="any-post-image">
                <div className="any-image-box">
                  <div className="any-image-box-iner">
                    <img
                      src={item.media_url}
                      className="img-fluid media-image"
                      alt={"#"}
                    />
                  </div>
                </div>
                {item.is_linked &&
                !item?.is_active &&
                item?.is_active !== undefined ? (
                  <span class="dot"></span>
                ) : null}
              </div>
            </div>
            <div className="col-12 analytic-caption">
              <div className="row count-main-box">
                <div className="col-12 count-box">
                  <h5 className="count-title">Brand</h5>
                  <h3 className="count">{item.brand_name}</h3>
                </div>
                <div className="col-12 count-box">
                  <h5 className="count-title">Category</h5>
                  <h3 className="count">{item.category_name}</h3>
                </div>
                <div className="col-12 count-box">
                  <h5 className="count-title">Campaign Type</h5>
                  {/* <h3 className="count">{item.campaign_type}</h3> */}
                  <h3 style={styleObj} className="count">
                    {item.campaign_type}
                  </h3>
                </div>

                {item.campaign_type === "clicks" ? (
                  <div className="col-12 count-box">
                    <h5 className="count-title">Commission / 1000 Clicks</h5>
                    <h3 className="count">${item.pay_per_hundred}</h3>
                  </div>
                ) : (
                  <div className="col-12 count-box">
                    <h5 className="count-title">Influencer Commission</h5>
                    <h3 className="count">{item.commission}%</h3>
                  </div>
                )}

                <div className="col-12 count-box">
                  <h5 className="count-title">Start Date</h5>
                  <h3 className="count">{item.start_date}</h3>
                </div>

                <div className="col-12 count-box">
                  <h5 className="count-title">End Date</h5>
                  <h3 className="count">{item.end_date}</h3>
                </div>
              </div>
            </div>
            <div className="cam-buttons col-12">
              {/* {item.is_linked || addCampaign ? ( */}
              {(item.is_linked && item?.is_active) || addCampaign ? (
                <button
                  disabled
                  style={{ pointerEvents: "none" }}
                  key={index}
                  className="btn disable_campaign"
                >
                  Campaign Added
                </button>
              ) : item.is_linked && !item?.is_active ? (
                <button
                  // disabled
                  // style={{ pointerEvents: "none" }}
                  key={index}
                  className="btn active_campaign"
                  onClick={() => {
                    confirmReActiveCampaigns(false, item.campaign_id);
                  }}
                >
                  Campaign Available
                </button>
              ) : loading ? (
                <button key={index} className="btn">
                  <Loader />{" "}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    confirmAddToCampaign(
                      item.campaign_id,
                      item.category_id,
                      item.user_id
                    );
                  }}
                  className="btn active_campaign"
                  id="select-campaign"
                >
                  Campaign Available
                </button>
              )}
            </div>
          </div>
        </div>
      </Col>
      {/* )} */}
    </React.Fragment>
  );
}
