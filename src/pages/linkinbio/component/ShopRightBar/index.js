import React, { useEffect, useState, useRef } from "react";
import Video from "../../../../components/Video";
import {
  // Modal,
  // ModalHeader,
  // ModalBody,
  Button,
} from "reactstrap";
import moment from "moment";
import { Select } from "antd";
import Loader from "../../../../components/Loader";
import InputValidation from "../../../../components/InputValidation";
import Formsy from "formsy-react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import * as promo from "../../../../actions/promoRequest";
import PermissionHelper from "../../../../components/PermissionHelper";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import ImageShop from "./imageShop";
import subCategories from "./subCategory";
import SubCategory from "./subCategory";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

let userInfo;
let dataPromo;
let PassPromoCode;
var subPromo;
var subDiscount;
var promoList;
var imgDataSet;
var SubCategoryId;

function ShopRightBar(props, { getPromoRequest, promoRequest, PromoPayload }) {
  if (typeof props.promo == "object" && props.promo !== null) {
  } else {
    subPromo = props.promo;
    subDiscount = props.discount;
  }
  const media_id = props.singlePost.post_id;

  const [startDate, setStartDate] = useState("");
  const [connNotFound, setconnFound] = useState(true);
  const [endDate, setEndDate] = useState("");
  const [redirectedUrl, setRedirectedUrl] = useState("");
  const [copyModal, setCopyModal] = useState(false);
  const formRef = useRef("LinkForm");
  const [promoCode, setPromoCode] = useState("");
  const [loader, setLoader] = useState(true);
  const [Kbfee, setKbfee] = useState();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [imgShop, setImgshop] = useState();
  const [promoCodeDscs, setDsc] = useState();
  const [promoCodePromo, setPromo] = useState();
  const [promoLoading, setPromoLoading] = useState(false);
  const [source, setSource] = useState(props.product_source);

  useEffect(() => {
    fetchPromo();
  }, []);
  useEffect(() => {
    if (props?.userInfo?.account_type === "brand") {
      setSource("ecommerce");
    } else {
      setSource("other");
    }
  }, [props.userInfo]);

  const fetchPromo = async (media_id) => {
    setPromoLoading(true);
    await axios
      .get(`/affiliate/getdefaultpromo`)
      .then((response) => {
        setPromo(response?.data?.promo);
        setDsc(response?.data?.discount);
        setPromoLoading(false);
      })

      .catch((err) => {
        console.log(err);
        setPromoLoading(false);
      });
  };

  useEffect(() => {
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // axios
    //   .post("/fee")
    //   .then((res) => {
    //     setKbfee(res.data.message);
    //   })
    //   .catch((res) => {});
    axios
      .get("/affiliate/getcontract")
      .then((res) => {
        setKbfee(res.data?.message?.fee ? res.data?.message?.fee : "0");
      })
      .catch((res) => {});
  }, []);

  useEffect(() => {
    if (props.singlePost.linked == false) {
      fetchPromo();
    }
  }, [props.singlePost.linked]);

  useEffect(() => {
    setStartDate(props.startDate);
    setEndDate(props.endDate);
  }, [props.startDate, props.endDate]);

  useEffect(() => {
    setDsc(props.discount);
  }, [props.discount]);

  useEffect(() => {
    if (props.category.length == 0) {
      setSource("ecommerce");
    }
  }, [props.category]);

  useEffect(() => {
    setPromo(props.promo);
  }, [props.promo]);

  useEffect(() => {
    // if (props.singlePost.linked) {
    //   setSource(props.product_source);
    // } else {
    //   setSource("ecommerce");
    // }
    if (connNotFound) {
      props.singlePost.linked
        ? setSource(props.product_source)
        : setSource("ecommerce");
    } else {
      setSource("other");
    }
  }, [props.product_source, props.singlePost]);

  useEffect(() => {
    setAmount(props.amount);
  }, [props.amount]);

  useEffect(() => {
    setDescription(props.description);
  }, [props.description]);

  useEffect(() => {
    setRedirectedUrl(props.redirectedUrl);
  }, [props.redirectedUrl]);

  useEffect(() => {
    props.selectPost(false, "");
    props.closeModel(false);
  }, [props.mobileDropdown]);

  useEffect(() => {
    if (props?.userInfo?.account_type === "brand") {
      setLoader(false);
      props
        .getPromoRequest()
        .then((res) => {
          setLoader(true);
        })
        .catch((res) => {
          setconnFound(false);
          setSource("other");
        });
    }
  }, [props.userInfo]);

  useEffect(() => {
    if (props.promo == "" && props.discount == "") {
    }
    if (props.redirectedUrl !== "" && props.singlePost.linked) {
      // setDsc(props.discount);
      // setPromo(props.promo);
      // setDescription(props.description);
      // setAmount(props.amount);
    } else {
      if (props.autoFocus === true) {
        // console.log("----");
        fetchPromo();
        setDescription("");
        setAmount(0);
      }
    }
  }, [props.autoFocus]);

  // useEffect(() => {
  //   if (typeof props.promo == "object" && props.promo !== null) {
  //   } else {
  //     if (props.promo) {
  //       setDsc(props.discount);
  //       setPromo(props.promo);
  //     }
  //     if (props.redirectedUrl === "") {
  //       setDsc(default_discount);
  //       setPromo(default_promo);
  //       setDescription("");
  //       setAmount(0);
  //       console.log(default_discount + "-without-" + default_promo);
  //     } else {
  //       setDsc(props.discount);
  //       setPromo(props.promo);
  //       console.log(promoCode + "-with-" + promoCodeDscs);
  //     }
  //   }
  // }, [props.redirectedUrl]);

  // useEffect(() => {
  //   if (props.promoData.promo === undefined) {
  //   } else {
  //     setPromo(props.promoData.promo);
  //     setDsc(props.promoData.discount);
  //   }
  // }, [props.promoData.promo]);

  if (loader == true) {
    dataPromo = props.promoRequest.message;

    const promo = dataPromo;

    if (dataPromo != undefined) {
      promoList = dataPromo;
    } else {
      promoList = [];
    }
  }

  function dateRangePickerChanger(value, dataString) {
    let startDate = dataString[0];
    let endDate = dataString[1];

    props.dateRange(startDate, endDate);
  }

  const changeAmount = (e) => {
    setAmount(e.target.value);
  };
  const changeDescription = (e) => {
    setDescription(e.target.value);
  };
  const changePromoCode = (e, options, name, index) => {
    if (e === undefined) {
      // setDsc("0%");
      // setPromo("KB0");
    } else {
      var values = e.value.split(" ");
      var discount = values[0];

      setDsc(discount);
      setPromo(e.children);
    }
  };
  const imgData = (data) => {
    imgDataSet = data;
  };

  const categoryData = (data) => {
    SubCategoryId = data;
    
  };
  // };
  return (
    <>
      {props.startDate && props.endDate && (
        <Formsy.Form
          onValidSubmit={() => {
            if (props.updatePage) {
              props.updatePost();
            } else {
              props.savePost &&
                props.savePost(
                  this,
                  promoCodePromo,
                  promoCodeDscs,
                  description,
                  amount,
                  imgDataSet,
                  source,
                  SubCategoryId
                );
            }
          }}
          ref={formRef}
        >
          <div
            className={`image-edit-box ${
              props.isSelectPost ? "show" : "hidden"
            }`}
          >
            <span
              onClick={() => props.selectPost(false, "")}
              className="fa fa-times ift-cancel"
            ></span>
            <div className="ind-post-anlytics image-box-info">
              <div className="edit-left">
                <h4>
                  {" "}
                  {props.singlePost.linked || props.updatePage
                    ? "Edit Post"
                    : "Add Post"}
                </h4>
                <p>
                  {props.singlePost.linked || props.updatePage
                    ? "Updated on " +
                      moment.utc(props.updatedDate).format("MMM Do YYYY")
                    : "Posted on " +
                      moment
                        .utc(props.singlePost.timestamp)
                        .format("MMM Do YYYY")}

                  {/* {props.media_id ? (
                    props.singlePost.linked || props.updatePage ? (
                      <span className="date-loader">
                        <Loader />
                      </span>
                    ) : (
                      "Updated on " +
                      moment.utc(props.updatedDate).format("MMM Do YYYY")
                    )
                  ) : (
                    "Posted on " +
                    moment.utc(props.singlePost.timestamp).format("MMM Do YYYY") 
                  )} */}
                </p>
              </div>

              {media_id && (
                <>
                  <div className="edit-right">
                    <div className="an-col col-md-3">
                      <div className="an-col-inr">
                        <div className="an-content clearfix">
                          <span class="dash_icon-top">
                            <i class="fa fa-eye fa-2x" aria-hidden="true"></i>
                          </span>
                          <div class="imp-t text-right">
                            {props.fetchUserPost.post_views
                              ? props.fetchUserPost.post_views
                              : 0}
                          </div>
                          <div class="imp-tx text-uppercase text-muted text-right">
                            IMPRESSIONS
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="an-col col-md-3">
                      <div className="an-col-inr">
                        <div className="an-content clearfix">
                          <span class="dash_icon-top">
                            <i
                              class="fa fa-hand-pointer-o fa-2x"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <div class="imp-t text-right">
                            {props.fetchUserPost.post_clicks
                              ? props.fetchUserPost.post_clicks
                              : 0}
                          </div>
                          <div class="imp-tx text-uppercase text-muted text-right">
                            CLICKS
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="an-col col-md-3">
                      <div className="an-col-inr">
                        <div className="an-content clearfix">
                          <span class="dash_icon-top">
                            <i
                              class="fa fa-handshake-o fa-2x"
                              aria-hidden="true"
                            ></i>
                          </span>
                          <div class="imp-t text-right">
                            {props.fetchUserPost.ctr
                              ? props.fetchUserPost.ctr === "NaN"
                                ? 0
                                : props.fetchUserPost.ctr
                              : 0}
                            %
                          </div>
                          <div class="imp-tx text-uppercase text-muted text-right">
                            ENGAGEMENT
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="an-col col-md-3">
                      <div className="an-col-inr">
                        <div className="an-content clearfix">
                          <span class="dash_icon-top">
                            <i class="fa fa-usd fa-2x" aria-hidden="true"></i>
                          </span>
                          <div class="imp-t text-right">$0.00</div>
                          <div class="imp-tx text-uppercase text-muted text-right">
                            REVENUE
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="image-wrapper">
              <div className="image-box">
                {!props.singleLoading ? (
                  props.singlePost.media_type !== "VIDEO" &&
                  // <img src={`${props.singlePost.media_url}`} alt="media_url" />
                  (userInfo?.account_type !== "influencer" ? (
                    <ImageShop
                      imgData={imgData}
                      children={props.children}
                      mediaUrl={props.singlePost.media_url}
                      selectPost={props.singlePost.media_url}
                      categoryList={props.categories}
                      promoList={promoList}
                      promoLoading={promoLoading}
                      Kbfee={Kbfee}
                      category={props.category}
                      source={source}
                      // setSource={setSource}
                      updateProduct={props.singlePost.linked}
                    />
                  ) : (
                    <img
                      src={`${props.singlePost.media_url}`}
                      alt="media_url"
                    />
                  ))
                ) : (
                  <Loader />
                )}
                {props.singlePost.media_type === "VIDEO" && (
                  <Video src={props.singlePost.media_url} />
                )}
              </div>
              <div className="image-edit-links">
                {userInfo?.account_type !== "influencer" ? (
                  <div className="">
                    <label>Select Source</label>
                    <Select
                      key={Date.now()}
                      value={source}
                      style={{ width: "100%" }}
                      placeholder="Select Source"
                      onChange={(value) => setSource(value)}
                      className="source_cap"
                      disabled={
                        props.singlePost.linked ||
                        props.updatePage ||
                        !connNotFound
                          ? true
                          : false
                      }
                    >
                      {/* <Option className="source_cap" value={source}>
                        {source}
                      </Option> */}
                      {connNotFound ? (
                        props.singlePost.linked || props.updatePage ? (
                          <Option className="source_cap" value={source}>
                            {source}
                          </Option>
                        ) : (
                          <>
                            <Option value="ecommerce">Ecommerce</Option>
                            <Option value="other">Other</Option>
                          </>
                        )
                      ) : (
                        <Option className="source_cap" value={source}>
                          {source}
                        </Option>
                      )}
                      {/* <Option value="other">Others</Option> */}
                    </Select>
                  </div>
                ) : null}
                {userInfo?.account_type === "influencer" ? (
                  <div
                    className={
                      userInfo?.account_type === "influencer" ? "" : "mt-3"
                    }
                  >
                    <label>
                      URL/AFFILIATE LINK -{" "}
                      <a
                        onClick={() => {
                          Swal.fire({
                            title: "Note",
                            text: "You can add link of a website or affiliate link provided by an affiliate network, example: CJ, Rakuten, Amazon, etc",
                            confirmButtonColor: "#010b40",
                          });
                        }}
                        href="javascript:void(0);"
                      >
                        {" "}
                        Copy/Paste Link
                      </a>{" "}
                    </label>
                    <InputValidation
                      className=""
                      placeholder="Enter URL"
                      // placeholder="Please Enter Website Address"
                      type="text"
                      id="website"
                      required
                      // disabled={
                      //   props.singlePost.linked || props.updatePage
                      //     ? true
                      //     : false
                      // }
                      name="website"
                      trigger="change"
                      validationError={{
                        isUrl: "This value should be a valid url.",
                      }}
                      value={props.redirectedUrl}
                      onChange={(evt) => {
                        props.callBack(evt);
                      }}
                    />
                  </div>
                ) : null}



                <div className="select-categories mt-3">
                  <label>Select Category</label>
                  <Select
                    key={Date.now()}
                    value={props.category}
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Category"
                    optionFilterProp="children"
                    clearable={false}
                    searchable={false}
                    required
                    onChange={props.changeCategory}
                    // onFocus={onFocus}
                    // onBlur={onBlur}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={
                      PermissionHelper.categoryCheck() || props.singleLoading
                        ? true
                        : false
                    }
                  >
                    {props.categories.map(({ value, label,parentId }, i) => (
                      <Option value={value+" "+parentId}>{label}</Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <SubCategory
                  subcategoryId={props}
                  categoryData={categoryData}
                  />
                </div>

                {props.singlePost.media_type === "VIDEO" && (
                  <>
                    <div className="form-check form-check-inline mt-3">
                      <input
                        onChange={props.changePostType}
                        className="form-check-input"
                        type="radio"
                        checked={props.postType === "video" ? "checked" : ""}
                        name="postType"
                        id="inlineRadio1"
                        value="video"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        Video
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        onChange={props.changePostType}
                        className="form-check-input"
                        type="radio"
                        checked={
                          props.postType === "advertisement" ? "checked" : ""
                        }
                        name="postType"
                        id="inlineRadio2"
                        value="advertisement"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        Advertisement
                      </label>
                    </div>
                  </>
                )}

                <div className="date-range mt-3">
                  <label>Start Date / End Date</label>
                  <RangePicker
                    key={1}
                    defaultValue={[moment(startDate), moment(endDate)]}
                    value={[moment(startDate), moment(endDate)]}
                    defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
                    disabledDate={(current) => {
                      let customDate = moment().format("YYYY-MM-DD");
                      return (
                        current && current < moment(customDate, "YYYY-MM-DD")
                      );
                    }}
                    allowClear={false}
                    ranges={{
                      Today: [moment(), moment()],

                      Tomorrow: [
                        moment().add(1, "days"),
                        moment().add(1, "days"),
                      ],
                      "This Month": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    style={{ width: "100%" }}
                    format={dateFormat}
                    onChange={dateRangePickerChanger}
                  />
                </div>

                {userInfo?.account_type == "influencer" ? (
                  <></>
                ) : (
                  <>
                    {/* <div className="row">
                      <div className="col-md-3 mt-3">
                        <label>PromoCode</label>

                        <Select
                          size="small"
                          filterOption={(input, options) =>
                            options.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          value={promoCodePromo ? promoCodePromo : "KB0"}
                          //disabled={!(formState === "add" || formState === "edit")}
                          placeholder="KB0"
                          //loading={this.state.promoCond}
                          optionFilterProp="children"
                          className="w-100"
                          // onSearch={onSearch}
                          onChange={(options, e) => changePromoCode(e, options)}
                          showSearch
                          allowClear={false}
                          loading={promoLoading ? true : false}
                          disabled={source ? true : false}
                        >
                          {promoList.map((customer, key) => {
                            return (
                              <Option key={customer.promo_percent + " " + key}>
                                {customer.promo}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>

                      <div className="col-md-3 mt-3">
                        <label>Discount</label>
                        <div className="promo_discount form-control">
                          {/* {renderConValuePromoList(this.state.promoCodeVal)} 
                          {promoCodeDscs ? promoCodeDscs : 0}
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <label>KB Fee</label>
                        <div className="promo_discount form-control">
                          {numeral(Kbfee).format("0,0'")}%
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="row">
                      <div className="col-md-3 mt-3">
                        <label>Amount</label>

                        <InputValidation
                          className=""
                          placeholder="Amount"
                          // placeholder="Please Enter Website Address"
                          type="number"
                          id="website"
                          name="website"
                          trigger="change"
                          disabled={source ? true : false}
                          validations={{
                            matchRegexp: /[0-9]{1}/,
                          }}
                          validationError={{
                            isUrl: "This value should be Number.",
                          }}
                          value={amount}
                          onChange={(e) => changeAmount(e)}
                        />
                      </div>

                      <div className=" col-md-9 mt-3">
                        <label>Description</label>
                        <InputValidation
                          className=""
                          placeholder="Enter Description"
                          // placeholder="Please Enter Website Address"
                          type="text"
                          id="website"
                          name="website"
                          trigger="change"
                          disabled={source ? true : false}
                          value={description}
                          onChange={(e) => changeDescription(e)}
                        />
                      </div>
                    </div> */}
                  </>
                )}

                <div className="edit_button_main pane-button">
                  {props.singlePost.linked || props.updatePage ? (
                    <>
                      {props.loading ? (
                        <Button>
                          <Loader />
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="custom_btns_ift"
                            color="primary"
                            onClick={(ev) =>
                              props.updatePost(
                                media_id,
                                props.redirectedUrl,
                                promoCodePromo,
                                promoCodeDscs,
                                description,
                                amount,
                                imgDataSet,
                                source,
                                SubCategoryId
                              )
                            }
                          >
                            &nbsp;Update&nbsp;
                          </Button>

                          {/* <Button
                            className="custom_btns_ift"
                            color="primary"
                            onClick={() => props.testUrl(props.redirectedUrl)}
                          >
                            &nbsp;Test&nbsp;
                          </Button> */}

                          <Button
                            className="custom_btns_ift"
                            color="primary"
                            onClick={() => {
                              props.selectPost(false, "");
                              props.closeModel(true);
                            }}
                          >
                            &nbsp;Cancel&nbsp;
                          </Button>

                          <Button
                            className="custom_btns_ift"
                            color="primary"
                            onClick={() => props.deletePost(media_id)}
                          >
                            &nbsp;Remove&nbsp;
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {props.loading ? (
                        <Button>
                          <Loader />
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="custom_btns_ift"
                            color="primary"
                            // onClick={(ev) =>
                            //   props.savePost && props.savePost(this)
                            // }
                          >
                            &nbsp;Save&nbsp;
                          </Button>

                          {userInfo?.account_type == "influencer" ? (
                            <Button
                              className="custom_btns_ift"
                              color="primary"
                              onClick={() => "test"}
                            >
                              &nbsp;Test&nbsp;
                            </Button>
                          ) : (
                            <></>
                          )}
                          <Button
                            className="custom_btns_ift"
                            color="primary"
                            onClick={() => {
                              props.selectPost(false, "");
                              props.closeModel(false);
                            }}
                          >
                            &nbsp;Cancel&nbsp;
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Formsy.Form>
      )}
    </>
  );
}

function mapStateToProps({ getPromoRequest, promoRequest }) {
  return { getPromoRequest, promoRequest };
}
export default connect(mapStateToProps, {
  ...promo,
})(ShopRightBar);
