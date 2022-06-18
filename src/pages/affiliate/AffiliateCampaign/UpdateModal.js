import React from "react";
import "react-virtualized-select/styles.css";
import VirtualizedSelect from "react-virtualized-select";
import Formsy from "formsy-react";
import { Button } from "reactstrap";
import moment from "moment";
import { Select } from "antd";
import Select2 from "react-select";
import { toast } from "react-toastify";
import InputValidation from "../../../components/InputValidation";
import { DatePicker } from "antd";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import InputNumberValidation from "../../../components/InputValidation/InputNumberValidation";
import { connect } from "react-redux";
import numeral from "numeral";
import * as postActions from "../../../actions/posts";
import ImageShop from "../AffiliateCreateCampaign/components/AffiliateImageShop";
const { Option } = Select;
const { RangePicker } = DatePicker;
// const dateFormat = "YYYY-MM-DD";

var imgDataSet;

class UpdateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      campaign_name: this.props.affData?.campaign_name,
      campaign_type: this.props.affData?.campaign_type,
      pay_per_hundred: this.props.affData?.pay_per_hundred,
      budget: this.props.affData?.budget,
      promoCodes: this.props.affData?.promo,
      promoCodesDiscount: this.props.affData?.discount,
      promoList: this.props.promoCodes,
      children: this.props.obj,

      // startDate: moment(),
      // endDate: moment().add(30, "days"),
      startDate: moment(this.props.affData?.start_date_and_time).format(
        "YYYY-MM-DD"
      ),
      endDate: moment(this.props.affData?.end_date_and_time).format(
        "YYYY-MM-DD"
      ),
      inputList: this.props.affData?.demographics,
      loading: false,
      country: "",
      state: "",
      city: "",
      zip: "",
      cities: "",
      stateList: "",
      reach: "",
      submit: false,
      cities2: [],
      states: [],
      promoCodeVal: "",
      Kbfee: "",
      //discount: this.props.affData?.discount,
      commission: this.props.affData?.commission,
    };
    this.dateRangePickerChanger = this.dateRangePickerChanger.bind(this);
  }

  async componentDidMount() {
    // axios
    //   .post("/fee")
    //   .then((res) => {
    //     console.log(res);
    //     this.setState({ Kbfee: res.data.message });
    //   })
    //   .catch((res) => {});

    axios
      .get("/affiliate/getcontract")
      .then((res) => {
        this.setState({
          Kbfee: res.data?.message?.fee,
          // commission: res.data?.message?.min_commission
          //   ? res.data?.message?.min_commission
          //   : "10",
          contractData: res.data?.message,
        });
      })
      .catch((res) => {});

    await axios
      .post(`/campaigns/reach`, {
        demographics: this.state.inputList,
      })
      .then((response) => {
        this.setState({ reach: response.data.message.influencers });
      })
      .catch((err) => {
        console.log(err);
      });

    const cityPromises = this.state.inputList.map((item) => {
      return axios.post(`/common/receive/cities`, {
        country_code: item.country,
        state_code: item.state,
      });
    });

    const statePromises = this.state.inputList.map((item) => {
      return axios.post(`/common/receive/states`, {
        country_code: item.country,
      });
    });

    Promise.all(cityPromises).then((res) => {
      this.setState({ cities2: res });
    });
    Promise.all(statePromises).then((res) => {
      this.setState({ states: res });
    });
  }

  titleChange = (value) => {
    this.setState({ campaign_name: value });
  };
  // ppClick = (value) => {
  //   this.setState({ pay_per_hundred: value });
  // };
  // budget = (value) => {
  //   this.setState({ budget: value });
  // };

  changePromoCode = (e, options, name, index) => {
    if (e === undefined) {
      this.setState({ promoCodesDiscount: "0%" });
      this.setState({ promoCodes: "KB0" });
    } else {
      var values = e.value.split(" ");
      var discount = values[0];
      this.setState({ promoCodesDiscount: discount });
      this.setState({ promoCodes: e.children });
    }
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
    // if (value <= this.state.contractData.max_commission) {
    //   this.setState({ commission: value });
    //   this.setState({ CommissionError: "" });
    // } else {
    //   this.setState({
    //     CommissionError: `Commission can not be greater than ${this.state.contractData.max_commission}`,
    //   });
    // }
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
  changeCountry = async (option, index) => {
    const list = [...this.state.inputList];
    list[index] = {
      country: option.value,
      // name: option.label,
      state: "all",
      city: "all",
      zip: "",
    };

    const res = await axios.post(`/common/receive/states`, {
      country_code: option.value,
    });

    const oldState = this.state.states;
    oldState.splice(index, 1, res);

    this.setState({ states: oldState });
    this.setState({ inputList: list }, () => {
      this.reachCampaign();
    });
  };
  changeState = async (option, index) => {
    const list = [...this.state.inputList];
    list[index] = {
      ...list[index],
      state: option.value,
    };
    const res = await axios.post(`/common/receive/cities`, {
      country_code: this.state.inputList[index].country,
      state_code: option.value,
    });
    const oldCities = this.state.cities2;
    oldCities.splice(index, 1, res);
    this.setState({ cities2: oldCities });
    this.setState({ inputList: list }, () => {
      this.reachCampaign();
    });
  };
  changeCity = (option, index) => {
    const list = [...this.state.inputList];
    list[index] = {
      ...list[index],
      city: option.value,
    };
    this.setState({ inputList: list }, () => {
      this.reachCampaign();
    });
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
  updateCampaign = async (id) => {
    this.setState({ submit: true });
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
      //discount,
      promoCodes,
      commission,
      startDate,
      endDate,
      campaign_type,
    } = this.state;
    if (
      (campaign_name &&
        // budget &&
        // pay_per_hundred &&
        //  discount,
        promoCodes,
      commission,
      startDate && endDate && campaign_type && place)
    ) {
      this.setState({ loading: true });
      await axios
        .put(
          `/campaigns/revise/affiliatecampaign/${this.props.affData?.campaign_id}`,
          {
            post_id: id,
            campaign_name: this.state.campaign_name,
            campaign_type: this.state.campaign_type,
            redirected_url: this.props.affData.redirected_url,
            media_url: this.props.affData.media_url,
            category_id: this.props.affData.categories[0].category_id,
            children: imgDataSet,
            promo: this.state.promoCodes,
            //promo_id: this.state.promoCodes.value,
            discount_type: "shopify",
            discount: this.state.promoCodesDiscount,
            commission: parseInt(this.state.commission),
            // budget: parseInt(this.state.budget),
            // pay_per_hundred: parseInt(this.state.pay_per_hundred),
            // traffic: 100,
            demographics:
              this.state.inputList[0].country === ""
                ? ""
                : this.state.inputList,
            start_date: this.state.startDate,
            end_date: this.state.endDate,
          }
        )
        .then((response) => {
          toast.success("Your Campaign is Updated Successfully");
          this.setState({ loading: false });
          this.props.reload();
          // this.props.affCloseModal();
          // this.props.getPosts(1, null, this.props.clearPost);
          this.props.updatePost(id);
          this.props.affCloseModal();
        })
        .catch((err) => {
          this.setState({ loading: false });
          toast.error("Something went wrong");
        });
    }
  };
  // handle Zip input change
  handleZipChange = (e, index) => {
    if (e.target.value.length > 5) {
      e.preventDefault();
      return false;
    } else {
      const { value } = e.target;
      const list = [...this.state.inputList];
      list[index].zip = value;
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
      promoCodeDsc: "0%",
      promoCodePromo: "KB0",
      country: "",
      state: "",
      city: "",
      zip: "",
      cities: "",
      stateList: "",
      reach: "",
      campaign_name: this.props.affData?.campaign_name,
      campaign_type: this.props.affData?.campaign_type,
      // pay_per_hundred: this.props.affData?.pay_per_hundred,
      // budget: this.props.affData?.budget,
      discount: this.props.affData?.discount,
      commission: this.props.affData?.commission,
      startDate: this.props.affData?.start_date_and_time,
      endDate: this.props.affData?.end_date_and_time,
      inputList: this.props.affData?.demographics,
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

  formatOptionLabel = ({ value, label, discount }) => (
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

  imgData = (data) => {
    imgDataSet = data;
  };

  render() {
    const { affData } = this.props;
    let category =
      affData.categories.length !== 0 ? affData.categories[0].category_id : [];

    const renderStateValue = (x, i) => {
      if (x.country) {
        const exit = [
          { isoCode: "all", name: "All States" },
          ...this.state.states[i].data.message,
        ].filter((item) => item.isoCode === x.state);

        return exit[0]
          ? { value: exit[0].isoCode, label: exit[0].name }
          : { value: "", label: "All States" };
      } else {
        return { value: "", label: "All States" };
      }
    };

    // const formatOptionLabel = ({ value, label, discount }) => (
    //   <div style={{ display: "flex", position: "relative" }}>
    //     <div>{label}</div>
    //     <div
    //       style={{
    //         position: "absolute",
    //         color: "black",
    //         right: "0",
    //         fontSize: "12px",
    //       }}
    //     >
    //       {discount}
    //     </div>
    //   </div>
    // );

    const renderConValue = (x) => {
      const exit = this.props.countries.filter(
        (item) => item.value === x.country
      );

      return exit[0] ? exit[0] : { value: "", label: "Select Country" };
    };
    const renderCityValue = (x, i) => {
      if (x.state) {
        const exit = [
          { value: "all", name: "all" },

          ...this.state.cities2[0].data.message,
        ].filter((item) => item.name === x.city);

        return exit[0]
          ? {
              value: exit[0].name,
              label: exit[0].name === "all" ? "All Cities" : exit[0].name,
            }
          : { value: "", label: "All Cities" };
      } else {
        return { value: "", label: "All Cities" };
      }
    };

    return (
      <React.Fragment>
        <Formsy.Form
          onValidSubmit={() =>
            this.updateCampaign(affData.post_id, affData.redirected_url)
          }
        >
          <div className="image-wrapper">
            <div className="image-box">
              <ImageShop
                imgData={this.imgData}
                mediaUrl={this.props?.affData?.media_url}
                selectPost={this.props?.affData?.media_url}
                children={this.props?.affData?.children}
                obj={this.props?.affData}
                source={this.props?.affData?.product_source}
              />
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
              <div className="row mt-3">
                <div className="date-range-aff col-md-6">
                  <label>Select Start Date / End Date</label>
                  <RangePicker
                    key={1}
                    // defaultValue={[
                    //   moment(this.state.startDate),
                    //   moment(this.state.endDate),
                    // ]}
                    value={[
                      moment.utc(this.state.startDate),
                      moment.utc(this.state.endDate),
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
                    // disabledDate={this.disabledDate()}
                  />
                </div>
                <div className="col-md-6 aff-commission">
                  <label>
                    Influencer Commission{" "}
                    <span className="small">
                      (Including {numeral(this.state.Kbfee).format("0,0'")}% KB
                      fees)
                    </span>
                  </label>
                  <InputNumberValidation
                    type="number"
                    id="commission"
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
                      type="radio"
                      name="platform"
                      id="clicks"
                      class="d-none imgbgchk"
                      value="clicks"
                      onChange={this.changeType}
                      checked={
                        this.state.campaign_type === "clicks" ? true : false
                      }
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
                      type="radio"
                      name="platform"
                      id="sales"
                      class="d-none imgbgchk"
                      value="sales"
                      onChange={this.changeType}
                      checked={
                        this.state.campaign_type === "sales" ? true : false
                      }
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
                    </div> 
                    </label>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {this.state.campaign_type !== "" ? (
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
                      Cost pper 1000 {this.state.campaign_type} (CPC)
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
                  </div>
                </div> */}

                <div className="row">
                  {/* <div className="col-md-3 mt-3">
                    <label>PromoCode</label>
                    <Select
                      size="small"
                      filterOption={(input, options) =>
                        options.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      defaultValue={this.state.promoCodes}
                      //disabled={!(formState === "add" || formState === "edit")}
                      placeholder="KB0"
                      //loading={this.state.promoCond}
                      optionFilterProp="children"
                      className="w-100 campaign-promo-select"
                      // onSearch={onSearch}
                      onChange={(options, e) =>
                        this.changePromoCode(e, options)
                      }
                      showSearch
                      allowClear
                    >
                      {this.state.promoList.map((customer, key) => {
                        return (
                          <Option key={customer.promo_percent + " " + key}>
                            {customer.promo}
                          </Option>
                        );
                      })}
                    </Select>
                  </div> */}

                  {/* <div className="col-md-3 mt-3">
                    <label>PromoCode For Customers</label>
                    <Select2
                      name="promoCode"
                      value={renderConValuePromoList(this.state.promoCodes)}
                      onChange={(options, e) =>
                        this.changePromoCode(e, options)
                      }
                      placeholder="Select PromoCode"
                      style={{ width: "100%" }}
                      // formatOptionLabel={formatOptionLabel}
                      options={this.state.promoList}
                    />
                  </div> */}
                  {/* <div className="col-md-3 mt-3">
                    <label>Discount</label>
                    <div className="promo_discount form-control">
                      {this.state.promoCodesDiscount}
                    </div>
                  </div> */}
                </div>

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
                              this.changeCountry(options, i)
                            }
                            placeholder="Select Country"
                            style={{ width: "100%" }}
                            options={this.props.countries.filter((item) => {
                              return item.value === "US";
                            })}
                            // isDisabled={
                            //   this.state.inputList.length - 1 !== i
                            //     ? true
                            //     : false
                            // }
                          />
                          {this.state.submit && !x.country ? (
                            <span
                              className={"number-error help-block text-danger"}
                              style={{ marginTop: "5px !important" }}
                            >
                              This value is required.
                            </span>
                          ) : null}
                        </div>
                        <div className="col-md-3 mt-3">
                          <label>State {i + 1}</label>
                          <VirtualizedSelect
                            key={i}
                            name="state"
                            value={
                              this.state.states.length > 0
                                ? renderStateValue(x, i)
                                : { value: "loading", label: "Loading..." }
                            }
                            onChange={(options, e) => {
                              this.changeState(options, i);
                            }}
                            placeholder="All States"
                            style={{ width: "100%" }}
                            options={
                              this.state.states.length > 0 && x.country
                                ? [
                                    { isoCode: "all", name: "All States" },
                                    ...this.state.states[i]?.data?.message,
                                  ].map((item) => {
                                    return {
                                      value: item.isoCode,
                                      label: item.name,
                                    };
                                  })
                                : []
                            }
                            disabled={
                              this.state.states.length > 0 && x.country
                                ? false
                                : true
                            }
                            clearable={false}
                            // isDisabled={
                            //   // this.state.stateList === ""
                            //   this.state.inputList[i].country === "" ||
                            //   this.state.inputList.length - 1 !== i
                            //     ? true
                            //     : false
                            // }
                          />
                          {this.state.submit && !x.state ? (
                            <span
                              className={"number-error help-block text-danger"}
                              style={{ marginTop: "5px !important" }}
                            >
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
                              this.state.cities2.length > 0
                                ? renderCityValue(x, i)
                                : { value: "loading", label: "Loading..." }
                            }
                            onChange={(options, e) =>
                              this.changeCity(options, i)
                            }
                            placeholder="All Cites"
                            style={{ width: "100%" }}
                            options={
                              this.state.cities2.length > 0 && x.state
                                ? [
                                    { value: "all", name: "all" },
                                    ...this.state.cities2[0].data.message,
                                  ].map((item) => {
                                    return {
                                      value: item.name,
                                      label:
                                        item.name === "all"
                                          ? "All Cites"
                                          : item.name,
                                    };
                                  })
                                : []
                            }
                            clearable={false}
                            disabled={x.state ? false : true}
                          />
                          {this.state.submit && !x.city ? (
                            <span
                              className={"number-error help-block text-danger"}
                              style={{ marginTop: "5px !important" }}
                            >
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
                            // disabled={
                            //   this.state.inputList.length - 1 !== i
                            //     ? true
                            //     : false
                            // }
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
                                  ? true
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
                        &nbsp;Update&nbsp;
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
export default connect(null, postActions)(UpdateModal);
