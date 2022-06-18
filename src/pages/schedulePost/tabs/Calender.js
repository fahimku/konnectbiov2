import React from "react";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";

import moment from "moment/moment";
import * as categoriesActions from "../../../actions/category";
import * as schedulePostActions from "../../../actions/schedulePost";
import s from "./Calendar.module.scss";
import Widget from "../../../components/Widget";
import Loader from "../../../components/Loader/Loader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Swal from "sweetalert2";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import Select from "react-select";
import { DatePicker } from "antd";
import { connect } from "react-redux";

const { RangePicker } = DatePicker;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    this.state = {
      event: {},
      modal: false,
      modalEvent: false,
      calendarView: "dayGridMonth",
      loading: false,
      deleteLoading: false,
      submit: false,
      showBio: true,
      showPost: true,
      currentData: {},
      caption: "",
      publish_date: "",
      redirected_url: "",
      start_date: "",
      end_date: "",
      currentMonth: moment().format("MMM YYYY"),
      currentDay: moment().format("dddd"),
      categories: { value: "", label: "Please Select" },
      calendarOptions: {
        headerToolbar: {
          left: "",
          center: "title",
          right: "",
        },
        // events: this.props.data,
        selectable: true,
        selectHelper: true,
        editable: true,
        droppable: true,
      },
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        listPlugin,
      ],
      dragOptions: { zIndex: 999, revert: true, revertDuration: 0 },
    };
  }

  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.props.getUserCategories2(userInfo.user_id);
    // new Draggable(this.externalEvents, {
    //   itemSelector: ".external-event",
    // });
  }

  drop = (info) => {
    info.draggedEl.parentNode.removeChild(info.draggedEl);
  };

  // handleChange = (e) => {
  //   this.setState({ event: { ...this.state.event, title: e.target.value } });
  // };
  // createEvent = () => {
  //   this.fullCalendar.getApi().addEvent(this.state.event);
  //   this.fullCalendar.getApi().unselect();
  //   this.toggleModal();
  // };

  eventClick = (e) => {
    console.log(e.event._def);
    this.setState({
      event: e.event,
      currentData: e.event._def,
      showBio: e.event._def?.extendedProps?.is_link_in_bioshop,
      redirected_url: e.event._def?.extendedProps?.redirected_url,
      categories: this.props.categories
        .filter(
          (item) =>
            item.category_id == e.event._def?.extendedProps?.categories[0]
        )
        .map((item) => ({
          value: item.category_id,
          label: item.category_name,
        }))[0],
      start_date: e.event._def?.extendedProps?.start_date,
      end_date: e.event._def?.extendedProps?.end_date,
      publish_date: e.event._def?.extendedProps?.publish_date,
      caption: e.event._def?.title,
      media_id: e.event._def?.extendedProps?.media_id,
      media_library_id: e.event._def?.extendedProps?.media_library_id,
      addNew: e.event._def?.extendedProps?.is_link_in_bioshop,
    });
    this.toggleModalEvent();
  };
  prev = () => {
    this.fullCalendar.getApi().prev();
  };
  next = () => {
    this.fullCalendar.getApi().next();
  };
  today = () => {
    this.fullCalendar.getApi().today();
  };
  changeView = (view) => {
    this.setState({ calendarView: view });
    this.fullCalendar.getApi().changeView(view);
  };
  getFormattedDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };
  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };
  toggleModalEvent = () => {
    this.setState({ modalEvent: !this.state.modalEvent });
  };

  dateRangePickerChanger = async (value, dataString) => {
    let startDate = dataString[0];
    let endDate = dataString[1];
    this.setState({ start_date: startDate });
    this.setState({ end_date: endDate });
  };

  startDateLimit(current) {
    return current && current < moment().startOf("day");
  }
  renderSchedule() {
    return (
      <div>
        <h5 className="mt-2">Schedule Post</h5>
        <Row>
          <Col lg={12}>
            <div className="date-range-aff">
              <label>Date & Time</label>
              <DatePicker
                disabledDate={this.startDateLimit}
                value={moment(new Date(this.state.publish_date), "YYYY-MM-DD")}
                style={{ width: "100%" }}
                size={"medium"}
                // showTime
                showTime={{ format: "HH:mm A" }}
                format="YYYY-MM-DD HH:mm A"
                onChange={(e) => {
                  this.setState({ publish_date: e._d });
                }}
              />
              {this.state.submit && !this.state.publish_date ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderBioShop = () => {
    return (
      <div>
        <h5 className="mt-4">Add to Bioshop</h5>
        <Row>
          <Col lg={12} className="mb-2">
            <div>
              <label>URL</label>
              <Input
                className=""
                value={this.state.redirected_url}
                placeholder="Please Enter Website Address"
                type="text"
                id="website"
                required
                name="website"
                trigger="change"
                onChange={(e) =>
                  this.setState({ redirected_url: e.target.value })
                }
                validations="isUrl"
                validationError={{
                  isUrl: "This value should be a valid url.",
                }}
              />
              {this.state.submit && !this.state.redirected_url ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="mb-2">
            <div className="select-categories">
              <label>Category</label>
              <Select
                key={Date.now()}
                value={this.state.categories}
                options={this.props.categories.map((item) => {
                  return {
                    value: item.category_id,
                    label: item.category_name,
                  };
                })}
                onChange={(item) => {
                  this.setState({ categories: item });
                }}
                style={{ width: "100%" }}
                placeholder="Category"
                disabled={true}
              ></Select>
              {this.state.submit && !this.state.categories?.value ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12} className="mb-2">
            <div className="date-range-aff">
              <label>Select Start Date / End Date</label>
              <RangePicker
                key={1}
                // value={[
                //     moment.utc(this.state.startDate),
                //     moment.utc(this.state.endDate),
                // ]}
                defaultPickerValue={[moment(new Date(), "YYYY-MM-DD")]}
                allowClear={false}
                value={
                  this.state.addNew
                    ? [
                        moment(new Date(this.state.start_date), "YYYY-MM-DD"),
                        moment(new Date(this.state.end_date), "YYYY-MM-DD"),
                      ]
                    : undefined
                }
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
                onChange={this.dateRangePickerChanger}
              />
              {this.state.submit &&
              !this.state.start_date &&
              !this.state.end_date ? (
                <small style={{ color: "red" }}>Please Fill</small>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  onSubmit() {
    this.setState({ submit: true });
    if (this.state.showPost) {
      if (this.state.showPost) {
        if (this.state.showBio) {
          if (
            this.state.publish_date &&
            this.state.redirected_url &&
            this.state.categories.value &&
            this.state.start_date &&
            this.state.end_date
          ) {
            this.setState({ loading: true });
            this.props
              .updateSchedulePost({
                caption: this.state.currentData?.title,
                publish_date: this.state.publish_date,
                redirected_url: this.state.redirected_url,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                categories: [this.state.categories.value],
                media_library_id: this.state.media_library_id,
                media_id: this.state.media_id,
                is_link_in_bioshop: true,
              })
              .then(() => {
                this.props.reload();
                this.setState({
                  modalEvent: false,
                  loading: false,
                });
                toast.success("Successfully Scheduled");
              })
              .catch((err) => {
                this.setState({
                  modalEvent: false,
                  loading: false,
                });
                toast.error(err.response.message);
              });
          }
        } else {
          if (this.state.publish_date) {
            this.setState({ loading: true });
            this.props
              .updateSchedulePost({
                caption: this.state.currentData?.title,
                publish_date: this.state.publish_date,
                redirected_url: this.state.redirected_url,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                categories: [this.state.categories?.value],
                media_library_id: this.state.media_library_id,
                media_id: this.state.media_id,
                is_link_in_bioshop: false,
              })
              .then(() => {
                this.props.reload();
                this.setState({
                  modalEvent: false,
                  loading: false,
                });
                toast.success("Successfully Scheduled");
              })
              .catch((err) => {
                this.setState({
                  modalEvent: false,
                  loading: false,
                });
                toast.error(err.response.message);
              });
          }
        }
      }
      // schedulePost({
      //     ...fields,
      //     media_url:currentData.media_url,
      //     media_library_id:currentData.media_library_id,
      //     caption:currentData.title
      // })
    }
  }

  onDelete = () => {
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
        this.setState({ deleteLoading: true });
        this.props
          .deleteSchedulePost(this.state.media_id)
          .then(() => {
            this.props.reload();
            toast.success("Successfully Deleted");
            this.setState({
              modalEvent: false,
              deleteLoading: false,
            });
          })
          .catch((err) => {
            this.setState({
              modalEvent: false,
              deleteLoading: false,
            });
            toast.error(err.response.message);
          });
      }
    });
  };
  render() {
    const { event, calendarOptions, modal, modalEvent } = this.state;
    return (
      <div className={s.root}>
        <Row>
          <Col md={12} lg={12} xs={12}>
            <Widget>
              <Row className="calendar-controls">
                <Col md={3}>
                  <ButtonGroup className="mr-sm">
                    <Button color="default" onClick={this.prev}>
                      <i className="fa fa-angle-left" />
                    </Button>
                    <Button color="default" onClick={this.next}>
                      <i className="fa fa-angle-right" />
                    </Button>
                  </ButtonGroup>
                  <Button color="default" onClick={this.today}>
                    Today
                  </Button>
                </Col>
                <Col md={9} className="calendar-controls text-right">
                  <ButtonGroup>
                    <Button
                      color="default"
                      onClick={() => this.changeView("dayGridMonth")}
                      active={this.state.calendarView === "dayGridMonth"}
                    >
                      Month
                    </Button>
                    <Button
                      color="default"
                      onClick={() => this.changeView("timeGridWeek")}
                      active={this.state.calendarView === "timeGridWeek"}
                    >
                      Week
                    </Button>
                    <Button
                      color="default"
                      onClick={() => this.changeView("timeGridDay")}
                      active={this.state.calendarView === "timeGridDay"}
                    >
                      Day
                    </Button>
                    <Button
                      color="default"
                      onClick={() => this.changeView("list")}
                      active={this.state.calendarView === "list"}
                    >
                      List
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>

              <FullCalendar
                ref={(node) => {
                  this.fullCalendar = node;
                }}
                defaultView="dayGridMonth"
                plugins={this.state.calendarPlugins}
                eventClick={this.eventClick}
                eventContent={(eventInfo) => {
                  return (
                    <div
                      style={{ backgroundColor: "white", paddingBottom: 8 }}
                      className="pt-2"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={eventInfo.event.extendedProps.url}
                          width="30%"
                          style={{ margin: 5 }}
                        />
                        <div style={{ width: "55%" }}>
                          <p className="mt-2" style={{ fontSize: 10 }}>
                            {eventInfo.event.start.toLocaleTimeString()}
                          </p>
                          <p style={{ fontSize: 10 }}>
                            {eventInfo.event.start.toDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }}
                drop={this.drop}
                events={this.props.data}
                {...calendarOptions}
              />
            </Widget>
          </Col>
        </Row>

        <Modal
          isOpen={modalEvent}
          toggle={this.toggleModalEvent}
          id="news-close-modal"
          className="edit-campaign linkin-bio"
          centered
          size="xl"
        >
          <ModalHeader
            toggle={this.toggleModalEvent}
            id="news-close-modal-label"
          >
            Edit Post
          </ModalHeader>
          <ModalBody className="bg-white affiliate-model image-edit-box p-3">
            <Row>
              <Col lg={4}>
                <div class="form-group">
                  <label for="exampleInputEmail1">Caption</label>
                  <input
                    value={this.state.currentData?.title}
                    onChange={(e) =>
                      this.setState({
                        currentData: {
                          ...this.state.currentData,
                          title: e.target.value,
                        },
                      })
                    }
                    type="text"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter Caption"
                  />
                  {this.state.submit && !this.state.currentData?.title ? (
                    <small style={{ color: "red" }}>Please Fill</small>
                  ) : null}
                </div>
                {/* <p
                  style={{
                    color: "gray",
                    overflow: "scroll",
                    overflowX: "hidden",
                    height: "15%",
                  }}
                >
                  {this.state.currentData?.title}
                </p> */}
                <img
                  style={{
                    width: "100%",
                  }}
                  src={this.state.currentData?.extendedProps?.url}
                />
              </Col>
              <Col lg={8}>
                <Row>
                  {/* <Col lg={4} sm={6}>
                                    <div className="checkbox abc-checkbox abc-checkbox-primary">
                                        <Input
                                            name="schedule_post"
                                            value="Monthly"
                                            checked={this.state.showPost}
                                            className="mt-0"
                                            id="checkbox1"
                                            type="checkbox"
                                            onChange={(e) => {
                                                this.setState({showPost:!this.state.showPost})
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
                        checked={this.state.showBio}
                        className="mt-0"
                        id="checkbox2"
                        type="checkbox"
                        onChange={(e) => {
                          this.setState({ showBio: !this.state.showBio });
                        }}
                      />{" "}
                      <Label for="checkbox2" />
                      Add to Bioshop
                    </div>
                  </Col>
                </Row>
                <div>
                  {this.state.showPost ? this.renderSchedule() : null}
                  {this.state.showBio ? this.renderBioShop() : null}
                  <Row>
                    <Col>
                      {this.state.loading ? (
                        <button className="custom_btns_ift btn btn-primary mt-3">
                          <Loader />
                        </button>
                      ) : (
                        <button
                          onClick={() => this.onSubmit()}
                          className="custom_btns_ift btn btn-primary mt-3"
                        >
                          Update
                        </button>
                      )}
                      {this.state.deleteLoading ? (
                        <button className="custom_btns_ift btn btn-primary mt-3">
                          <Loader />
                        </button>
                      ) : (
                        <button
                          onClick={this.onDelete}
                          className="custom_btns_ift btn btn-primary mt-3"
                        >
                          Delete
                        </button>
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ categories }) {
  return { categories };
}

export default connect(mapStateToProps, {
  ...schedulePostActions,
  ...categoriesActions,
})(Calendar);
