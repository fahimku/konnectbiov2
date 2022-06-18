import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import * as hashActions from "../../../actions/hashtags";
import * as subActions from "../../../actions/subscribe";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import BuySubscription from "../../subcriptionsetup/component/BuySubscription";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function HashtagsList({
  title,
  hashtags,
  getHashtags,
  createHashtag,
  deleteHash,
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
  const [unitAmount, setUnitAmount] = useState("");

  React.useEffect(() => {
    if (userInfo1.package.subscription_type !== "Trial") {
      var subType = JSON.parse(localStorage.getItem("userInfo")).package
        .recurring_payment_type;
      if (subType) {
        subType = subType.slice(0, subType.length - 2).toLocaleLowerCase();
        configSubs().then((res) => {
          const getPrice = res.message
            .filter((item) => item.product_name === "Hashtag")
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
            .filter((item) => item.product_name === "Hashtag")
            .filter((subItem) => subItem.interval === planCut)[0];
          setPriceId(getPrice.price_id);
          setUnitAmount(getPrice.unit_amount / 3);
        });
      }
    }
    getHashtags().then(() => {
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (hashtags.length > 0) {
      next(false);
    }
  }, [hashtags]);

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
        deleteHash(chipToDelete.hashtag_id).then((res) => {
          toast.success(res.data.message);
          getHashtags();
        });
      }
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    var format = /[#\s]/;
    if (hash.length > 0) {
      setError(false);
      if (!format.test(hash)) {
        Swal.fire({
          title: "Are you sure?",
          text: "You want to add this hashtag?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#010b40",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            sethashLoading(true);
            createHashtag(hash)
              .then(() => {
                sethashLoading(false);
                toast.success("Hashtag added successfully");
                getHashtags();
              })
              .catch((err) => {
                console.log(err.response, "err");
                sethashLoading(false);
                toast.error(err.response.data.message);
              });
            setHash("");
          }
        });
      }
    } else {
      setError(true);
    }
  };

  function renderFormatError() {
    let format = /[#\s]/;
    if (format.test(hash)) {
      return (
        <span class="help-block text-danger">you cannot write # or space</span>
      );
    } else if (hash.length === 0 && error) {
      return <span class="help-block text-danger">Please Enter Hashtag.</span>;
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
        "Hashtag",
        recurring_payment_type,
        package_id
      );
    } else {
      return subscribeServices(val, priceId, "Hashtag", plan, package_id);
    }
  }
  if (!loading) {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <h4 className="page-title">Hashtag Monitoring</h4>
          <div className="brand_container_main container">
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
                        Number Of Hashtags In {userInfo1.package.package_name}{" "}
                        Plan Is {hashtags.hashtag_limit}
                      </p>
                      <Row>
                        <Col md={12}>
                          <div class="mb-3">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <label>Add Hashtag</label>
                              <p>{`(${hashtags.limit}/${hashtags.hashtag_limit})`}</p>
                            </div>
                            <div className="d-flex flex-row hashtag-box">
                              <span class="input-group-text">#</span>

                              <input
                                style={{
                                  borderTopRightRadius: 0,
                                  borderBottomRightRadius: 0,
                                  width: "85%",
                                }}
                                onChange={(e) => setHash(e.target.value)}
                                type="text"
                                name="name"
                                placeholder="Enter Hashtag"
                                class="form-control comment-field"
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
                                    hashtags.hashtag_limit === hashtags.limit
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
                            {hashtags.message.map((data, i) => {
                              return (
                                <ListItem key={data.hashtag_id}>
                                  <Chip
                                    label={`#${data.hashtag}`}
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
                        heading="Buy Additional Hashtag Monitoring"
                        name="Hashtag"
                        subscribeServices={onSubscribe}
                        showInterval={showInterval}
                        changePlan={(v) => {
                          const planCut = v
                            .slice(0, v.length - 2)
                            .toLocaleLowerCase();
                          const getPrice = config
                            .filter((item) => item.product_name === "Hashtag")
                            .filter(
                              (subItem) => subItem.interval === planCut
                            )[0];
                          setPriceId(getPrice.price_id);
                          setPlan(v);
                        }}
                        monthly={
                          config
                            .filter((item) => item.product_name === "Category")
                            .filter(
                              (subItem) => subItem.interval === "month"
                            )[0]?.unit_amount / 3
                        }
                        yearly={
                          config
                            .filter((item) => item.product_name === "Category")
                            .filter((subItem) => subItem.interval === "year")[0]
                            ?.unit_amount / 3
                        }
                        plan={plan}
                        unitAmount={unitAmount}
                        usageLimit={hashtags.hashtag_limit}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profile_box_main col-md-6 col-sm-6 col-lg-6 col-xl-4">
                  <div className="brand-section dash_block_profile">
                    <div className="dash_content_profile">
                      <p>Buy paid subscription to add more Hashtags</p>
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
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return <Loader size={30} />;
  }
}
function mapStateToProps({ hashtags }) {
  return { hashtags };
}
export default connect(mapStateToProps, { ...hashActions, ...subActions })(
  HashtagsList
);
