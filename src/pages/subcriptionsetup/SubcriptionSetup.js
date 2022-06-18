import React from "react";
import axios from "axios";
import Select from "react-select";
import { createBrowserHistory } from "history";
import { toast } from "react-toastify";
import { Button, Modal, Collapse } from "react-bootstrap";
import { Label, Input } from "reactstrap";
import * as subActions from "../../actions/subscribe";
import Loader from "../../components/Loader/Loader";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import PackageDetail from "./component/PackageDetail";

export const history = createBrowserHistory({
  forceRefresh: true,
});

class SubcriptionSetup extends React.Component {
  constructor(props) {
    const userInfo1 = JSON.parse(localStorage.getItem("userInfo"));
    super(props);
    this.state = {
      packages: "",
      package: userInfo1?.package?.package_name,
      packageId: userInfo1?.package?.package_id,
      userInfo: userInfo1,
      upgrade: false,
      allPackages: "",
      singlePackage: "",
      packageIndex: "",
      showPaymentButton:
        userInfo1.package.subscription_type === "Trial" ? true : false,
      checkbox: {},
      help1: true,
      help2: true,
      help3: true,
      promo_code: "",
      prices: [],
      paymentLoading: false,
      plan:
        userInfo1?.package?.recurring_payment_type === "" ||
        userInfo1?.package?.recurring_payment_type === undefined
          ? "Monthly"
          : userInfo1?.package?.recurring_payment_type,
      cancelPlan: false,
      pack_modal: false,
      showTrial: false,
    };
  }
  componentDidMount() {
    this.props.configSubs().then((res) => {
      this.setState({ prices: res.message });
    });
    this.getPackages();
  }

