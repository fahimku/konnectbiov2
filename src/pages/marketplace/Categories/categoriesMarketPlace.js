import React from "react";
import axios from "axios";
import placeholder from "../../../../src/images/placeholder.svg";
import * as subActions from "../../../actions/subscribe";
import { connect } from "react-redux";
import ModalCategories from "./modalCategories";
import Loader from "../../../components/Loader/Loader";
import { Row, Col } from "react-bootstrap";
// import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandData: "",
      modalComp: true,
      saveCategories: "",
      brandCategory: "",
      categoryError: "",
      catLoading: true,
    };
  }

  componentDidMount() {
    this.fetchSaveCategory();
  }

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
  brand = (value) => {
    this.setState({ brandData: value });
    this.setState({ modalComp: false });
  };
  changeFlag = () => {
    this.setState({
      modalComp: true,
    });
  };

  render() {
    if (this.props.page === "brand") {
      this.props.getCategory(this.state.brandCategory);
    }
    return (
      <React.Fragment>
        <div className="profile-page account-setup">
          <div className={this.props.page === "brand" ? "" : "container-fluid"}>
            {this.props.page === "brand" ? null : (
              <div className="row">
                <div class="col-md-12">
                  <h4 class="page-title">
                    {this.state.modalComp ? "Brands" : "Brands"}
                  </h4>
                </div>
              </div>
            )}

            <div className="profile_container_main container">
              <div className="row">
                <div className="profile_box_main col-md-8">
                  <div className="dash_block_profile">
                    <div className="dash_content_profile">
                      {this.state.modalComp ? (
                        <>
                          <span className="cat_heading">Brand Categories</span>
                        </>
                      ) : (
                        <>
                          <span className="cat_heading">
                            <i
                              class="fa fa-arrow-left brand-back"
                              onClick={() => this.changeFlag()}
                            ></i>{" "}
                            <span className="ml-3">
                              {this.state.brandData.label}
                            </span>
                          </span>
                        </>
                      )}

                      <Row>
                        <Col md={12}>
                          {this.state.categoryError && (
                            <span className="text-danger">
                              {this.state.categoryError}
                            </span>
                          )}
                          {!this.state.modalComp ? (
                            <ModalCategories catData={this.state.brandData} />
                          ) : (
                            <>
                              {this.state.catLoading ? (
                                <Loader size="30" />
                              ) : (
                                <Row>
                                  {this.state.saveCategories.length === 0 ? (
                                    <div className="col-md-12 no-data-cat">
                                      <p className="text-muted">
                                        No Category Added
                                      </p>
                                      <button
                                        class="btn btn-primary"
                                        onClick={() =>
                                          history.push(
                                            "/app/account/categories"
                                          )
                                        }
                                      >
                                        Add Category
                                      </button>
                                    </div>
                                  ) : (
                                    this.state.saveCategories.map((value) => (
                                      <div
                                        key={value.value}
                                        className="brand-box col-sm-3 col-4"
                                      >
                                        <img
                                          key={value.value}
                                          src={
                                            value.image === "" ||
                                            value.image === undefined
                                              ? placeholder
                                              : value.image
                                          }
                                          alt="cat-logo"
                                          className="img-fluid brand-cat"
                                          onClick={() => this.brand(value)}
                                        />
                                        <div className="cat-lable">
                                          {value.label}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </Row>
                              )}
                            </>
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default connect(null, subActions)(Categories);
