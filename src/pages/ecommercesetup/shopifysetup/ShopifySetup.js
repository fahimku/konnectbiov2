import React, { useState, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
// import Swal from "sweetalert2";
import { connect } from "react-redux";
import * as shopifyActions from "../../../actions/shopifySetup";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";

function ShopifySetup({ getShopifyDetail, shopifyDetail }) {
  const [saveloading, setSaveLoading] = useState(false);
  // const [data, setData] = useState("");
  // const [ShopifyLoading, setShopifyLoading] = useState(true);
  const [type, setType] = useState("password");
  const [syncLoading, setSyncLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getShopifyDetail().then((res)=>{
      setLoader(true);
    }).catch((err)=>{
      setLoader(true);
    })
  }, []);
  
  const onSubmitting = async (values, actions) => {
    setSaveLoading(true);
    await axios
      .post(`/users/revise/shopify`, values)
      .then((response) => {
        setSaveLoading(false);
        let res = response.data;
        console.log(res,"res");
        toast.success("Shopify Credential Added!");
        getShopifyDetail();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setSaveLoading(false);
        actions.setSubmitting(false);
        actions.resetForm();
      });
  };
  const Schema = Yup.object().shape({
    shopName: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Please enter correct shop url"
      )
      .required("Please enter shop url"),
    apiKey: Yup.string().required("This field is required"),
    password: Yup.string().required("This field is required"),
  });
  const showHide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setType(type === "input" ? "password" : "input");
  };

  const syncData = () => {
    Swal.fire({
      title: `Are You Sure You Want To Sync Products?`,
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setSyncLoading(true);
        axios
          .get(`/campaigns/receive/getproducts`)
          .then(() => {
            setSyncLoading(false);
            toast.success("Product Sync Successfully");
          })
          .catch((err) => {
            setSyncLoading(false);
            // toast.error(err.response.data.message);
            console.log(err.response, "err");
          });
      }
    });
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Shopify Setup</h4>
        <div className="brand_container_main container">
          <Row>
            <div className="profile_box_main col-md-8">
              <div className="brand-section dash_block_profile">
                <div className="dash_content_profile">
                  {shopifyDetail?.message?.shopify  && (
                    <Row className="shopify_heading">
                      <div className="col-md-8 col-7">
                        <h5>Enter Shopify Detail</h5>
                      </div>
                      <div className="col-md-4 col-5">
                        {shopifyDetail?.message?.shopify  ? (
                          <>
                           {shopifyDetail.connection  ? (
                            <span class="connection-status-badge-green connection">
                              Connected
                            </span>
                           )
                           : (
                            <span class="connection-status-badge-red connection">
                            Not Connected
                          </span>
                           )}
                           {shopifyDetail?.connection  &&(
                            <button
                              className="btn btn-primary btn-sm ecommerce-sync"
                              onClick={() => syncData()}
                              title="Sync Shopify"
                            >
                              <i className="fa fa-refresh"></i>
                              Sync
                            </button>
                            )}
                            {/* <span
                              className="fa fa-refresh ecommerce-sync"
                              onClick={() => syncData()}
                              title="Sync"
                            ></span> */}
                            {syncLoading && (
                              <div class="sync_loading">
                                <span className="loading_text">Loading</span>
                                &#8230;
                              </div>
                            )}
                          </>
                        ) : (
                          <span class="connection-status-badge-red connection">
                            Not Connected
                          </span>
                        )}
                      </div>
                    </Row>
                  )}

                  {loader ?
                    <Formik
                      initialValues={{
                        shopName: shopifyDetail?.message?.shopify?.shop_name
                          ? shopifyDetail?.message?.shopify?.shop_name
                          : "",
                        apiKey: shopifyDetail?.message?.shopify?.api_key
                          ? shopifyDetail?.message?.shopify?.api_key
                          : "",
                        password: shopifyDetail?.message?.shopify?.password
                          ? shopifyDetail?.message?.shopify?.password
                          : "",
                      }}
                      validationSchema={Schema}
                      onSubmit={(values, actions) => {
                        onSubmitting(values, actions);
                      }}
                    >
                      {({
                        values,
                        errors,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                      }) => {
                        return (
                          <form onSubmit={handleSubmit}>
                            <div className="dp_fields mb-0">
                              <div className="mb-3">
                                <label>Enter Shop Url</label>
                                <input
                                  type="text"
                                  name="shopName"
                                  placeholder="Enter Shop Url"
                                  onInput={handleChange}
                                  className="form-control comment-field"
                                  // onBlur={handleBlur}
                                  // onChange={handleChange}
                                  value={values.shopName}
                                  autoComplete="off"
                                />
                                <span className="text-danger">
                                  {errors.shopName}
                                </span>
                              </div>
                              <div className="mb-3">
                                <label>Enter API Key</label>
                                <input
                                  type="text"
                                  name="apiKey"
                                  onInput={handleChange}
                                  // onBlur={handleBlur}
                                  // onChange={handleChange}
                                  value={values.apiKey}
                                  placeholder="Enter API Key"
                                  className="form-control comment-field"
                                  autoComplete="off"
                                />
                                <span className="text-danger">
                                  {errors.apiKey}
                                </span>
                              </div>
                              <div className="mb-0 password-box password-api">
                                <label>Enter Admin API Access Token</label>
                                <input
                                  type={type}
                                  name="password"
                                  onInput={handleChange}
                                  // onBlur={handleBlur}
                                  // onChange={handleChange}
                                  value={values.password}
                                  placeholder="Enter Admin API Access Token"
                                  className="form-control comment-field"
                                  autoComplete="new-password"
                                />
                                <span
                                  className="password_show"
                                  onClick={showHide}
                                >
                                  {type === "input" ? (
                                    <span class="glyphicon glyphicon-eye-open"></span>
                                  ) : (
                                    <span class="glyphicon glyphicon-eye-close"></span>
                                  )}
                                </span>
                                <span className="text-danger">
                                  {errors.password}
                                </span>
                              </div>
                              <div className="pr-sv-btn mt-3">
                                {saveloading ? (
                                  <Button type="submit" color="default">
                                    <Loader />
                                  </Button>
                                ) : (
                                  <Button type="submit" color="default">
                                    Save
                                  </Button>
                                )}
                              </div>
                            </div>
                          </form>
                        );
                      }}
                    </Formik>
                   : 
                    <Loader />
                  }
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}
function mapStateToProps({ shopifyDetail }) {
  return { shopifyDetail };
}
// export default ShopifySetup;
export default connect(mapStateToProps, { ...shopifyActions })(ShopifySetup);
