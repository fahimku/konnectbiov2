import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import * as profileActions from "../../actions/searchProfile";
import * as subActions from "../../actions/subscribe";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import BuySubscription from "../subcriptionsetup/component/BuySubscription";
import ConnectFb from "../connectToFb/connFb"
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function HashtagsList({
  title,
  profiles,
  getProfiles,
  createProfile,
  deleteProfile,
  searchProfileAc,
  next,
  configSubs,
  subscribeServices,
}) {
  const [hash, setHash] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [hashLoading, sethashLoading] = React.useState(false);
  const [priceId, setPriceId] = React.useState("");
  const [error, setError] = React.useState(false);
  const userInfo1 = JSON.parse(localStorage.getItem("userInfo"));
  const [showInterval, setShowInterval] = useState(false);
  const [plan, setPlan] = useState("Yearly");
  const [config, setConfig] = useState([]);
  const [token, setToken] = useState('');
const [fbPage, setFbpage] = useState('');
  const [unitAmount, setUnitAmount] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).fb_token;
    const fbPage = JSON.parse(localStorage.getItem("userInfo")).page_token;
    setToken(token);
    setFbpage(fbPage);
}, []);
  React.useEffect(() => {
    if (userInfo1.package.subscription_type !== "Trial") {
      var subType = JSON.parse(localStorage.getItem("userInfo")).package
        .recurring_payment_type;
      if (subType) {
        subType = subType.slice(0, subType.length - 2).toLocaleLowerCase();
        configSubs().then((res) => {
          const getPrice = res.message
            .filter((item) => item.product_name === "Profile")
            .filter((subItem) => subItem.interval === subType)[0];
          setPriceId(getPrice.price_id);
          setUnitAmount(getPrice.unit_amount / 3);
        });
      } else {
        setShowInterval(true);
        const planCut = plan.slice(0, plan.length - 2).toLocaleLowerCase();
        configSubs().then((res) => {
          setConfig(res.message);
          const getPrice = res.message
            .filter((item) => item.product_name === "Profile")
            .filter((subItem) => subItem.interval === planCut)[0];
          setPriceId(getPrice.price_id);
          setUnitAmount(getPrice.unit_amount / 3);
        });
      }
    }
    getProfiles().then(() => {
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (profiles.length > 0) {
      next(false);
    }
  }, [profiles]);

  const handleDelete = (chipToDelete) => () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes! Delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProfile(chipToDelete._id).then((res) => {
          toast.success("Profile Deleted Successfully");
        });
      }
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    var format = /[@\s]/;
    if (hash.length > 0) {
      setError(false);
      if (!format.test(hash)) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to add this profile?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#010b40",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            sethashLoading(true);
            searchProfileAc(hash, true)
              .then((res) => {
                sethashLoading(false);
                createProfile(hash)
                  .then(() => {
                    sethashLoading(false);
                    toast.success("Profile added successfully");
                    getProfiles();
                  })
                  .catch((err) => {
                    console.log(err.response, "err");
                    sethashLoading(false);
                    toast.error(err.response.data.message);
                  });
                setHash("");
              })
              .catch((err) => {
                sethashLoading(false);
                if (err.response.data.error) {
                  toast.error("This Profile is not exists !");
                } else {
                  toast.error("Connection Timeout");
                }
              });
          }
        });
      }
    } else {
      setError(true);
    }
  };

  function renderFormatError() {
    var format = /[@\s]/;
    if (format.test(hash)) {
      return (
        <small class="help-block text-danger">
          you cannot write @ or space
        </small>
      );
    } else if (hash.length === 0 && error) {
      return (
        <small class="help-block text-danger">Please Enter profile.</small>
      );
    }
    return null;
  }

  function onSubscribe(val) {
    const { recurring_payment_type, package_id } = JSON.parse(
      localStorage.getItem("userInfo")
    ).package;
    if (recurring_payment_type) {
      return subscribeServices(
        val,
        priceId,
        "Profile",
        recurring_payment_type,
        package_id
      );
    } else {
      return subscribeServices(val, priceId, "Profile", plan, package_id);
    }
  }
  if (!loading) {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <h4 className="page-title">Profile Monitoring</h4>
          <div className="brand_container_main container">
          {token === '' && fbPage === '' ?
        <ConnectFb/>
        :
        <>
            <Row>
              <div className="profile_box_main col-md-8">
                <div className="brand-section dash_block_profile">
                  <div className="dash_content_profile">
                    <form onSubmit={handleAdd}>
                      <p
                        style={{
                          color: "gray",
                          borderBottom: "1px solid lightgray",
                          paddingBottom: 10,
                        }}
                      >
                        Number Of Profile Monitoring In{" "}
                        {userInfo1.package.package_name} Plan Is{" "}
                        {profiles.profile_limit}
                      </p>
                      <Row>
                        <Col md={12}>
                          <div className="mb-3">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <label>Add Profile</label>
                              <p>{`(${profiles.Data.length}/${profiles.profile_limit})`}</p>
                            </div>
                            <div className="d-flex flex-row hashtag-box">
                              <span className="input-group-text">@</span>
                              <input
                                style={{
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  width: "85%",
                                }}
                                onChange={(e) => setHash(e.target.value)}
                                type="text"
                                name="name"
                                placeholder="Enter Profile"
                                className="form-control comment-field"
                                required=""
                                value={hash}
                              />
                              {hashLoading ? (
                                <Button
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    width: "15%",
                                  }}
                                  variant="primary"
                                  className="btn-block"
                                >
                                  <Loader />
                                </Button>
                              ) : (
                                <Button
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    width: "15%",
                                  }}
                                  variant="primary"
                                  type="submit"
                                  className="btn-block"
                                  disabled={
                                    profiles.Data.length ===
                                    profiles.profile_limit
                                      ? true
                                      : false
                                  }
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                            {renderFormatError()}
                          </div>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              flexWrap: "wrap",
                              listStyle: "none",
                              m: 0,
                            }}
                            component="ul"
                          >
                            {profiles.Data.map((data, i) => {
                              return (
                                <ListItem key={i}>
                                  <Chip
                                    label={`@${data.profile_name}`}
                                    onDelete={handleDelete(data)}
                                  />
                                </ListItem>
                              );
                            })}
                          </Box>
                        </Col>
                      </Row>
                    </form>
                  </div>
                </div>
              </div>
              {userInfo1.package.subscription_type !== "Trial" ? (
                <div className="profile_box_main col-md-4">
                  <div className="brand-section dash_block_profile">
                    <div className="dash_content_profile">
                      <BuySubscription
                        subscribeServices={onSubscribe}
                        heading="Buy Additional Profile Monitoring"
                        name="Profile"
                        showInterval={showInterval}
                        changePlan={(v) => {
                          const planCut = v
                            .slice(0, v.length - 2)
                            .toLocaleLowerCase();
                          const getPrice = config
                            .filter((item) => item.product_name === "Profile")
                            .filter(
                              (subItem) => subItem.interval === planCut
                            )[0];
                          setPriceId(getPrice.price_id);
                          setPlan(v);
                        }}
                        monthly={
                          config
                            .filter((item) => item.product_name === "Profile")
                            .filter(
                              (subItem) => subItem.interval === "month"
                            )[0]?.unit_amount / 3
                        }
                        yearly={
                          config
                            .filter((item) => item.product_name === "Profile")
                            .filter((subItem) => subItem.interval === "year")[0]
                            ?.unit_amount / 3
                        }
                        plan={plan}
                        unitAmount={unitAmount}
                        usageLimit={profiles.profile_limit}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profile_box_main col-md-6 col-sm-6 col-lg-6 col-xl-4">
                  <div className="brand-section dash_block_profile">
                    <div className="dash_content_profile">
                      <p>Buy paid subscription to add more Profiles</p>
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-block mt-2"
                        onClick={() => history.push("/app/subcription/setup")}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Row>
            </>
  }
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return <Loader size={30} />;
  }
}
function mapStateToProps({ profiles }) {
  return { profiles };
}
export default connect(mapStateToProps, { ...profileActions, ...subActions })(
  HashtagsList
);
