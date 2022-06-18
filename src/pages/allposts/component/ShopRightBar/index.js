import React, { useEffect, useState, useRef } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Video from "../../../../components/Video";
import moment from "moment";
import { Select } from "antd";
import Loader from "../../../../components/Loader";
import InputValidation from "../../../../components/InputValidation";
import Formsy from "formsy-react";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import PermissionHelper from "../../../../components/PermissionHelper";
import axios from "axios";
import { connect } from "react-redux";
import * as postAct from "../../../../actions/bioshop";
import { toast } from "react-toastify";
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

const ShopRightBar = (props) => {
  const [redirectedUrl, setRedirectedUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [postType, setPostType] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef("LinkForm");
  const [showIframe, setShowIframe] = useState(true);

  //Delete Modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    setPostId(props.singleBioShop.post_id);
    setStartDate(props.singleBioShop.start_date);
    setEndDate(props.singleBioShop.end_date);
    setPostType(props.singleBioShop.post_type);
    if (props.singleBioShop.categories) {
      setCategory(props.singleBioShop.categories[0].category_id);
      setShowIframe(false);
    } else {
      setShowIframe(true);
    }
    setRedirectedUrl(props.singleBioShop.redirected_url);
  }, [props.singleBioShop]);

  async function updatePost(id) {
    setLoading(true);
    await axios
      .put(`/posts/revise/${id}`, {
        redirected_url: redirectedUrl,
        categories: category,
        sub_categories: [],
        post_type: postType,
        start_date: startDate,
        end_date: endDate,
      })
      .then(() => {
        toast.success("BioShop Updated Successfully");
        setLoading(false);
        props.showIframe(true);
        setShowIframe(true);
      });
  }

  async function deletePost(id) {
    props.deleteSingleBioShop(id).then(() => {
      toast.success("Post Delete Successfully");
      setDeleteModal(false);
      props.showIframe(true);
      setShowIframe(true);
    });
  }

  async function testUrl(url) {
    let newUrl;
    if (url.includes("http://")) {
      newUrl = url;
    } else if (url.includes("https://")) {
      newUrl = url;
    } else {
      newUrl = "https://" + url;
    }
    window.open(newUrl, "_blank");
  }

  function dateRangePickerChanger(value, dataString) {
    setStartDate(dataString[0]);
    setEndDate(dataString[1]);
  }

  return (
    <>
      <Formsy.Form
        onValidSubmit={() => {
          updatePost(props.singleBioShop.post_id);
        }}
        ref={formRef}
      >
        <div className={`image-edit-box ${showIframe ? "hidden" : "show"}`}>
          <span
            onClick={() => {
              props.showIframe(true);
              setShowIframe(true);
            }}
            className="fa fa-times ift-cancel"
          ></span>
          <div className="ind-post-anlytics image-box-info">
            <div className="edit-left">
              <h4>Edit Post</h4>
              <p>
                Updated on
                {moment.utc(props.updatedDate).format("MMM Do YYYY")}
              </p>
            </div>
            <div className="edit-right">
              <div className="an-col col-md-3">
                <div className="an-col-inr">
                  <div className="an-content clearfix">
                    <span className="dash_icon-top">
                      <i className="fa fa-eye fa-2x" aria-hidden="true"></i>
                    </span>
                    <div className="imp-t text-right">
                      {props.singleBioShop.post_views}
                    </div>
                    <div className="imp-tx text-uppercase text-muted text-right">
                      IMPRESSIONS
                    </div>
                  </div>
                </div>
              </div>
              <div className="an-col col-md-3">
                <div className="an-col-inr">
                  <div className="an-content clearfix">
                    <span className="dash_icon-top">
                      <i
                        className="fa fa-hand-pointer-o fa-2x"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <div className="imp-t text-right">
                      {props.singleBioShop.post_clicks}
                    </div>
                    <div className="imp-tx text-uppercase text-muted text-right">
                      CLICKS
                    </div>
                  </div>
                </div>
              </div>
              <div className="an-col col-md-3">
                <div className="an-col-inr">
                  <div className="an-content clearfix">
                    <span className="dash_icon-top">
                      <i
                        className="fa fa-handshake-o fa-2x"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <div className="imp-t text-right">
                      {props.singleBioShop.ctr}%
                    </div>
                    <div className="imp-tx text-uppercase text-muted text-right">
                      ENGAGEMENT
                    </div>
                  </div>
                </div>
              </div>
              <div className="an-col col-md-3">
                <div className="an-col-inr">
                  <div className="an-content clearfix">
                    <span className="dash_icon-top">
                      <i className="fa fa-usd fa-2x" aria-hidden="true"></i>
                    </span>
                    <div className="imp-t text-right">$0.00</div>
                    <div className="imp-tx text-uppercase text-muted text-right">
                      REVENUE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="image-wrapper">
            <div className="image-box">
              {props.singleBioShop.media_type !== "VIDEO" && (
                <img src={`${props.singleBioShop.media_url}`} alt="media_url" />
              )}
              {props.singleBioShop.media_type === "VIDEO" && (
                <Video src={props.singleBioShop.media_url} />
              )}
            </div>
            <div className="image-edit-links">
              <label>URL</label>
              <InputValidation
                className=""
                placeholder="Please Enter Website Address"
                type="text"
                id="website"
                required
                name="website"
                trigger="change"
                validations={{
                  matchRegexp:
                    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
                }}
                validationError={{
                  isUrl: "This value should be a valid url.",
                }}
                value={redirectedUrl}
                onChange={(evt) => {
                  setRedirectedUrl(evt.target.value);
                }}
              />

              <div className="select-categories mt-3">
                <label>Select Category</label>
                <Select
                  key={Date.now()}
                  value={category}
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select Category"
                  optionFilterProp="children"
                  clearable={false}
                  searchable={false}
                  required
                  onChange={(e) => {
                    setCategory(e);
                  }}
                  // onFocus={onFocus}
                  // onBlur={onBlur}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={PermissionHelper.categoryCheck() ? true : false}
                >
                  {props.categories.map(({ value, label }, i) => (
                    <Option value={value}>{label}</Option>
                  ))}
                </Select>
              </div>

              <div className="date-range mt-3">
                <label>BioShop</label>
                <RangePicker
                  key={1}
                  defaultValue={[moment(startDate), moment(endDate)]}
                  value={[moment(startDate), moment(endDate)]}
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
                  format={dateFormat}
                  onChange={dateRangePickerChanger}
                />
              </div>
              <div className="edit_button_main pane-button">
                <>
                  {loading ? (
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
                        onClick={() => testUrl(redirectedUrl)}
                      >
                        &nbsp;Test&nbsp;
                      </Button>

                      <Button
                        className="custom_btns_ift"
                        color="primary"
                        onClick={() => {
                          props.showIframe(true);
                          setShowIframe(true);
                          props.showEditModal(false);
                        }}
                      >
                        &nbsp;Cancel&nbsp;
                      </Button>

                      <Button
                        className="custom_btns_ift"
                        color="primary"
                        onClick={() => setDeleteModal(true)}
                      >
                        &nbsp;Remove&nbsp;
                      </Button>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={deleteModal}>
          <ModalHeader toggle={() => setDeleteModal(false)}>
            Delete Post
          </ModalHeader>
          <ModalBody className="bg-white">
            Are You Sure You Want To Delete?
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="btn btn-primary"
              onClick={() => setDeleteModal(false)}
            >
              Close
            </Button>
            <Button color="primary" onClick={() => deletePost(postId)}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </Formsy.Form>
    </>
  );
};
function mapStateToProps({ singleBioShop }) {
  return { singleBioShop };
}
export default connect(mapStateToProps, postAct)(ShopRightBar);