  getPackages = async () => {
    await axios
      .get(`/package/receive`)
      .then((response) => {
        const selectPackages = [];
        let packages = response.data.message;
        if (this.state.userInfo.package.package_name === "Brand") {
          packages = packages.filter((item) => item.package_name === "Brand");
        } else {
          packages = packages.filter((item) => item.package_name !== "Brand");
        }

        const singlePackage = packages.filter(
          (item) => item.package_id === this.state.userInfo.package.package_id
        );
        const index = packages.findIndex(
          (item) => item.package_id === this.state.userInfo.package.package_id
        );
        const maxIndex = packages.length - 1;
        singlePackage[0].index = index;
        if (index !== maxIndex) {
          this.setState({ upgrade: true });
        }

        if (index) {
          this.setState({ upgrade: false });
        }

        this.setState({ packageIndex: index });
        this.setState({ allPackages: packages });
        this.setState({ singlePackage: singlePackage[0] });
        // let disabledSelect =
        //   this.state.userInfo.package.package_id === "61c02e2ff40bec74fac2ca09"
        //     ? true
        //     : false;
        packages.map(({ package_id, package_name }, index1) => {
          let disabledSelect = false;
          //Influencer Account

          if (index === 1) {
            if (index1 === 0) {
              disabledSelect = true;
            }
          }

          //Influencer Plus

          if (index === 2) {
            if (index1 === 0 || index1 === 1) {
              disabledSelect = true;
            }
          }
          if (package_id === "61c02d43f40bec74fac2c9a0") {
            disabledSelect = true;
          }
          return selectPackages.push({
            value: package_id,
            label: package_name,
            isdisabled: disabledSelect,
            index: index1,
          });
        });

        this.setState({ packages: selectPackages });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handlePackage = (event) => {
    const userInfo1 = JSON.parse(localStorage.getItem("userInfo"));
    const singlePackage = this.state.allPackages.filter(
      (x) => x.package_id === event.value
    );
    // const maxIndex = this.state.allPackages.length - 1;
    this.setState({ singlePackage: singlePackage[0] });
    this.setState({ package: event.label });
    this.setState({ package_id: event.value });
    this.setState({ promo_error: false });
    this.setState({ pack_modal: true });

    if (this.state.packageIndex < event.index) {
      this.setState({ upgrade: true, showPaymentButton: true });
    } else if (userInfo1.package.subscription_type === "Trial") {
      this.setState({ upgrade: true, showPaymentButton: true });
    } else if (this.state.packageIndex > event.index) {
      this.setState({ upgrade: false });
      this.setState({ showPaymentButton: false });
    } else if (event.index === this.state.packageIndex) {
      this.setState({ upgrade: false });
      this.setState({ showPaymentButton: false });
    }
  };

  handleCheckbox = (e) => {
    const target = e.target;
    const { checkbox } = this.state;
    const value = target.type === "checkbox" ? target.checked : target.value;
    checkbox[target.name] = value;
    this.setState({
      checkbox,
    });
  };

  handleClose = () => {
    this.setState({ checkbox: {} });
    this.setState({
      showPromo: false,
      showPaymentModel: false,
      promo_code: "",
    });
    this.setState({ help1: true, help2: true, help3: true });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (this.state.promo_code === "") {
      this.setState({ promo_error: true });
      this.setState({ promoCodeError: " Please Enter Valid Promo Code" });
    } else if (
      !this.state.checkbox.instagram &&
      !this.state.checkbox.facebook &&
      !this.state.checkbox.checkbox3 &&
      userInfo.package.package_id !== "61c02e2ff40bec74fac2ca09"
    ) {
      this.setState({ showPromo: true });
    } else {
      this.setState({ promoLoading: true });
      await axios
        .post("/payment/validatepromocode", {
          promo_code: this.state.promo_code,
          package_id: this.state.package_id,
        })
        .then((response) => {
          this.setState({ promoLoading: false });
          this.setState({ showPaymentButton: false });
          toast.success("Promo Code Applied SuccessFully");
          const userInformation = localStorage.getItem("userInfo");
          const parseUserInformation = JSON.parse(userInformation);
          parseUserInformation.package = response.data.message;
          this.setState({ myPackage: response.data.message.package_name });
          if (response?.data?.message?.package_name && this.props.setPackage) {
            this.props.setPackage(response.data.message.package_name);
          }
          const storeUserInformation = JSON.stringify(parseUserInformation);
          localStorage.setItem("userInfo", storeUserInformation);
          if (response.data.message.package_id !== "61c02d43f40bec74fac2c9a0") {
            history.push("/connect");
          } else {
            window.location.reload();
          }
        })
        .catch((err) => {
          this.setState({ promo_error: true });
          this.setState({ promoCodeError: err.response.data.message });
          toast.error(err.response.data.message);
          this.setState({ promoLoading: false, promo_code: "" });
          this.setState({ checkbox: {} });
        });
    }
  };

  promoChange = (e) => {
    this.setState({ promo_code: e.target.value, promo_error: false });
  };
  getPriceId = (value, name, arr) => {
    const interval = value.slice(0, value.length - 2);
    const priceLists = arr.filter(
      (item) => item.interval === interval && item.product_name === name
    );

    return priceLists;
  };

  // getPriceId = (value, name, arr) => {
  //   const interval = value.slice(0, value.length - 2);
  //   const priceLists =
  //     name =="61c02e2ff40bec74fac2ca09"
  //       ? arr.filter(
  //           (item) =>
  //             item.interval === interval && item.product_name ==="61d695e9bccdaf69f46efc66"
  //         )
  //       : arr.filter(
  //           (item) =>
  //             item.interval === interval && item.product_name ==="61c02e2ff40bec74fac2ca09"
  //         );

  //   return priceLists;
  // };

  // getPriceId = (value, name, arr) => {
  //   const interval = value.slice(0, value.length - 2);
  //   const priceLists = arr.filter(item => item.interval === interval && item.product_name === name);
  //   return priceLists;

  // };
  updatePackage = async (id, packageId) => {
    this.setState({ trailLoading: true });
    await axios
      .put(`users/revise/package/${id}`, {
        package_id: packageId,
      })
      .then((response) => {
        this.setState({ trailLoading: false });
        const userInformation = localStorage.getItem("userInfo");
        const parseUserInformation = JSON.parse(userInformation);
        parseUserInformation.package = response.data.message;
        const storeUserInformation = JSON.stringify(parseUserInformation);
        localStorage.setItem("userInfo", storeUserInformation);
        history.push("/connect");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ trailLoading: false });
        toast.error(err.response.data.message);
      });
  };
  packageToggleModal = () => {
    const { pack_modal } = this.state;
    this.setState({
      pack_modal: !pack_modal,
    });
  };

  render() {
    console.log(this.state.packages, "packages");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return (
      <div className="profile-page account-setup">
        <div className="container-fluid">
          <div className="mt-4 row">
            <div className="col-md-12">
              <h4 className="page-title">Subscription Setup</h4>
            </div>
          </div>
          <div className="profile_container_main container">
            <div className="inr-side-pkg row">
              <div className="profile_box_main col-md-8">
                <div className="card analytic-box">
                  <div className="card-row">
                    <div className="row">
                      <div className="col-8 col-md-9">
                        <h5>Subscription Details</h5>
                      </div>
                      <div className="col-4 col-md-3">
                        {/* <button
                          // onClick={() => {
                          //   this.setState({ cancelPlan: true });
                          // }}
                          className="btn-block btn text-white btn-sm disconnect-btn"
                        >
                          Cancel
                        </button> */}
                      </div>
                    </div>
                    <div className="subscription-caption">
                      <div className="row count-main-box">
                        <div className="col-12 count-box">
                          <h5 className="count-title">Current Subscription </h5>
                          <h3 className="count">
                            {userInfo.package.package_name}{" "}
                            {userInfo.package.subscription_type === "Trial" &&
                              ` (${userInfo.package.subscription_type})`}
                          </h3>
                        </div>
                        <div className="col-12 count-box">
                          <h5 className="count-title">Categories Included</h5>
                          <h3 className="count">
                            {/* {this.state.singlePackage.category_count} */}
                            {userInfo.package.category_count}
                          </h3>
                        </div>
                        <div className="col-12 count-box">
                          <h5 className="count-title">Links Included</h5>
                          <h3 className="count">
                            {/* {this.state.singlePackage.link_count} */}
                            {userInfo.package.link_count}
                          </h3>
                        </div>

                        <div className="col-12 count-box">
                          <h5 className="count-title">Hashtags</h5>
                          <h3 className="count">
                            {/* {this.state.singlePackage.hashtag_limit} */}
                            {userInfo.package.hashtag_limit}
                          </h3>
                        </div>
                        <div className="col-12 count-box">
                          <h5 className="count-title">Profiles</h5>
                          <h3 className="count">
                            {/* {this.state.singlePackage.profile_limit} */}
                            {userInfo.package.profile_limit}
                          </h3>
                        </div>
                        {userInfo.package.package_id !==
                        "61c02d43f40bec74fac2c9a0" ? (
                          <>
                            {userInfo.package?.next_payment_date &&
                              userInfo?.package?.subscription_type !==
                                "Trial" && (
                                <div className="col-12 count-box">
                                  <h5 className="count-title">Payment Type</h5>
                                  <h3 className="count">
                                    {userInfo.package?.recurring_payment_type}
                                  </h3>
                                </div>
                              )}

                            {userInfo.package.trial_expiry_date ? (
                              <div className="col-12 count-box">
                                <h5 className="count-title">
                                  Trial Expiry Date
                                </h5>
                                <h3 className="count">
                                  {userInfo.package.trial_expiry_date &&
                                    `${userInfo.package.trial_expiry_date}`}
                                </h3>
                              </div>
                            ) : userInfo.package?.next_payment_date ? (
                              <div className="col-12 count-box">
                                <h5 className="count-title">Next Payment</h5>
                                <h3 className="count">
                                  {userInfo.package?.next_payment_date}
                                </h3>
                              </div>
                            ) : null}
                          </>
                        ) : null}
                        <div className="col-12 count-box align-items-center">
                          <h5 className="count-title col-md-6 pl-0 ">
                            Upgrade Subscription
                          </h5>
                          <h3 className="count col-md-6 pr-0">
                            <Select
                              isSearchable={false}
                              // isOptionDisabled={(option) => option.isdisabled} // disable an option
                              options={this.state.packages}
                              placeholder="Select Package"
                              value={{
                                label: this.state.package,
                                value: this.state.packageId,
                              }}
                              onChange={(event) => this.handlePackage(event)}
                              isDisabled={
                                this.state.packages === "" ? true : false
                              }
                            />
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.pack_modal &&
                this.state.singlePackage.package_name !==
                  userInfo.package.package_name && (
                  <PackageDetail
                    // packageToggleModal={this.packageToggleModal}
                    singlePackage={this.state.singlePackage}
                  />
                )}
            </div>
            {this.state.singlePackage.package_id !==
              "61c02d43f40bec74fac2c9a0" &&
              this.state.showPaymentButton && (
                <>
                  <div className="row">
                    <div className="profile_box_payment profile_box_main col-md-8">
                      <div className={"dash_block_profile"}>
                        <div className="dash_content_profile">
                          <h5>Manage Plan</h5>
                          {/* {!userInfo.is_trial_expired &&
                          this.state.singlePackage.package_id ===
                            "61c02e2ff40bec74fac2ca09" ? (
                            <div class="pkg-trial mb-2">
                              Try 14 days for free, no credit card information
                              required.
                            </div>
                          ) : null} */}
                          <div className="row">
                            <div className="colbx-inr col-md-12">
                              <>
                                <div className="checkbox abc-checkbox abc-checkbox-primary">
                                  <Input
                                    defaultChecked={
                                      this.state.plan === "Monthly"
                                        ? true
                                        : false
                                    }
                                    name="payment"
                                    value="Monthly"
                                    className="mt-0"
                                    id="checkbox1"
                                    type="radio"
                                    onChange={(e) => {
                                      this.setState({ plan: e.target.value });
                                    }}
                                  />{" "}
                                  <Label for="checkbox1" />
                                  Pay Monthly: $
                                  {this.state.singlePackage.package_id !==
                                  "61c02e2ff40bec74fac2ca09" ? (
                                    <>
                                      {
                                        this.state.singlePackage
                                          .package_amount_monthly
                                      }
                                    </>
                                  ) : (
                                    <>
                                      {/* <del> */}
                                      {
                                        this.state.singlePackage
                                          .package_amount_monthly
                                      }
                                      {/* </del>{" "}
                                        <ins>(Free For 90 Days)</ins> */}
                                    </>
                                  )}
                                </div>
                                <div className="checkbox abc-checkbox abc-checkbox-primary">
                                  <Input
                                    defaultChecked={
                                      this.state.plan === "Yearly"
                                        ? true
                                        : false
                                    }
                                    name="payment"
                                    value="Yearly"
                                    className="mt-0"
                                    id="checkbox2"
                                    type="radio"
                                    onChange={(e) => {
                                      this.setState({ plan: e.target.value });
                                    }}
                                  />{" "}
                                  <Label for="checkbox2" />
                                  Pay Yearly & Save{" "}
                                  {this.state.singlePackage.yearly_discount}% (
                                  $
                                  {this.state.singlePackage
                                    .package_amount_yearly * 12}
                                  /year )
                                  {/* {this.state.singlePackage.package_id !==
                                    "Premium" ? (
                                      <>
                                        {
                                          this.state.singlePackage
                                            .package_amount_yearly
                                        }
                                         &nbsp; (Save{" "}
                                        {
                                          this.state.singlePackage
                                            .yearly_discount
                                        }
                                        %) 
                                      </>
                                    ) : (
                                      <>
                                        
                                        &nbsp; (Save $
                                        {
                                          this.state.singlePackage
                                            .package_amount_yearly
                                        }
                                        )
                                        
                                      </>
                                    )} */}
                                  {/* {
                                  this.state.singlePackage.package_amount_yearly
                                }{" "}
                                &nbsp; (Save{" "}
                                {this.state.singlePackage.yearly_discount}%) */}
                                </div>
                              </>

                              <form onSubmit={this.handleSubmit}>
                                <div className="acct-promo-sec">
                                  <>
                                    <h4 className="mb-0">Have Promo Code?</h4>
                                    <span class="text-danger promo-err-box col-md-12 pl-0">
                                      {this.state.promo_error
                                        ? // <span className="text-danger mt-2">
                                          this.state.promoCodeError
                                        : // </span>
                                          null}
                                    </span>
                                    <div className="acct-promo-sec-inr">
                                      <input
                                        type="text"
                                        name="promo_code"
                                        placeholder="Enter Promo Code"
                                        value={this.state.promo_code}
                                        className="form-control"
                                        onInput={this.promoChange}
                                      />
                                      <Button
                                        type="submit"
                                        disabled={
                                          !this.state.promoLoading
                                            ? false
                                            : true
                                        }
                                      >
                                        Apply
                                      </Button>
                                    </div>
                                  </>

                                  <div className="make-canc-pay">
                                    {userInfo.package.package_id ===
                                    "61c02e2ff40bec74fac2ca09" ? (
                                      this.state.paymentLoading ? (
                                        <Button>
                                          <Loader />
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            Swal.fire({
                                              title: `Are you sure, you want to pay ${this.state.singlePackage.package_name.toLowerCase()} ${this.state.plan.toLowerCase()}?`,
                                              icon: "warning",
                                              showCancelButton: true,
                                              confirmButtonColor: "#010b40",
                                              cancelButtonColor: "#d33",
                                              confirmButtonText: "Yes",
                                            }).then((result) => {
                                              if (result.isConfirmed) {
                                                this.setState({
                                                  paymentLoading: true,
                                                });
                                                if (
                                                  userInfo.package
                                                    .package_id ===
                                                    "61c02d43f40bec74fac2c9a0" ||
                                                  userInfo?.package
                                                    ?.subscription_type ===
                                                    "Trial"
                                                ) {
                                                  this.props
                                                    .makePayment({
                                                      prices: this.getPriceId(
                                                        this.state.plan.toLowerCase(),
                                                        this.state.singlePackage
                                                          .package_name,
                                                        this.state.prices
                                                      ),
                                                      package_id:
                                                        this.state.singlePackage
                                                          .package_id,
                                                      recurring_payment_type:
                                                        this.state.plan,
                                                    })
                                                    .then((res) => {
                                                      this.setState({
                                                        paymentLoading: false,
                                                      });
                                                      window.open(res, "_self");
                                                    });
                                                } else {
                                                  this.props
                                                    .updateSubscription({
                                                      prices: this.getPriceId(
                                                        this.state.plan.toLowerCase(),
                                                        this.state.singlePackage
                                                          .package_name,
                                                        this.state.prices
                                                      ),
                                                      package_id:
                                                        this.state.singlePackage
                                                          .package_id,
                                                      recurring_payment_type:
                                                        this.state.plan,
                                                    })
                                                    .then((res) => {
                                                      this.setState({
                                                        paymentLoading: false,
                                                      });
                                                      localStorage.setItem(
                                                        "userInfo",
                                                        JSON.stringify({
                                                          ...userInfo,
                                                          package: res.message,
                                                        })
                                                      );
                                                      window.open(
                                                        res.url,
                                                        "_self"
                                                      );
                                                    })
                                                    .catch((err) => {
                                                      this.setState({
                                                        paymentLoading: false,
                                                      });
                                                      toast.error(
                                                        err.response.data
                                                          .message
                                                      );
                                                    });
                                                }
                                              }
                                            });
                                          }}
                                        >
                                          Make Payment
                                        </Button>
                                      )
                                    ) : !this.state.checkbox.instagram ||
                                      !this.state.checkbox.facebook ||
                                      !this.state.checkbox.checkbox3 ? (
                                      <>
                                        {/* <span className="credit-info">
                                          <Button
                                            onClick={() => {
                                              this.setState({
                                                showPaymentModel: true,
                                                showTrial: true,
                                              });
                                            }}
                                          >
                                            Start 14 Days Free Trial
                                          </Button>
                                          <code class="sm-color highlighter-rouge">
                                            No credit card required
                                          </code>
                                        </span> */}
                                        <Button
                                          onClick={() => {
                                            this.setState({
                                              showPaymentModel: true,
                                              showTrial: false,
                                            });
                                          }}
                                        >
                                          Make Payment
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        {/* <span className="credit-info">
                                          <Button>
                                            Start 14 Days Free Trial
                                          </Button>
                                          <code class="sm-color highlighter-rouge">
                                            No credit card required
                                          </code>
                                        </span> */}
                                        <Button>Make Payment</Button>
                                      </>
                                    )}

                                    <Button
                                      onClick={() => {
                                        this.setState({
                                          showPaymentButton: false,
                                          pack_modal: false,
                                          package_id: "",
                                          package:
                                            userInfo?.package?.package_name,
                                          packageId:
                                            userInfo?.package?.package_id,
                                        });
                                      }}
                                      type="button"
                                    >
                                      Cancel
                                    </Button>
                                  </div>

                                  <Modal
                                    className="pkg_readmore"
                                    show={this.state.showPromo}
                                    onHide={this.handleClose}
                                    centered
                                    size="lg"
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        {this.state.singlePackage.package_name}{" "}
                                        Package
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <div className="funkyradio">
                                        <p>
                                          Please make sure of the following
                                          before proceeding further:
                                        </p>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="instagram"
                                            id="instagram"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="instagram">
                                            Do you have Instagram business
                                            account?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help1: !this.state.help1,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>

                                          <Collapse in={!this.state.help1}>
                                            <div className="card card-body">
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Login To Your Instagram
                                                  Account.
                                                </li>
                                                <li>Go To Profile.</li>
                                                <li>
                                                  Select Settings{" "}
                                                  <i className="fa fa-cog"></i>
                                                </li>
                                                <li>
                                                  Find Account Icon{" "}
                                                  <i className="fa fa-user-circle-o"></i>
                                                </li>
                                                <li>
                                                  Find Switch Account Type.
                                                </li>
                                                <li>
                                                  Select Switch to Business
                                                  Account.
                                                </li>
                                              </ol>
                                              <p>
                                                You will now have an Instagram
                                                Business Account.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="facebook"
                                            id="facebook"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="facebook">
                                            Do you have Facebook account
                                            connected to a Facebook page?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help2: !this.state.help2,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>
                                          <Collapse in={!this.state.help2}>
                                            <div className="card card-body">
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Go to facebook.com and create
                                                  an account.
                                                </li>
                                                <li>
                                                  Once account is created,
                                                  connect to a facebook page.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Facebook account will be
                                                connected to a facebook page.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="checkbox3"
                                            id="checkbox3"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="checkbox3">
                                            Is your Facebook account connected
                                            with your Instagram account?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help3: !this.state.help3,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>
                                          <Collapse in={!this.state.help3}>
                                            <div className="card card-body">
                                              <span className="font-weight-bold">
                                                From Instagram:
                                              </span>
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Log in to Instagram and go to
                                                  your profile.
                                                </li>
                                                <li>Tap Edit Profile.</li>
                                                <li>
                                                  Under Public Business/Profile
                                                  Information, select Page.
                                                </li>
                                                <li>
                                                  Choose the Facebook page you
                                                  wish to connect to. If you
                                                  don’t have one yet, tap Create
                                                  a new Facebook page.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Instagram account will be
                                                connected to a Facebook account.
                                              </p>
                                              <span className="font-weight-bold">
                                                From Facebook:
                                              </span>
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Log in to Facebook and click
                                                  Pages in the left menu.
                                                </li>
                                                <li>
                                                  From your Facebook page, click
                                                  Settings.
                                                </li>
                                                <li>
                                                  Scroll down and select
                                                  Instagram in the left column.
                                                </li>
                                                <li>
                                                  Click Connect Account, and
                                                  fill in your Instagram
                                                  username and password.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Facebook account will be
                                                connected to an Instagram
                                                account.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div>
                                          {this.state.checkbox.instagram &&
                                          this.state.checkbox.facebook &&
                                          this.state.checkbox.checkbox3 ? (
                                            <Button
                                              type="submit"
                                              onClick={(e) => {
                                                this.setState({
                                                  showPromo: false,
                                                  help1: true,
                                                  help2: true,
                                                  help3: true,
                                                });
                                                this.handleSubmit(e);
                                              }}
                                            >
                                              Accept
                                            </Button>
                                          ) : null}
                                        </div>
                                      </div>
                                    </Modal.Body>
                                  </Modal>
                                  <Modal
                                    className="pkg_readmore"
                                    show={this.state.showPaymentModel}
                                    onHide={this.handleClose}
                                    centered
                                    size="lg"
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>
                                        {this.state.singlePackage.package_name}{" "}
                                        {this.state.showTrial ? "(Trial) " : ""}
                                        Package
                                      </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <div className="funkyradio">
                                        <p>
                                          Please make sure of the following
                                          before proceeding further:
                                        </p>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="instagram"
                                            id="instagram"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="instagram">
                                            Do you have Instagram business
                                            account?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help1: !this.state.help1,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>

                                          <Collapse in={!this.state.help1}>
                                            <div className="card card-body">
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Login To Your Instagram
                                                  Account.
                                                </li>
                                                <li>Go To Profile.</li>
                                                <li>
                                                  Select Settings{" "}
                                                  <i className="fa fa-cog"></i>
                                                </li>
                                                <li>
                                                  Find Account Icon{" "}
                                                  <i className="fa fa-user-circle-o"></i>
                                                </li>
                                                <li>
                                                  Find Switch Account Type.
                                                </li>
                                                <li>
                                                  Select Switch to Business
                                                  Account.
                                                </li>
                                              </ol>
                                              <p>
                                                You will now have an Instagram
                                                Business Account.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="facebook"
                                            id="facebook"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="facebook">
                                            Do you have Facebook account
                                            connected to a Facebook page?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help2: !this.state.help2,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>
                                          <Collapse in={!this.state.help2}>
                                            <div className="card card-body">
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Go to facebook.com and create
                                                  an account.
                                                </li>
                                                <li>
                                                  Once account is created,
                                                  connect to a business page.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Facebook account will be
                                                connected to a business page.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div className="funkyradio-primary form-check abc-checkbox abc-checkbox-primary">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="checkbox3"
                                            id="checkbox3"
                                            onChange={this.handleCheckbox}
                                          />
                                          <label for="checkbox3">
                                            Is your Facebook account connected
                                            with your Instagram account?{" "}
                                            <a
                                              onClick={(e) => {
                                                e.preventDefault();
                                                this.setState({
                                                  help3: !this.state.help3,
                                                });
                                              }}
                                              href="#"
                                            >
                                              Click here for help.
                                            </a>
                                          </label>
                                          <Collapse in={!this.state.help3}>
                                            <div className="card card-body">
                                              <span className="font-weight-bold">
                                                From Instagram:
                                              </span>
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Log in to Instagram and go to
                                                  your profile.
                                                </li>
                                                <li>Tap Edit Profile.</li>
                                                <li>
                                                  Under Public Business/Profile
                                                  Information, select Page.
                                                </li>
                                                <li>
                                                  Choose the Facebook page you
                                                  wish to connect to. If you
                                                  don’t have one yet, tap Create
                                                  a new Facebook page.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Instagram account will be
                                                connected to a Facebook account.
                                              </p>
                                              <span className="font-weight-bold">
                                                From Facebook:
                                              </span>
                                              <ol
                                                type="1"
                                                className="insta-list"
                                              >
                                                <li>
                                                  Log in to Facebook and click
                                                  Pages in the left menu.
                                                </li>
                                                <li>
                                                  From your Facebook page, click
                                                  Settings.
                                                </li>
                                                <li>
                                                  Scroll down and select
                                                  Instagram in the left column.
                                                </li>
                                                <li>
                                                  Click Connect Account, and
                                                  fill in your Instagram
                                                  username and password.
                                                </li>
                                              </ol>
                                              <p>
                                                Your Facebook account will be
                                                connected to an Instagram
                                                account.
                                              </p>
                                            </div>
                                          </Collapse>
                                        </div>
                                        <div>
                                          {this.state.checkbox.instagram &&
                                          this.state.checkbox.facebook &&
                                          this.state.checkbox.checkbox3 ? (
                                            // this.state.singlePackage
                                            //   .package_id ==="61c02e2ff40bec74fac2ca09" ? (
                                            //   <Button
                                            //     onClick={() => {
                                            //       this.updatePackage(
                                            //         userInfo?.user_id,
                                            //         this.state.singlePackage
                                            //           .package_id
                                            //       );
                                            //     }}
                                            //   >
                                            //     Continue
                                            //   </Button>
                                            // ) : (
                                            <>
                                              {!this.state.showTrial ? (
                                                this.state.paymentLoading ? (
                                                  <Button>
                                                    <Loader />
                                                  </Button>
                                                ) : (
                                                  <Button
                                                    onClick={() => {
                                                      this.setState({
                                                        paymentLoading: true,
                                                      });

                                                      if (
                                                        userInfo.package
                                                          .package_id ==
                                                          "61c02d43f40bec74fac2c9a0" ||
                                                        userInfo?.package
                                                          ?.subscription_type ===
                                                          "Trial"
                                                      ) {
                                                        this.props
                                                          .makePayment({
                                                            prices:
                                                              this.getPriceId(
                                                                this.state.plan.toLowerCase(),
                                                                this.state
                                                                  .singlePackage
                                                                  .package_name,
                                                                this.state
                                                                  .prices
                                                              ),
                                                            package_id:
                                                              this.state
                                                                .singlePackage
                                                                .package_id,
                                                            recurring_payment_type:
                                                              this.state.plan,
                                                          })
                                                          .then((res) => {
                                                            this.setState({
                                                              paymentLoading: false,
                                                            });
                                                            window.open(
                                                              res,
                                                              "_self"
                                                            );
                                                          });
                                                      } else {
                                                        this.props
                                                          .updateSubscription({
                                                            prices:
                                                              this.getPriceId(
                                                                this.state.plan.toLowerCase(),
                                                                this.state
                                                                  .singlePackage
                                                                  .package_name,
                                                                this.state
                                                                  .prices
                                                              ),
                                                            package_id:
                                                              this.state
                                                                .singlePackage
                                                                .package_id,
                                                          })
                                                          .then((res) => {
                                                            this.setState({
                                                              paymentLoading: false,
                                                            });
                                                            // localStorage.setItem(
                                                            //   "userInfo",
                                                            //   JSON.stringify({
                                                            //     ...userInfo,
                                                            //     package:
                                                            //       res.message,
                                                            //   })
                                                            // );
                                                            window.open(
                                                              res.message,
                                                              "_self"
                                                            );
                                                          })
                                                          .catch((err) => {
                                                            this.setState({
                                                              paymentLoading: false,
                                                            });
                                                            toast.error(
                                                              err.response.data
                                                                .message
                                                            );
                                                          });
                                                      }
                                                    }}
                                                  >
                                                    Make Payment
                                                  </Button>
                                                )
                                              ) : (
                                                !userInfo.is_trial_expired &&
                                                this.state.singlePackage
                                                  .package_id ===
                                                  "61c02e2ff40bec74fac2ca09" &&
                                                (this.state.trailLoading ? (
                                                  <Button>
                                                    <Loader />
                                                  </Button>
                                                ) : (
                                                  <>
                                                    <span className="credit-info">
                                                      <Button
                                                        onClick={() => {
                                                          this.updatePackage(
                                                            userInfo.user_id,
                                                            this.state
                                                              .singlePackage
                                                              .package_id
                                                          );
                                                        }}
                                                      >
                                                        Start 14 Days Free Trial
                                                      </Button>
                                                      <code class="sm-color highlighter-rouge">
                                                        No credit card required
                                                      </code>
                                                    </span>
                                                  </>
                                                ))
                                              )}
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                    </Modal.Body>
                                  </Modal>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, subActions)(SubcriptionSetup);
