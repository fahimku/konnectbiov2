import React from "react";
import axios from "axios";
import Select from "react-select";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import placeholder from "../../../src/images/placeholder.svg";
// import CustomCategory from "./component/CustomCategory";
import * as subActions from "../../actions/subscribe";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
import EditCustomCategory from "./component/EditCustomCategory";
import Swal from "sweetalert2";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import BuySubscription from "../subcriptionsetup/component/BuySubscription";
export const history = createBrowserHistory({
  forceRefresh: true,
});

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

class MyCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myCategory: "",
      myCustomCategory: "",
      user_id: "",
      category: [],
      defaultCategory: "",
      saveCategories: "",
      brandCategory: "",
      categoryError: "",
      loading: false,
      packages: "",
      package: userInfo.package.package_name,
      categoryAllow: userInfo.package.category_count,
      package_amount: userInfo.package.package_amount,
      sort: false,
      priceId: "",
      categoryLimit: "",
      showInterval: false,
      plan: "Yearly",
      config: [],
      unitAmount: "",
      catLoading: true,
    };
  }

  componentDidMount() {
    if (userInfo.package?.subscription_type !== "Trial") {
      var subType = JSON.parse(localStorage.getItem("userInfo")).package
        .recurring_payment_type;
      if (subType) {
        subType = subType.slice(0, subType.length - 2).toLocaleLowerCase();
        this.props.configSubs().then((res) => {
          const getPrice = res.message
            .filter((item) => item.product_name === "Category")
            .filter((subItem) => subItem.interval === subType)[0];
          this.setState({ priceId: getPrice.price_id });
          this.setState({ unitAmount: getPrice.unit_amount / 3 });
        });
      } else {
        this.setState({ showInterval: true });
        const planCut = this.state.plan
          .slice(0, this.state.plan.length - 2)
          .toLocaleLowerCase();
        this.props.configSubs().then((res) => {
          this.setState({ config: res.message });
          const getPrice = res.message
            .filter((item) => item.product_name === "Category")
            .filter((subItem) => subItem.interval === planCut)[0];
          this.setState({ priceId: getPrice.price_id });
          this.setState({ unitAmount: getPrice.unit_amount / 3 });
        });
      }
    }

    // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({ user_id: userInfo.user_id });
    this.fetchMyCategory();
    this.fetchSaveCategory();
    // this.getPackages();
    // this.fetchCustomCategory();
    // Connect Instagram Code
  }

  onSubscribe = (val, plan) => {
    const { recurring_payment_type, package_id } = JSON.parse(
      localStorage.getItem("userInfo")
    ).package;
    if (recurring_payment_type) {
      return this.props.subscribeServices(
        val,
        this.state.priceId,
        "Category",
        recurring_payment_type,
        package_id
      );
    } else {
      return this.props.subscribeServices(
        val,
        this.state.priceId,
        "Category",
        plan,
        package_id
      );
    }
  };

  getPackages = async () => {
    await axios
      .get(`/package/receive`)
      .then((response) => {
        const selectPackages = [];
        const packages = response.data.message;
        packages.map(({ package_id, package_name, package_amount }) => {
          return selectPackages.push({
            value: package_id,
            label: package_name,
          });
        });
        this.setState({ packages: selectPackages });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  fetchMyCategory = async () => {
    await axios
      .get("/usercategory/receive")
      .then((response) => {
        const selectCategories = [];
        const myCategories = response.data.message;
        myCategories.map(({ parent_id, category_name, image_url }) => {
          return selectCategories.push({
            value: parent_id,
            label: category_name,
            image: image_url,
          });
        });
        this.setState({
          myCategory: selectCategories,
          categoryLimit: response.data.category_limit,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchSaveCategory = async () => {
    await axios
      .get(`/users/receive/categories?id=${userInfo.user_id}`)
      .then((response) => {
        const saveCategories = [];
        //const myCategories = response.data.message;
        const optionCategories = response.data.message;

        optionCategories.map(
          ({ parent_id, category_name, image_url, editable, category_id }) => {
            return saveCategories.push({
              value: parent_id,
              label: category_name,
              image: image_url,
              editable: editable,
              category_id: category_id,
            });
          }
        );

        this.setState({
          // defaultCategory: myCategories,
          saveCategories: saveCategories,
          brandCategory: saveCategories,
        });

        {
          this.props.catTab &&
            this.setState({ catLoading: false }, () => {
              this.props.catTab(
                this.state.brandCategory,
                this.state.catLoading
              );
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fetchCustomCategory = async () => {
    await axios
      .get("/customcategory/receive?custom=1")
      .then((response) => {
        const selectCategories = [];
        const myCustomCategories = response.data.message;
        myCustomCategories.map(({ category_id, category_name, image_url }) => {
          return selectCategories.push({
            value: category_id,
            label: category_name,
            image: image_url,
          });
        });
        this.setState({ myCustomCategory: selectCategories });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSelect = (e, options) => {
    let difference = this.state.saveCategories.filter(
      (x) => !options.includes(x)
    );
    if (difference.length > 0) {
      Swal.fire({
        title: "Are You Sure You Want To Delete This Category?",
        text: "This Will Uncategorize All Your Post Related To This Category.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#010b40",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`/usercategory/verify`, {
              category_id: e.removedValue.category_id,
            })
            .then((response) => {
              if (response.data.success) {
                this.setState({
                  saveCategories: options,
                });
              }
            })
            .catch((err) => {
              toast.error(err.response.data.message);
            });
        } else {
          this.setState({
            saveCategories: this.state.saveCategories,
          });
        }
      });
    } else {
      options = options === null ? [] : options;
      if (options.length > this.state.categoryLimit) {
        this.setState({
          saveCategories: options,
        });
        options.pop();
        this.setState({
          saveCategories: options,
          categoryError: `You Have Only ${this.state.categoryLimit} Categories Allowed In This Plan`,
        });
      } else {
        this.setState({
          saveCategories: options === null ? [] : options,
          categoryError: "",
        });
      }
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let category =
      this.state.saveCategories === null
        ? []
        : this.state.saveCategories.map((category) => {
            return {
              category_name: category.label,
              category_id: category.editable
                ? category.category_id
                : category.value,
              image_url: category.image,
              editable: category.editable,
            };
          });
    // console.log({ categories: category, sort: this.state.sort });
    this.setState({ loading: true });
    await axios
      .post(`/usercategory/reserve`, {
        categories: category,
        sort: this.state.sort,
      })
      .then((response) => {
        this.setState({
          loading: false,
          categoryError: "",
          sort: false,
        });
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        this.fetchSaveCategory();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loading: false, categoryError: "" });
      });
  };
  deleteCustomCat = async (id) => {
    Swal.fire({
      title: "Are You Sure?",
      text: "You Won't Be Able To Revert This!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/customcategory/remove/${id}`)
          .then((response) => {
            let categoryResponse = response.data;
            if (categoryResponse.success) {
              // toast.success(categoryResponse.message);
              Swal.fire("Deleted!", categoryResponse.message, "success");
              this.fetchCustomCategory();
            }
          })
          .catch((err) => {
            console.log(err.response, "err");
            toast.error(err.response.data.message);
          });
      }
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      saveCategories: arrayMove(this.state.saveCategories, oldIndex, newIndex),
      sort: true,
    });
  };

  render() {
    let userInfo1 = JSON.parse(localStorage.getItem("userInfo"));
    const SortableItem = SortableElement(({ value }) => (
      <div key={value.value} className="cat-box col-sm-3 col-4">
        <img
          key={value.value}
          src={
            value.image === "" || value.image === undefined
              ? placeholder
              : value.image
          }
          alt="cat-logo"
          className="img-fluid cat-image"
        />
        <div className="cat-lable">{value.label}</div>
        {value.editable ? (
          <div className="action">
            <EditCustomCategory
              userID={userInfo1.user_id}
              fetchMyCategory={this.fetchMyCategory}
              // fetchCustomCategory={this.fetchCustomCategory}
              fetchSaveCategory={this.fetchSaveCategory}
              catData={value}
            />
          </div>
        ) : null}
      </div>
    ));
    const SortableList = SortableContainer(({ items }) => (
      <Row>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${index.toString()}`}
            index={index}
            value={value}
          />
        ))}
      </Row>
    ));
    if (this.props.page === "brand") {
      this.props.getCategory(this.state.brandCategory);
    }
    return (
      <React.Fragment>
        <div className="profile-page account-setup">
          <div className={this.props.page === "brand" ? "" : "container-fluid"}>
            {this.props.page === "brand" ? null : (
              <div
                className={`row ${
                  this.props.type === "marketcategory" ? "" : "mt-4"
                }`}
              >
                <div class="col-md-12">
                  <h4 class="page-title">
                    {this.props.type === "marketcategory"
                      ? "Category"
                      : "Category Setup"}
                  </h4>
                </div>
              </div>
            )}

            <div className="profile_container_main container">
              <div className="row">
                {/* <div className="profile_box_main col-md-4">
                  <div className="dash_block_profile">
                    <div className="dash_content_profile">
                      <h5>Plan Details</h5>
                      <div className="category-box">
                        <div className="category-count-row col-12">
                          <h4 className="category-count-title">
                            Current Plan:
                          </h4>
                          <h3 className="category-count-right">
                            {userInfo1.package
                              ? userInfo1.package.package_name
                              : ""}
                          </h3>
                        </div>
                      </div>

                      <div className="category-box">
                        <div className="category-count-row col-12">
                          <h4 className="category-count-title">
                            Categories Included:{" "}
                          </h4>
                          <h3 className="category-count-right">
                            {userInfo1.package
                              ? this.state.categoryLimit
                              : ""}
                          </h3>
                        </div>
                      </div>

                      {userInfo1.package.package_id !== "Business Plus" ? (
                        <div className="category-box">
                          <div className="category-count-row col-12">
                            <h4 className="category-count-title">
                              Change plan to have more features:
                            </h4>
                          </div>
                          <div className="category-count-row col-12">
                            <Button
                              variant="primary"
                              className="btn-block mr-0"
                              onClick={() => history.push("/app/account/setup")}
                            >
                              Upgrade
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div> */}

                {/* <div className="white-box mt-5">
                  <h5 className="page-title line-heading">Custom Categories</h5>
                  <Row className="mt-4 align-items-center">
                    <Col md={6} xl={2}>
                      <div className="package_name">Custom Categories:</div>
                    </Col>
                    <Col md={5} xl={3} lg={3}>
                      <CustomCategory
                        userID={userInfo1.user_id}
                        fetchMyCategory={this.fetchMyCategory}
                        fetchCustomCategory={this.fetchCustomCategory}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4 align-items-center">
                    <Col md={12} xl={7}>
                      <Row>
                        {this.state.myCustomCategory.length === 0 ? (
                          <span className="ml-4">
                            No Custom Category Selected
                          </span>
                        ) : (
                          // <SortableList
                          //   items={this.state.myCustomCategory}
                          //   onSortEnd={this.onSortEnd}
                          //   axis="x"
                          // />
                          this.state.myCustomCategory.map((cat, i) => (
                            <React.Fragment key={i}>
                              <div key={i} className="cat-box col-sm-3 col-12">
                                <img
                                  key={i}
                                  src={
                                    cat.image === "" || cat.image === undefined
                                      ? placeholder
                                      : cat.image
                                  }
                                  alt="cat-logo"
                                  className="img-fluid cat-image"
                                />
                                <div>{cat.label}</div>
                                <div className="action">
                                  <EditCustomCategory
                                    userID={userInfo1.user_id}
                                    fetchMyCategory={this.fetchMyCategory}
                                    fetchCustomCategory={
                                      this.fetchCustomCategory
                                    }
                                    catData={cat}
                                  />
                                  <button
                                    className="btn btn-link edit-icon"
                                    onClick={() =>
                                      this.deleteCustomCat(cat.value)
                                    }
                                  >
                                    <span
                                      className="fa fa-trash"
                                      title="Delete"
                                    ></span>
                                  </button>
                                </div>
                              </div>
                            </React.Fragment>
                          ))
                        )}
                      </Row>
                    </Col>
                  </Row>
                </div> */}

                <div className="profile_box_main col-md-8">
                  <div className="dash_block_profile">
                    <div className="dash_content_profile">
                      {/* <form onSubmit={this.handleSubmit}> */}
                      <p
                        style={{
                          color: "gray",
                          borderBottom: "1px solid lightgray",
                          paddingBottom: 10,
                        }}
                      >
                        Number Of Categories In {userInfo1.package.package_name}{" "}
                        Plan Is {this.state.categoryLimit}
                      </p>
                      <Row>
                        <Col md={12}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <label>Add Category</label>
                            <p>
                              ({this.state.saveCategories.length}/
                              {this.state.categoryLimit})
                            </p>
                          </div>
                          {/* <label>Add Category</label>
                            <div className="text-right mb-1">
                              ({this.state.saveCategories.length}/
                              {this.state.categoryLimit})
                            </div> */}
                          {/* <label>Select Category: </label> */}
                          {this.state.saveCategories === "" ? null : (
                            <Select
                              isMulti={true}
                              name="category"
                              className="selectCustomization"
                              options={this.state?.myCategory}
                              value={this.state.saveCategories}
                              placeholder="Select Category"
                              onChange={(options, e) =>
                                this.handleSelect(e, options)
                              }
                            />
                          )}
                          <span className="text-danger">
                            {this.state.categoryError}
                          </span>

                          {this.state.saveCategories.length === 0 ? (
                            <Row>
                              <span className="ml-4 mt-2 mb-2">
                                No Category Selected
                              </span>
                            </Row>
                          ) : (
                            <SortableList
                              items={this.state.saveCategories}
                              onSortEnd={this.onSortEnd}
                              axis="xy"
                              lockToContainerEdges={true}
                              lockOffset="0%"
                              distance={1}
                            />
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col md={5} xl={3}>
                          <Button
                            variant="primary"
                            type="submit"
                            className="category-btn btn-block"
                            id="cat-save"
                            disabled={
                              // this.state.saveCategories.length &&
                              !this.state.loading ? false : true
                            }
                            onClick={this.handleSubmit}
                          >
                            Save
                          </Button>
                        </Col>
                      </Row>
                      {/* </form> */}
                    </div>
                  </div>
                </div>

                {userInfo1.package.subscription_type !== "Trial" ? (
                  <div className="profile_box_main col-md-4">
                    <div className="dash_block_profile">
                      <div className="dash_content_profile">
                        <BuySubscription
                          subscribeServices={this.onSubscribe}
                          heading="Buy Additional Categories"
                          name="Category"
                          showInterval={this.state.showInterval}
                          changePlan={(v) => {
                            const planCut = v
                              .slice(0, v.length - 2)
                              .toLocaleLowerCase();
                            const getPrice = this.state.config
                              .filter(
                                (item) => item.product_name === "Category"
                              )
                              .filter(
                                (subItem) => subItem.interval === planCut
                              )[0];
                            this.setState({ priceId: getPrice.price_id });
                            this.setState({ plan: v });
                            this.setState({
                              unitAmount: getPrice.unit_amount / 3,
                            });
                          }}
                          monthly={
                            this.state.config
                              .filter(
                                (item) => item.product_name === "Category"
                              )
                              .filter(
                                (subItem) => subItem.interval === "month"
                              )[0]?.unit_amount / 3
                          }
                          yearly={
                            this.state.config
                              .filter(
                                (item) => item.product_name === "Category"
                              )
                              .filter(
                                (subItem) => subItem.interval === "year"
                              )[0]?.unit_amount / 3
                          }
                          plan={this.state.plan}
                          unitAmount={this.state.unitAmount}
                          usageLimit={this.state.categoryLimit}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile_box_main col-md-4">
                    <div className="dash_block_profile">
                      <div className="dash_content_profile">
                        <p>Buy paid subscription to add more categories</p>
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
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(null, subActions)(MyCategory);
