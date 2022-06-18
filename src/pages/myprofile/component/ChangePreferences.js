import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import TimezoneSelect from "react-timezone-select";

class ChangePreferences extends React.Component {
  state = {
    editLoading: false,
    edit_modal: false,
    selectedTimezone: {},
    first_day_Of_the_week: "",
    err_message: false,
  };
  componentDidMount() {
    this.getUserTimeZone();
  }
  getUserTimeZone = async () => {
    await axios
      .get(`/users/revise/getUserTimeZone`)
      .then((response) => {
        if (response.data.success) {
          const getUserTimezone = response?.data?.data;
          this.setState({
            selectedTimezone: getUserTimezone.user_timeZone
              ? getUserTimezone.user_timeZone
              : {},
            first_day_Of_the_week: getUserTimezone.first_day_Of_the_week
              ? getUserTimezone.first_day_Of_the_week
              : "",
          });
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  handleClose = () => {
    this.setState({ edit_modal: false, err_message: false });
  };
  handleSelect = (e, options) => {
    this.setState({
      first_day_Of_the_week: options.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(this.state.selectedTimezone).length === 0) {
      this.setState({ err_message: true });
    } else {
      this.setState({ editLoading: true });
      await axios
        .post(`/users/revise/saveUserTimeZone`, {
          user_timeZone: this.state.selectedTimezone,
          first_day_Of_the_week: this.state.first_day_Of_the_week,
        })
        .then((response) => {
          this.setState({
            edit_modal: false,
            editLoading: false,
            selectedTimezone: {},
            first_day_Of_the_week: "",
            err_message: false,
          });

          this.getUserTimeZone();
          toast.success(response.data.message);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          this.setState({ editLoading: false, err_message: false });
        });
    }
  };
  selectedTimezone = (e) => {
    this.setState({ selectedTimezone: e, err_message: false });
  };
  guessTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timezone);
    this.setState({ selectedTimezone: timezone });
  };

  render() {
    const weekOptions = [
      { value: "sunday", label: "Sunday" },
      { value: "monday", label: "Monday" },
      { value: "tuesday", label: "Tuesday" },
      { value: "wednesday", label: "Wednesday" },
      { value: "thursday", label: "Thursday" },
      { value: "friday", label: "Friday" },
      { value: "saturday", label: "Saturday" },
    ];
    return (
      <>
        <div className="dash_block_profile dash_block_preferences">
          <div className="dash_content_profile">
            <h5>Preferences</h5>
            <div className="row">
              <div className="col-md-8 col-sm-8 col-6">
                <div class="mb-3">
                  <label>Time Zone</label>
                  <div className="preferences-value">
                    {this.state.selectedTimezone.value
                      ? this.state.selectedTimezone.value
                      : "Not Set"}
                  </div>
                </div>
                <div class="mb-3">
                  <label>First Day of the Week</label>
                  <div className="preferences-value">
                    {this.state.first_day_Of_the_week
                      ? this.state.first_day_Of_the_week
                      : "Not Set"}
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-6 preference-btn-box">
                <Button
                  className="mr-0"
                  onClick={() => {
                    this.setState({
                      edit_modal: true,
                    });
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          className="addbio-modal"
          show={this.state.edit_modal}
          onHide={this.handleClose}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Preferences</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <Row>
                <Col md={12}>
                  <label>
                    Time Zone{" "}
                    {/* <span
                      className="btn-link guess-btn "
                      onClick={this.guessTimezone}
                    >
                      GUESS MY TIME ZONE
                    </span> */}
                  </label>
                  <div className="select-wrapper">
                    <TimezoneSelect
                      value={this.state?.selectedTimezone}
                      onChange={(e) => {
                        this.selectedTimezone(e);
                      }}
                      placeholder="Select Time Zone"
                      // isClearable={true}
                    />
                    {this.state.err_message ? (
                      <span className="text-danger">
                        This field is required
                      </span>
                    ) : null}
                  </div>
                </Col>
                <Col md={12} className="mt-3">
                  <label>First Day of the Week</label>
                  <Select
                    name="first_day_Of_the_week"
                    options={weekOptions}
                    placeholder="Select First Day of the Week"
                    onChange={(options, e) => this.handleSelect(e, options)}
                    isSearchable={false}
                    defaultValue={weekOptions.filter(
                      (option) =>
                        option.value === this.state?.first_day_Of_the_week
                    )}
                  />
                </Col>
                <Col md={12} className="mt-3">
                  {this.state.editLoading ? (
                    <Button>
                      <Loader />
                    </Button>
                  ) : (
                    <Button color="default" type="submit">
                      Save
                    </Button>
                  )}

                  <Button className="" onClick={this.handleClose}>
                    Close
                  </Button>
                </Col>
              </Row>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default ChangePreferences;
