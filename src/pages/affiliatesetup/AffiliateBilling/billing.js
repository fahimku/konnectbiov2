import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Loader from "../../../components/Loader/Loader";
import * as Yup from "yup";
import * as affiliateBillingActions from "../../../actions/affiliateBilling";
import { connect } from "react-redux";

function AffiliateBilling({
  getAffiliateBillingDetail,
  affiliateBillingDetail,
}) {
  const [saveloading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAffiliateBillingDetail().then(() => {
      setLoading(true);
    });
  }, []);

  const onSubmitting = async (values, actions) => {
    setSaveLoading(true);
    await axios
      .post(`/affiliate/setbilling`, values)
      .then((response) => {
        setSaveLoading(false);
        let res = response.data;
        toast.success("Billing Information Added!");
        getAffiliateBillingDetail();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setSaveLoading(false);
        actions.setSubmitting(false);
        actions.resetForm();
      });
  };

  const Schema = Yup.object().shape({
    legal_entity: Yup.string().required("This field is required"),
    address: Yup.string().required("This field is required"),
    contact_person: Yup.string().required("This field is required"),
  });

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Billing</h4>
        <div className="brand_container_main container">
          <Row>
            <div className="profile_box_main col-md-8">
              <div className="brand-section dash_block_profile">
                <div className="dash_content_profile">
                  {affiliateBillingDetail.success ? (
                    <Formik
                      initialValues={{
                        legal_entity:
                          affiliateBillingDetail?.message?.legal_entity,
                        address: affiliateBillingDetail?.message?.address,
                        contact_person:
                          affiliateBillingDetail?.message?.contact_person,
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
                        // handleBlur,
                      }) => {
                        return (
                          <form onSubmit={handleSubmit}>
                            <div className="">
                              <h5>Enter Billing Information</h5>
                              <div className="dp_fields mb-0">
                                <div className="mb-3">
                                  <label>Enter Legal Entity</label>
                                  <input
                                    type="text"
                                    name="legal_entity"
                                    placeholder="Enter Legal Entity"
                                    // onInput={handleChange}
                                    className="form-control comment-field"
                                    // onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.legal_entity}
                                    autoComplete="off"
                                  />
                                  <span className="text-danger">
                                    {errors.legal_entity}
                                  </span>
                                </div>
                                <div className="mb-3">
                                  <label>Enter Address</label>
                                  <input
                                    type="text"
                                    name="address"
                                    // onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.address}
                                    placeholder="Enter Address"
                                    className="form-control comment-field"
                                    autoComplete="off"
                                  />
                                  <span className="text-danger">
                                    {errors.address}
                                  </span>
                                </div>
                                <div className="mb-0">
                                  <label>Enter Contact Person</label>
                                  <input
                                    type="text"
                                    name="contact_person"
                                    // onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.contact_person}
                                    placeholder="Enter Contact Person"
                                    className="form-control comment-field"
                                    autoComplete="off"
                                  />
                                  <span className="text-danger">
                                    {errors.contact_person}
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
                            </div>
                          </form>
                        );
                      }}
                    </Formik>
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}
// export default AffiliateBilling;

function mapStateToProps({ affiliateBillingDetail }) {
  return { affiliateBillingDetail };
}
export default connect(mapStateToProps, { ...affiliateBillingActions })(
  AffiliateBilling
);
