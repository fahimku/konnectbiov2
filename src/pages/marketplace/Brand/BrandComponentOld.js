import React from "react";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
//import AsyncSelectField from "./AsyncSelectField";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
// import MyCategory from "../../mycategory/MyCategory";

class BrandComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      type: this.props.type,
      selectedBrands: [],
      brand: [],
      brandList: [],
      loading: false,
      brandLoading: true,
      myBrand: [],
      brandCategory: [],
    };
  }

  componentDidMount() {
    this.fetchMyBrand();
    this.brandList();
  }

  brandList = async () => {
    await axios
      .post("users/marketPlace/brands")
      .then((response) => {
        const loadBrand = [];
        const brands = response.data.message;
        brands.map(({ brand_id, brand_name }) => {
          return loadBrand.push({
            value: brand_id,
            label: brand_name,
          });
        });
        this.setState({ brandList: loadBrand });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleMultiSelect = (e, options) => {
    this.setState({
      selectedBrands: options,
      brands: options,
    });
  };

  fetchMyBrand = async () => {
    await axios
      .post("/users/marketPlace/getUserBrands")
      .then((response) => {
        const selectBrands = [];
        const myBrands = response.data.data;
        myBrands.map(({ brand_id, brand_name }) => {
          return selectBrands.push({
            value: brand_id,
            label: brand_name,
          });
        });
        this.setState({ myBrand: selectBrands, brands: selectBrands });
        this.setState({ selectedBrands: selectBrands });
        this.setState({ brandLoading: false }, () => {
          this.props.brandTab(this.state.myBrand, this.state.brandLoading);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let brand = this.state.selectedBrands.map((brand) => {
      return brand.value;
    });

    this.setState({ loading: true });
    await axios
      .post(`/users/marketPlace/updateUserBrands`, {
        user_brands: brand,
      })
      .then((response) => {
        this.setState({
          loading: false,
        });
        this.fetchMyBrand();
        toast.success(response.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loading: false });
      });
  };
  getCategory = (category) => {
    this.setState({ brandCategory: category });
  };

  dataTable() {
    let data = marketplaceTransactions?.message?.data;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="transactions-box">
            <thead>
              <tr>
                <th>Brand</th>

                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* {data.map((item, i) => {
                return ( */}
              <tr>
                <td>Dl1961</td>
                <td>Alzaki</td>
              </tr>
              {/* );
              })} */}
            </tbody>
          </Table>
        </>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <h4 className="page-title">{this.state.title}</h4>

          {/* <div className="brand_container_main container">
            <Row>
              <div className="profile_box_main col-md-8">
                <div
                  
                  className={"brand-section dash_block_profile"}
                >
                  <div className="dash_content_profile">
                    <p
                      style={{
                        color: "gray",
                        borderBottom: "1px solid lightgray",
                        paddingBottom: 10,
                      }}
                    >
                      Select Brands
                    </p>
                   

                    <Row>
                      <Col md={12}>
                        {this.state.brandLoading ? (
                          <Loader />
                        ) : (
                          <React.Fragment>
                            <Select
                              defaultValue={this.state.myBrand.filter(function (
                                element
                              ) {
                                return element.label !== undefined;
                              })}
                              isMulti
                              name="brands"
                              options={this.state.brandList.filter(function (
                                element
                              ) {
                                return element.label !== undefined;
                              })}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              placeholder="Select Brand"
                              onChange={(options, e) =>
                                this.handleMultiSelect(e, options)
                              }
                            />
                            
                            {this.state.brands.length === 0 ? (
                              <span className="text-danger mt-2">
                                Please select brands to unlock marketplace.
                              </span>
                            ) : null}
                          </React.Fragment>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md={5} xl={3}>
                        <Button
                          variant="primary"
                          type="submit"
                          className="btn-block mt-3"
                          id="brand-save"
                          disabled={!this.state.loading ? false : true}
                          onClick={this.handleSubmit}
                        >
                          Save
                        </Button>
                      </Col>
                    </Row>
                    
                  </div>
                </div>
              </div>
            </Row>
          </div> */}
          {dataTable()}
        </div>
      </React.Fragment>
    );
  }
}
export default BrandComponent;
