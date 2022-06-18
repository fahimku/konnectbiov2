import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import * as marketplaceBrandActions from "../../../actions/MarketplaceBrands";
import { connect } from "react-redux";

function BrandComponent({
  title,
  // brandTab,
  // getMarketplaceApproval,
  marketplaceApproval,
}) {
  const [myBrand, setMyBrand] = useState("");
  const [brandLoading, setBrandLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [brandError, setBrandError] = useState(false);
  const [brandStatus, setBrandStatus] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    getMyBrand();
    getBrandList();
    // getMarketplaceApproval();
  }, []);

  const getMyBrand = async () => {
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
        setMyBrand(selectBrands);
        // setSelectedBrands(selectBrands);
        // setBrands(selectBrands);
        setBrandLoading(false);
        // setBrandLoading(false, () => {
        // brandTab(myBrands, brandLoading);
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBrandList = async () => {
    await axios
      .post("users/marketPlace/brands")
      .then((response) => {
        const loadBrand = [];
        const brands = response.data.message;
        brands.map(({ brand_id, brand_name, status }) => {
          return loadBrand.push({
            value: brand_id,
            label: brand_name,
            status: status,
          });
        });
        let allBrand = loadBrand.filter((item) => item.status === "");
        setBrandList(allBrand);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleMultiSelect = (e, options) => {
    setSelectedBrands(options);
    setBrandError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedBrands !== "") {
      setSaveLoading(true);
      await axios
        .post(`users/marketPlace/requestbrand`, {
          brand_id: selectedBrands.value,
        })
        .then((response) => {
          setSaveLoading(false);
          setSelectedBrands("");
          getBrandList();
          // getMarketplaceApproval();
          // toast.success(response.data.message);
          toast.success("Request has been send Successfully");
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setSaveLoading(false);
          setSelectedBrands("");
        });
    } else {
      setBrandError(true);
    }
  };

  function dataTable() {
    let data = marketplaceApproval?.message;
    if (data) {
      return (
        <>
          <Table responsive="sm" className="approval-box">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item?.brand_name}</td>

                    <td>
                      {item?.status === "Pending" ? (
                        <span class="badge badge-info">Pending</span>
                      ) : (
                        ""
                      )}
                      {item?.status === "Approved" ? (
                        <span class="badge badge-success">Approved</span>
                      ) : (
                        ""
                      )}
                      {item?.status === "Rejected" ? (
                        <span class="badge badge-danger">Disapproved</span>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">{title}</h4>

        <div className="brand_container_main container">
          <Row>
            <div className="profile_box_main col-md-8">
              <div className={"brand-section dash_block_profile"}>
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
                      {brandLoading ? (
                        <Loader />
                      ) : (
                        <React.Fragment>
                          <Select
                            // defaultValue={myBrand.filter(function (element) {
                            //   return element.label !== undefined;
                            // })}
                            value={selectedBrands}
                            // isMulti
                            name="brands"
                            options={brandList.filter(function (element) {
                              return element.label !== undefined;
                            })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Brand"
                            onChange={(options, e) =>
                              handleMultiSelect(e, options)
                            }
                          />

                          {brandError ? (
                            <span className="text-danger mt-2">
                              Please select brands.
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
                        disabled={!saveLoading ? false : true}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
              {/* {marketplaceApproval?.message?.length > 0 ? (
                <>
                  <h4 className="page-title">Brand Request</h4>
                  <div
                    className={"brand-section dash_block_profile brand_table"}
                  >
                    {dataTable()}
                  </div>
                </>
              ) : null} */}
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}
function mapStateToProps({ marketplaceApproval }) {
  return {
    marketplaceApproval,
  };
}
export default connect(mapStateToProps, { ...marketplaceBrandActions })(
  BrandComponent
);
