import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as instaAction from "../../../actions/instaPost";
import * as schedulePostActions from "../../../actions/schedulePost";
import * as categoriesActions from "../../../actions/category";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
//import { Button, Paper } from "@mui/material";
import moment from "moment";
import Loader from "../../../components/Loader/Loader";
import InputValidation from "../../../components/InputValidation";
import NoDataFound from "../../../components/NoDataFound/NoDataFound";
import { Col, Row, Modal } from "react-bootstrap";
import { Label, Input } from "reactstrap";
import Select from "react-select";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function Gallery({
  title,
  getMedia,
  gallery,
  deleteMedia,
  schedulePost,
  getUserCategories2,
  categories,
  directPublish,
}) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [showBio, setShowBio] = useState(false);
  const [showPost, setShowPost] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [fields, setFields] = useState({
    caption: "",
    publish_date: "",
    redirected_url: "",
    start_date: "",
    end_date: "",
    categories: { value: "", label: "Please Select" },
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    getUserCategories2(userInfo.user_id);
    getMedia().then(() => setLoading(false));
  }, []);

  const onDelete = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMedia(item.media_library_id).then(() => {
          getMedia();
          // toast.error("successfully deleted")
        });
      }
    });
  };

  const dateRangePickerChanger = async (value, dataString) => {
    let startDate = dataString[0];
    let endDate = dataString[1];
    setFields({ ...fields, start_date: startDate, end_date: endDate });
    // this.setState({ startDate: startDate });
    // this.setState({ endDate: endDate });
  };

  function renderContent() {
    if (!loading) {
      return (
        <Row className="post-analytics-tab-boxes-ift">
          {gallery.length > 0 ? (
            gallery.map((item, i) => (
              <Col xs={12} xl={3} md={6}>
                <div className={`card any_bx analytic-box campaign-box pb-0`}>
                  <div className="camp-row row">
                    <div className="campaign-header col-12">
                      <h6>
                        {item.title.length > 20
                          ? item.title.slice(0, 20) + "..."
                          : item.title}
                      </h6>
                    </div>
                    <div
                      className="any-post-img-col col-12"
                      style={{ marginBottom: 50 }}
                    >
                      <div className="any-post-image">
                        <div className="any-image-box">
                          <div className="any-image-box-iner">
                            <img
                              src={item.media_url}
                              className="img-fluid media-image"
                              alt={item.media_url}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cam-buttons col-12">
                    {
                      // publishLoading && currentData.media_library_id==item.media_library_id?(
                      //   <button
                      //   className="btn"
                      // >
                      //   <Loader/>
                      // </button>
                      // ):(
                      //   <button
                      //   className="btn"
                      //   onClick={()=>onPublish(item)}
                      // >
                      //   <i className="fa fa-check" /> Publish
                      // </button>
                      // )
                    }
                    {/* <button
                      className="btn"
                      onClick={() => {
                        setCurrentData(item);
                        setModal(true);
                      }}
                    >
                      <i class="fa fa-calendar-check-o" /> Schedule
                    </button> */}
                    <button
                      className="btn"
                      onClick={() => {
                        onDelete(item);
                      }}
                    >
                      <i className="fa fa-trash" /> Delete
                    </button>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div className="col-md-12">
              <NoDataFound />
            </div>
          )}
        </Row>
      );
    } else {
      return (
        <div style={{ height: 300 }}>
          <Loader size={30} />
        </div>
      );
    }
  }

  function renderSchedule() {
    return (
      <div>
        <h5 className="mt-2">Schedule Post</h5>
        <hr style={{ margin: 0, marginBottom: 5, borderTopColor: "gray" }} />
        <Row>
          <Col lg={12}>
            <div className="date-range-aff">
              <label>Date & Time</label>
              <DatePicker
                disabledDate={startDateLimit}
                style={{ width: "100%" }}
                size={"medium"}
                showTime={{ format: "HH:mm A" }}
                format="YYYY-MM-DD HH:mm A"
                onChange={(e) => {
                  setFields({ ...fields, publish_date: e._d });
                }}
              />
              {submit && !fields.publish_date ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  function startDateLimit(current) {
    return current && current < moment().startOf("day");
  }
  function renderBioShop() {
    return (
      <div>
        <h5 className="mt-4">Add to Bioshop</h5>
        <hr style={{ margin: 0, marginBottom: 5, borderTopColor: "gray" }} />
        <Row>
          <Col lg={12}>
            <div>
              <label>URL</label>
              <Input
                className=""
                placeholder="Please Enter Website Address"
                type="text"
                id="website"
                required
                name="website"
                trigger="change"
                validations="isUrl"
                validationError={{
                  isUrl: "This value should be a valid url.",
                }}
                onChange={(e) =>
                  setFields({ ...fields, redirected_url: e.target.value })
                }
              />
              {submit && !fields.redirected_url ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="select-categories">
              <label>Category</label>
              <Select
                key={Date.now()}
                value={fields.categories}
                options={categories.map((item) => {
                  return {
                    value: item.category_id,
                    label: item.category_name,
                  };
                })}
                onChange={(item) => {
                  setFields({ ...fields, categories: item });
                }}
                style={{ width: "100%" }}
                placeholder="Category"
                disabled={true}
              ></Select>
              {submit && !fields.categories.value ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div className="date-range-aff">
              <label>Select Start Date / End Date</label>
              <RangePicker
                key={1}
                // value={[
                //     moment.utc(this.state.startDate),
                //     moment.utc(this.state.endDate),
                // ]}
                defaultPickerValue={moment(new Date(), "YYYY-MM-DD")}
                allowClear={false}
                ranges={{
                  Today: [moment(), moment()],

                  Tomorrow: [moment().add(1, "days"), moment().add(1, "days")],
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
                onChange={dateRangePickerChanger}
              />
              {submit && !fields.start_date && !fields.end_date ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  function onSubmit() {
    setSubmit(true);
    if (showPost) {
      if (showBio) {
        if (
          fields.publish_date &&
          fields.redirected_url &&
          fields.categories.value &&
          fields.start_date &&
          fields.end_date
        ) {
          setLoading(true);
          schedulePost({
            ...fields,
            media_url: currentData.media_url,
            media_library_id: currentData.media_library_id,
            caption: currentData.title,
            is_link_in_bioshop: true,
            categories: [fields.categories.value],
          })
            .then(() => {
              setModal(false);
              setLoading(false);
              toast.success("Successfully Scheduled");
            })
            .catch((err) => {
              setModal(false);
              setLoading(false);
              toast.error(err.response.message);
            });
        }
      } else {
        if (fields.publish_date) {
          setLoading(true);
          schedulePost({
            ...fields,
            media_url: currentData.media_url,
            media_library_id: currentData.media_library_id,
            caption: currentData.title,
            is_link_in_bioshop: false,
          })
            .then(() => {
              setModal(false);
              setLoading(false);
              toast.success("Successfully Scheduled");
            })
            .catch((err) => {
              setModal(false);
              setLoading(false);
              toast.error(err.response.message);
            });
        }
      }
    }
  }

  function onPublish(seletedItem) {
    setCurrentData(seletedItem);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to publish this post on instagram?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPublishLoading(true);
        directPublish({
          media_url: seletedItem.media_url,
          media_library_id: seletedItem.media_library_id,
          media_id: seletedItem.media_id,
          caption: seletedItem.title,
        })
          .then(() => {
            setPublishLoading(false);
            toast.success("Successfully Published");
          })
          .catch((err) => {
            toast.error(err.response.message);
          });
      }
    });
  }
  return (
    <div className="container-fluid">
      <h4 className="page-title">{title}</h4>
      {renderContent()}
      <Modal
        show={modal}
        onHide={() => {
          setSubmit(false);
          setModal(false);
        }}
        className="edit-campaign linkin-bio"
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Schedule Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white affiliate-model image-edit-box p-3">
          <Row>
            <Col lg={4}>
              <div class="form-group">
                <label for="exampleInputEmail1">Caption</label>
                <input
                  value={currentData.title}
                  onChange={(e) =>
                    setCurrentData({ ...currentData, title: e.target.value })
                  }
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter Caption"
                />
                {submit && !currentData.title ? (
                  <small style={{ color: "red" }}>Please Fill</small>
                ) : null}
              </div>
              <img
                style={{
                  width: "100%",
                  height: "75%",
                  objectFit: "cover",
                  borderRadius: "0.4em",
                }}
                src={currentData.media_url}
              />
            </Col>
            <Col lg={8}>
              <Row>
                {/* <Col lg={4} sm={6}>
                                    <div className="checkbox abc-checkbox abc-checkbox-primary">
                                        <Input
                                            name="schedule_post"
                                            value="Monthly"
                                            checked={showPost}
                                            className="mt-0"
                                            id="checkbox1"
                                            type="checkbox"
                                            onChange={(e) => {
                                                setShowPost(e.target.checked)
                                            }}
                                        />{" "}
                                        <Label for="checkbox1" />
                                        Schedule Post
                                    </div>
                                </Col> */}
                <Col lg={4} sm={6}>
                  <div className="checkbox abc-checkbox abc-checkbox-primary">
                    <Input
                      name="bioshop"
                      value="bioshop"
                      checked={showBio}
                      className="mt-0"
                      id="checkbox2"
                      type="checkbox"
                      onChange={(e) => {
                        setShowBio(e.target.checked);
                      }}
                    />{" "}
                    <Label for="checkbox2" />
                    Add to Bioshop
                  </div>
                </Col>
              </Row>
              <div>
                {showPost ? renderSchedule() : null}
                {showBio ? renderBioShop() : null}
                <Row>
                  <Col>
                    {loading ? (
                      <button className="custom_btns_ift btn btn-primary mt-3">
                        <Loader />
                      </button>
                    ) : (
                      <button
                        onClick={() => onSubmit()}
                        className="custom_btns_ift btn btn-primary mt-3"
                      >
                        Schedule
                      </button>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function mapStateProps({ gallery, categories }) {
  return { gallery, categories };
}
export default connect(mapStateProps, {
  ...instaAction,
  ...schedulePostActions,
  ...categoriesActions,
})(Gallery);

// wajidkafridi92@gmail.com Fascom.321
