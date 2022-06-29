import React, { useState, useEffect } from "react";
import Formsy from "formsy-react";
import { Button } from "reactstrap";
import moment from "moment";
import { Select } from "antd";
import Select2 from "react-select";
import { toast } from "react-toastify";
import InputValidation from "../../../../components/InputValidation";
import { DatePicker } from "antd";
import axios from "axios";
import Loader from "../../../../components/Loader/Loader";
import InputNumberValidation from "../../../../components/InputValidation/InputNumberValidation";
import { connect } from "react-redux";
import * as postActions from "../../../../actions/posts";
// import { Country, State, City } from "country-state-city";
import VirtualizedSelect from "react-virtualized-select";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import ShopifyPromo from "./shopifyPromo";
import { textAlign } from "@mui/system";
import Connection from "../../../connectToShopify/connShopify";
import numeral from "numeral";
import ImageShop from "./AffiliateImageShop";
import SubCategories from "../../../linkinbio/component/ShopRightBar/subCategory"

const { Option } = Select;

const { RangePicker } = DatePicker;
// const dateFormat = "YYYY-MM-DD";

var tst;
var imgDataSet;
class AffiliateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      campaign_name: "",
      budgetCondition: "",
      campaign_type: "",
      pay_per_hundred: "",
      budget: "",
      promoCode: "",
      promoCodeDsc: "0%",
      promoCodePromo: "KB0",

      discountType: "",
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().add(90, "days").format("YYYY-MM-DD"),
      inputList: [{ country: "", state: "", city: "", zip: "" }],
      loading: false,
      country: "",
      state: "",
      city: "",
      zip: "",
      cities: "",
      stateList: "",
      reach: "",
      submit: false,
      discount: "",
      commission: "0",
      promoCond: true,
      connNotFound: true,
      Kbfee: "",
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }
  titleChange = (value) => {
    this.setState({ campaign_name: value, campaign_type: "sales" });
    // console.log(campaign_name, "campaign_name");
  };

  componentDidMount() {
    axios
      .get("/affiliate/getcontract")
      .then((res) => {
        this.setState({
          Kbfee: res.data?.message?.fee,
          commission: res.data?.message?.min_commission
            ? res.data?.message?.min_commission
            : "10",
          contractData: res.data?.message,
        });
      })
      .catch((res) => {});
  }
  ppClick = (value) => {
    this.setState(
      {
        pay_per_hundred: value,
      },
      () => {}
    );
    var pay_per_hundered = parseInt(this.state.pay_per_hundred);
    var budget = parseInt(this.state.budget);
    if (pay_per_hundered > budget) {
      this.setState({ budgetCondition: "PPC can not be greater than budget" });
    } else {
      this.setState({ budgetCondition: "" });
    }
  };
  budget = (value) => {
    this.setState({ budget: value });
  };
  discount = (value) => {
    if (value <= 50) {
      this.setState({ discount: value });
      this.setState({ discountError: "" });
    } else {
      this.setState({ discountError: "Discount can not be greater than 50" });
    }
  };
  commission = (value) => {
    if (parseInt(value) >= this.state.contractData.min_commission) {
      if (value <= this.state.contractData.max_commission) {
        this.setState({ commission: value });
        this.setState({ CommissionError: "" });
      } else {
        this.setState({
          CommissionError: `Commission can not be greater than ${this.state.contractData.max_commission}%`,
        });
      }
    } else {
      this.setState({
        CommissionError: `Commission can not be less than ${this.state.contractData.min_commission}%`,
      });
    }
  };

  dateRangePickerChanger(value, dataString) {
    let startDate = dataString[0];
    let endDate = dataString[1];
    this.setState({ startDate: startDate });
    this.setState({ endDate: endDate });
  }

  changeType = (e) => {
    const { value } = e.target;

    this.setState({
      campaign_type: value,
    });
  };
  // changeCountry = (option, index) => {
  //   const list = [...this.state.inputList];
  //   list[index] = {
  //     country: option.value,
  //     // name: option.label,
  //     state: "",
  //     city: "",
  //     zip: "",
  //   };
  //   this.setState({ inputList: list }, () => {
  //     this.reachCampaign();
  //   });
  // };
  // changeState = (option, index) => {
  //   const list = [...this.state.inputList];
  //   list[index] = {
  //     ...list[index],
  //     state: option.value,
  //   };
  //   this.setState({ inputList: list }, () => {
  //     this.reachCampaign();
  //   });
  // };
  // changeCity = (option, index) => {
  //   const list = [...this.state.inputList];
  //   list[index] = {
  //     ...list[index],
  //     city: option.value,
  //   };
  //   this.setState({ inputList: list }, () => {
  //     this.reachCampaign();
  //   });
  // };
  changeCountry = (e, options, name, index) => {
    const list = [...this.state.inputList];
    list[index][name] = options.value;
    list[index]["state"] = "all";
    list[index]["city"] = "all";
    this.setState({ country: options, inputList: list });
    this.getState(options.value);
    this.reachCampaign();
  };

  changePromoCode = (e, options, name, index) => {
    // let data = String(options.value);

    if (e === undefined) {
      this.setState({ promoCodeDsc: "0%" });
      this.setState({ promoCodePromo: "KB0" });
    } else {
      var values = e.value.split(" ");
      var discount = values[0];
      this.setState({ promoCodeDsc: discount });
      this.setState({ promoCodePromo: e.children });
    }
  };

  changeState = (e, options, name, index) => {
    const list = [...this.state.inputList];
    list[index][name] = options.value;

    if (options.value !== "all") {
      this.getCities(options.countryCode, options.value);
    } else {
      list[index]["city"] = "all";
      const selectCities = [];
      let all = {};
      all.value = "all";
      all.label = "All";
      all.countryCode = this.state.country.value;
      selectCities.unshift(all);
      this.setState({ cities: selectCities });
    }
    this.setState({ state: options, inputList: list });

    this.reachCampaign();
  };
  changeCity = (e, options, name, index) => {
    const list = [...this.state.inputList];
    list[index][name] = options.value;
    this.setState({ city: options, inputList: list });
    this.reachCampaign();
  };

  // handleClick = (data, status) => {
  //   if (status === false) {
  //     this.setState({ connNotFound: false });
  //   } else {
  //     if (data == undefined) {
  //       this.setState({ promoCond: true });
  //     } else {
  //       const promo = data;
  //       if (data.length > 0) {
  //         this.setState({ promoCond: false });
  //       } else {
  //         this.setState({ promoCond: true });
  //       }
  //       tst = data;
  //     }
  //   }
  // };

  handleClick = (data, status) => {
    tst = data;
    if (status === false) {
      this.setState({ connNotFound: false });
    } else {
      tst = data;
    }
  };

  getState = async (countryCode) => {
    await axios
      .post(`/common/receive/states`, { country_code: countryCode })
      .then((response) => {
        const selectState = [];
        const states = response.data.message;
        states.map(({ name, countryCode, isoCode }) => {
          return selectState.push({
            value: isoCode,
            label: name,
            countryCode: countryCode,
          });
        });
        let all = {};
        all.value = "all";
        all.label = "All States";
        all.countryCode = this.state.country.value;
        selectState.unshift(all);
        this.setState({ stateList: selectState });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getCities = async (countryCode, stateCode) => {
    await axios
      .post(`/common/receive/cities`, {
        country_code: countryCode,
        state_code: stateCode,
      })
      .then((response) => {
        const selectCities = [];
        const cities = response.data.message;
        cities.map(({ name }) => {
          return selectCities.push({
            value: name,
            label: name,
          });
        });
        let all = {};
        all.value = "all";
        all.label = "All Cities";
        all.countryCode = this.state.country.value;
        selectCities.unshift(all);
        this.setState({ cities: selectCities });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  saveCampaign = async (id) => {
    this.setState({ submit: true });

    // var pay_per_hundered = parseInt(this.state.pay_per_hundred);
    // var budgets = parseInt(this.state.budget);
    // if(this.state.promoCodeVal != ''){
    //   this.setState({discountType:'shopify'})
    // }
    // else{
    //   this.setState({discountType:'brand_shop'})
    // }

    const place = this.state.inputList.reduce((acc, item) => {
      if (!item.country || !item.state || !item.city) {
        acc = false;
      }
      return acc;
    }, true);
    const {
      campaign_name,
      // budget,
      // pay_per_hundred,
      promoCodeDsc,
      promoCodePromo,
      commission,
      startDate,
      endDate,
      campaign_type,
    } = this.state;
    if (
      (campaign_name &&
        // budget &&
        // pay_per_hundred &&
        promoCodePromo,
      commission &&
        promoCodeDsc &&
        startDate &&
        endDate &&
        campaign_type &&
        place)
    ) {
      this.setState({ loading: true });
      await axios
        .post(`/campaigns/reserve`, {
          post_id: id,
          campaign_name: this.state.campaign_name,
          campaign_type: this.state.campaign_type,
          redirected_url: this.props.affData.redirected_url,
          media_url: this.props.affData.media_url,
          discount_type: "shopify",
          promo: this.state.promoCodePromo,
          discount: this.state.promoCodeDsc,
          children: imgDataSet,
          category_id:
            this.props.affData.categories.length !== 0
              ? this.props.affData.categories[0].category_id
              : "",
          sub_category_id:
          this.props.affData.sub_categories.length !== 0
              ? this.props.affData.sub_categories[0].sub_category_id
              : "",
          //discount: parseInt(this.state.discount),
          commission: parseInt(this.state.commission),
          // budget: parseInt(this.state.budget),
          // pay_per_hundred: parseInt(this.state.pay_per_hundred),
          // traffic: 100,
          demographics:
            this.state.inputList[0].country === "" ? "" : this.state.inputList,
          start_date: this.state.startDate,
          end_date: this.state.endDate,
        })
        .then((response) => {
          // toast.success("Your Campaign is Schedule Successfully");
          toast.success("Your Campaign Added Successfully");
          this.setState({ loading: false });
          // this.props.affCloseModal();
          // this.props.getPosts(1, null, this.props.clearPost);
          this.props.updatePost(id);
          // this.props.affCloseModal();
          this.props.toggleTabs();
        })
        .catch((err) => {
          this.setState({ loading: false });
          toast.error("Insufficient Balance");
          // if (err.message) {
          //   // toast.error("PPC cannot be greater than budget");
          // } else {
          //   toast.error("Something went wrong");
          // }
        });
    }
  };
  // handle Zip input change
  handleZipChange = (e, index) => {
    if (e.target.value.length > 5) {
      e.preventDefault();
      return false;
    } else {
      const { name, value } = e.target;
      const list = [...this.state.inputList];
      list[index][name] = value;
      this.setState({ inputList: list });
    }
  };

  // handle click event of the Remove button
  handleRemoveClick = (index) => {
    const list = [...this.state.inputList];
    list.splice(index, 1);
    this.setState({ inputList: list }, () => {
      this.reachCampaign();
    });
    // setInputList(list);
  };

  // handle click event of the Add button
  handleAddClick = () => {
    this.reachCampaign();
    this.setState({
      inputList: [
        ...this.state.inputList,
        { country: "", state: "", city: "", zip: "" },
      ],
    });
  };
  reachCampaign = async () => {
    await axios
      .post(`/campaigns/reach`, {
        demographics: this.state.inputList,
      })
      .then((response) => {
        this.setState({ reach: response.data.message.influencers });
      })
      .catch((err) => {
        console.log(err);
        // toast.error("Something went wrong");
      });
  };
  reset = () => {
    this.setState({
      campaign_name: "",
      // pay_per_hundred: "",
      // budget: "",
      //discount: "",
      // promoCodeVal: "",
      promoCodeDsc: "0%",
      promoCodePromo: "KB0",
      commission: "10",
      inputList: [{ country: "", state: "", city: "", zip: "" }],
      startDate: moment(),
      endDate: moment().add(30, "days"),
      country: "",
      state: "",
      city: "",
      zip: "",
      cities: "",
      stateList: "",
      campaign_type: "",
      reach: "",
    });
  };
  copyToClipboard = (url) => {
    let textField = document.createElement("textarea");
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied to Clipboard!");
  };
  disabledDate(current) {
    return current && current < moment().endOf("day");
  }
  render() {
    const { affData } = this.props;
    let category =
      affData.categories.length !== 0 ? affData.categories[0].category_id : [];
    const renderConValue = (x) => {
      const exit = this.props.countries.filter(
        (item) => item.value === x.country
      );

      return exit[0] ? exit[0] : { value: "", label: "Select Country" };
    };

    const onSearch = (val) => {
      console.log("search:", val);
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

    const imgData = (data) => {
      imgDataSet = data;
    };

    const renderStateValue = (x) => {
      const exit =
        this.state.stateList === ""
          ? []
          : this.state.stateList.filter((item) => item.value === x.state);

      return exit[0];
    };

    // const renderCityValue = (x, i) => {
    //   if (this.state.state.value === "all") {
    //     return { value: "all", label: "All" };
    //   } else {
    //     const exit =
    //       this.state.cities === ""
    //         ? []
    //         : this.state.cities.filter((item) => item.value === x.city);
    //     return exit[0];
    //   }
    // };
    // console.log(this.props.Kbfee, "Kbfee");

    return (
      <React.Fragment>
        <Formsy.Form
          onValidSubmit={() =>
            this.saveCampaign(affData.post_id, affData.redirected_url)
          }
        >
          <div className="image-wrapper">
            <div className="image-box">
              {affData.media_type === "VIDEO" ? (
                <video
                  id={`post-video-${affData.post_id}`}
                  //autoPlay
                  controls
                  controlsList="nodownload"
                >
                  <source
                    src={affData.media_url + "#t=0.001"}
                    type="video/mp4"
                  ></source>
                </video>
              ) : (
                // <img
                //   src={affData.media_url}
                //   alt="media_url"
                //   className="post-image"
                // />
                <ImageShop
                  imgData={imgData}
                  mediaUrl={affData.media_url}
                  selectPost={affData.media_url}
                  children={affData.children}
                  obj={affData}
                  source={affData.product_source}
                />
              )}
              {/* <img src={`${affData.media_url}`} alt="media_url" /> */}
            </div>
            <div className="aff-img-edit-link image-edit-links">
              <div className="row">
                <div className="campaign-name col-md-6">
                  <label>Campaign Name</label>
                  <InputValidation
                    className=""
                    type="text"
                    id="campaign_name"
                    name="campaign_name"
                    required
                    value={this.state.campaign_name}
                    placeholder="Campaign Name"
                    onChange={(evt) => {
                      this.titleChange(evt.target.value);
                    }}
                    autoFocus
                  />
                </div>
                <div className="select-categories col-md-6">
                  <label>Category</label>
                  <Select
                    key={Date.now()}
                    value={category}
                    style={{ width: "100%" }}
                    placeholder="Category"
                    disabled={true}
                  >
                    {affData.categories
                      ? affData.categories.map(
                          ({ category_id, category_name }, i) => (
                            <Option value={category_id}>{category_name}</Option>
                          )
                        )
                      : []}
                  </Select>
                </div>
                {/* <div className="campaign-url col-md-6">
                  <label>URL</label>
               
                  <div className="url-copy">
                    <div className="your-copy-link">
                      <div className="item-a">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={affData.redirected_url}
                        >
                          {affData.redirected_url}
                        </a>
                      </div>
                      <div
                        onClick={() =>
                          this.copyToClipboard(affData.redirected_url)
                        }
                        className="item-b"
                      >
                        Copy
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="row  mt-3">
                <div className="date-range-aff col-md-6">
                  <label>Select Start Date / End Date</label>
                  <RangePicker
                    key={1}
                    defaultValue={[
                      moment(this.state.startDate),
                      moment(this.state.endDate),
                    ]}
                    value={[
                      moment(this.state.startDate),
                      moment(this.state.endDate),
                    ]}
                    defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
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
                    // format={dateFormat}
                    // showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD"
                    // onChange={this.dateRangePickerChanger}
                    onChange={this.dateRangePickerChanger.bind(this)}
                    disabledDate={this.disabledDate}
                  />
                </div>

                <div className="select-categories col-md-6">
                <SubCategories
                Campaign={this.props.affData}
                />
                </div>

                            
                <div className="col-md-6 aff-commission">
                  <label>Sales Commission</label>
                  <InputNumberValidation
                    type="number"
                    id="number"
                    name="commission"
                    value={this.state.commission}
                    onChange={(evt) => {
                      this.commission(evt.target.value);
                    }}
                    required
                    min="0"
                    max="50"
                  />
                  <div className="small">
                    Note: minimum commission is{" "}
                    {this.state.contractData?.min_commission
                      ? numeral(this.state.contractData?.min_commission).format(
                          "0,0'"
                        )
                      : "10"}
                    % and maximun commission is{" "}
                    {this.state.contractData?.max_commission
                      ? numeral(this.state.contractData?.max_commission).format(
                          "0,0'"
                        )
                      : "50"}
                    %
                  </div>
                  <span className="text-danger">
                    {this.state.CommissionError}
                  </span>
                </div>
              </div>

              {/* <div className="row mt-4">
                <div className="camp-type-ift col-md-12 d-flex">
                  <label className="n-camp-type pr-4">
                    <strong>Type of campaign:</strong>
                  </label>
                  {/* <div class="col1">
                    <input
                      type="radio"
                      name="platform"
                      id="impressions"
                      class="d-none imgbgchk"
                      value="impressions"
                      onChange={this.changeType}
                      checked={
                        this.state.campaign_type === "impressions"
                          ? true
                          : false
                      }
                    />
                    <label for="impressions">
                      <span className="imp-click">
                        <i class="fa fa-picture-o fa-2x" aria-hidden="true"></i>
                      </span>
                      <span className="imp-name">Impressions</span>
                      
                    </label>
                  </div> */}
              {/* <div class="col1">
                    <input
                      // type="radio"
                      name="platform"
                      id="clicks"
                      class="d-none imgbgchk"
                      value="clicks"
                      onChange={this.changeType}
                      type={
                        this.state.campaign_name === "" ? "submit" : "radio"
                      }
                      // checked={
                      //   this.state.campaign_type === "clicks" ? true : false
                      // }
                      checked={this.state.campaign_name !== "" ? true : false}
                    />
                    <label for="clicks">
                      <span className="imp-click">
                        <i
                          class="fa fa-hand-pointer-o fa-2x"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span className="imp-name">Clicks</span>
                      {/* <div class="tick_container">
                      <div class="tick">
                        <i class="fa fa-check"></i>
                      </div>
                    </div> 
                    </label>
                  </div> 
                  <div class="col1">
                    <input
                      type={
                        this.state.campaign_name === "" ? "submit" : "radio"
                      }
                      name="platform"
                      id="sales"
                      class="d-none imgbgchk"
                      value="sales"
                      onChange={this.changeType}
                      checked={this.state.campaign_name !== "" ? true : false}
                      // disabled
                    />
                    <label for="sales">
                      <span className="imp-click">
                        <i class="fa fa-usd fa-2x" aria-hidden="true"></i>
                      </span>
                      <span className="imp-name">Sales</span>
                      {/* <div class="tick_container">
                      <div class="tick">
                        <i class="fa fa-check"></i>
                      </div>
                    </div> *
                    </label>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {this.state.campaign_name !== "" ? (
            <>
              <div className="demographic-section">
                {/* <div className="row">
                  <div className="col-md-6 mt-3">
                    <label>Total Budget</label>
                    <InputNumberValidation
                      type="number"
                      id="budget"
                      name="budget"
                      value={this.state.budget}
                      onChange={(evt) => {
                        this.budget(evt.target.value);
                      }}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-6 mt-3">
                    <label>
                      Cost Per 1000 {this.state.campaign_type} (CPC)
                    </label>
                    <InputNumberValidation
                      type="number"
                      id="pay_per_hundred"
                      name="pay_per_hundred"
                      value={this.state.pay_per_hundred}
                      onChange={(evt) => {
                        this.ppClick(evt.target.value);
                      }}
                      required
                      min="0"
                    />

                    <span className="text-danger">
                      {this.state.budgetCondition}
                    </span>
                  </div>
                </div> */}
                {/* <ShopifyPromo PromoPayload={this.handleClick} /> */}

                {this.state.promoCond ? (
                  <></>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-3 mt-3">
                        <label>PromoCode</label>
                        <Select
                          size="small"
                          filterOption={(input, options) =>
                            options.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          //defaultValue={formState === "edit" ? form.getFieldValue().customerType : null}
                          //disabled={!(formState === "add" || formState === "edit")}
                          placeholder="KB0"
                          loading={this.state.promoCond}
                          optionFilterProp="children"
                          className="w-100 campaign-promo-select"
                          onSearch={onSearch}
                          onChange={(options, e) =>
                            this.changePromoCode(e, options)
                          }
                          showSearch
                          allowClear
                        >
                          {tst.map((customer, key) => {
                            return (
                              <Option key={customer.promo_percent + " " + key}>
                                {customer.promo}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>

                      {/* <div className="col-md-3 mt-3">
                            <label>PromoCode For Customers</label>
                            <Select2
                              name="promoCode"
                              // value={renderConValue(x)}
                              
                              value={this.state.promoCodeVal}
                              onChange={(options, e) =>
                                this.changePromoCode(e, options)
                              }
                              placeholder="Select PromoCode"
                              style={{ width: "100%" }}
                              //formatOptionLabel={this.state.promoCode}
                              // formatOptionLabel={formatOptionLabel}
                              options={this.state.promoCode}
                            />
                          </div> */}
                      <div className="col-md-3 mt-3">
                        <label>Discount</label>
                        <div className="promo_discount form-control">
                          {this.state.promoCodeDsc}
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <label>
                          Influencer Commission{" "}
                          <span className="small">
                            (Including{" "}
                            {this.state.Kbfee ? this.state.Kbfee : "0"}% KB
                            fees)
                          </span>
                        </label>
                        <InputNumberValidation
                          type="number"
                          id="number"
                          name="commission"
                          value={this.state.commission}
                          onChange={(evt) => {
                            this.commission(evt.target.value);
                          }}
                          required
                          min={
                            this.state.contractData?.min_commission
                              ? this.state.contractData?.min_commission.toString()
                              : "10"
                          }
                          max={
                            this.state.contractData?.max_commission
                              ? this.state.contractData?.max_commission.toString()
                              : "50"
                          }
                        />
                        <div className="small">
                          Note: minimum commission is{" "}
                          {numeral(
                            this.state.contractData?.min_commission
                          ).format("0,0'")}
                          % and maximum commission is{" "}
                          {numeral(
                            this.state.contractData?.max_commission
                          ).format("0,0'")}
                          %
                        </div>
                        <span className="text-danger">
                          {this.state.CommissionError}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* <div className="row">
                  <div className="col-md-6 mt-3">

                 {!this.state.promoCond ? <>

                  <label>PromoCode</label>
                          <Select2
                           name="promoCode"
                           //value={renderConValue(x)}
                              onChange={(options, e) =>
                               this.changePromoCode(e,options)
                             }
                            placeholder="Select PromoCode"
                            style={{ width: "100%" }}
                            options={this.state.promoCode}
                            
                          />
                        </>
                   :
                    <>
                    <label>Discount</label>
                    <InputNumberValidation
                      type="number"
                      id="number"
                      name="discount"
                      value={this.state.discount}
                      onChange={(evt) => {
                        this.discount(evt.target.value);
                      }}
                      required
                      min="0"
                      max="50"
                    />

                    <span className="text-danger">
                      {this.state.discountError}
                    </span>
                  
                  </>
                   }
                  </div>
                   
                  <div className="col-md-6 mt-3">
                    <label>Commission</label>
                    <InputNumberValidation
                      type="number"
                      id="number"
                      name="commission"
                      value={this.state.commission}
                      onChange={(evt) => {
                        this.commission(evt.target.value);
                      }}
                      required
                      min="0"
                      max="50"
                    />
                    <span className="text-danger">
                      {this.state.CommissionError}
                    </span>
                  </div>
                </div> */}

                <div className="country-select">
                  {this.state.inputList.map((x, i) => {
                    return (
                      <div className="c-con-select row">
                        <div className="col-md-3 mt-3">
                          <label>Country {i + 1}</label>
                          <Select2
                            key={i}
                            name="country"
                            value={renderConValue(x)}
                            onChange={(options, e) =>
                              this.changeCountry(e, options, "country", i)
                            }
                            placeholder="Select Country"
                            style={{ width: "100%" }}
                            options={this.props.countries.filter((item) => {
                              return item.value === "US";
                            })}
                            isDisabled={
                              this.state.inputList.length - 1 !== i
                                ? true
                                : false
                            }
                          />
                          {this.state.submit && !x.country ? (
                            <span className={"help-block text-danger"}>
                              This value is required.
                            </span>
                          ) : null}
                        </div>
                        <div className="col-md-3 mt-3">
                          <label>State {i + 1}</label>
                          <VirtualizedSelect
                            className
                            key={i}
                            name="state"
                            value={renderStateValue(x)}
                            onChange={(options, e) =>
                              this.changeState(e, options, "state", i)
                            }
                            placeholder="All States"
                            style={{ width: "100%" }}
                            options={this.state.stateList}
                            disabled={
                              // this.state.stateList === ""
                              this.state.inputList[i].country === "" ||
                              this.state.inputList.length - 1 !== i
                                ? true
                                : false
                            }
                            clearable={false}
                          />
                          {this.state.submit && !x.state ? (
                            <span className={"help-block text-danger"}>
                              This value is required.
                            </span>
                          ) : null}
                        </div>
                        <div className="col-md-3 mt-3">
                          <label>City {i + 1}</label>

                          <VirtualizedSelect
                            className
                            key={i}
                            name="city"
                            value={
                              x.city
                                ? {
                                    value: x.city,
                                    label:
                                      x.city === "all" ? "All Cities" : x.city,
                                  }
                                : { value: "", label: "All Cities" }
                            }
                            onChange={(options, e) =>
                              this.changeCity(e, options, "city", i)
                            }
                            placeholder="All Cities"
                            style={{ width: "100%" }}
                            options={this.state.cities}
                            clearable={false}
                            disabled={
                              this.state.inputList[i].state === "" ||
                              this.state.inputList.length - 1 !== i ||
                              this.state.inputList[i].state === "all"
                                ? true
                                : false
                            }
                          />
                          {this.state.submit && !x.city ? (
                            <span className={"help-block text-danger"}>
                              This value is required.
                            </span>
                          ) : null}
                        </div>
                        <div className="col-md-2 mt-3">
                          <label>Zip {i + 1}</label>
                          <input
                            type="number"
                            className="form-control"
                            name="zip"
                            placeholder="Zip"
                            value={x.zip}
                            onChange={(e) => this.handleZipChange(e, i)}
                            autoComplete="off"
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            min="0"
                            disabled={
                              this.state.inputList.length - 1 !== i
                                ? true
                                : false
                            }
                          />
                        </div>

                        <div className="add-del-btns col-md-1 pl-0">
                          {this.state.inputList.length !== 1 && (
                            <button
                              className="btn p-0 m-0"
                              onClick={() => this.handleRemoveClick(i)}
                            >
                              <span>
                                <i
                                  class="glyphicon glyphicon-trash fa-1x"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <strong>Remove</strong>
                            </button>
                          )}
                          {this.state.inputList.length - 1 === i && (
                            <button
                              className="btn p-0 m-0"
                              onClick={this.handleAddClick}
                              disabled={
                                this.state.inputList[i].country === "" ||
                                this.state.inputList[i].state === "" ||
                                this.state.inputList[i].city === ""
                                  ? // (this.state.inputList[i].city === "all" &&
                                    //   this.state.inputList[i].state === "all")
                                    true
                                  : false
                              }
                            >
                              <span>
                                <i
                                  class="fa fa-plus fa-1x"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <strong>Add</strong>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {this.state.reach === "" ? (
                    ""
                  ) : (
                    <>
                      <h5 className="mt-4">
                        Total Influencer: {this.state.reach.toString()}
                      </h5>
                      {/* <h5 className="mt-4">
                        Total Reach: {this.state.reach.toString()}
                      </h5> */}
                    </>
                  )}
                </div>
              </div>

              <div className="row mt-4">
                <div className="aff-sub-button col-md-12">
                  {this.state.loading ? (
                    <Button>
                      <Loader />
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="custom_btns_ift"
                        color="primary"
                        type="submit"
                      >
                        &nbsp;Save&nbsp;
                      </Button>

                      <Button
                        className="custom_btns_ift"
                        color="primary"
                        onClick={() => this.reset()}
                      >
                        &nbsp;Reset&nbsp;
                      </Button>

                      <Button
                        className="custom_btns_ift"
                        color="primary"
                        onClick={() => {
                          this.props.affCloseModal();
                        }}
                      >
                        &nbsp;Cancel&nbsp;
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </Formsy.Form>
      </React.Fragment>
    );
  }
}
export default connect(null, postActions)(AffiliateForm);
