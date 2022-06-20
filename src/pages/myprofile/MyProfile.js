import React from "react";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import ChangePassword from "./component/ChangePassword";
import ScreenButton from "./component/screenButtons";
import Placeholder from "../../images/placeholder.svg";
import Swal from "sweetalert2";
import ChangePreferences from "./component/ChangePreferences";
//import avatar from "../../images/avatar15.jpg";
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchLoading: false,
      form: {
        name: "",
        bio: "",
      },
      imageFiles: [],
      user_id: "",
      imageError: "",
      loadingImage: false,
      loading: false,
      userData: "",
      userImage: "",
      userInfo2: "",
      disabled: true,
      setDefaultImage: false,
      cancelDefaultImage: false,
    };
  }

  componentDidMount() {
    const userInfo2 = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({ userInfo2: userInfo2 });
    this.fetchUserInfo(userInfo2);
  }

  fetchUserInfo = async (userInfo2) => {
    this.setState({ fetchLoading: true });
    await axios
      .get(`/users/receive/userinfo`)
      .then((response) => {
        if (response.data.success) {
          const userInfo = response.data.message.data;
          this.setState({
            userData: userInfo,
            userImage: userInfo.profile_image_url,
          });
          this.setDefaultData();
          this.setState({ fetchLoading: false });
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  setDefaultData = () => {
    const { form } = this.state;
    setTimeout(() => {
      form.name = this.state.userData.name;
      form.bio = this.state.userData.bio;
      this.setState({
        form,
      });
    }, 100);
  };

  resetImages = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reset images",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reset Default",
    }).then((result) => {
      if (result.isConfirmed) {
        this.setState({ cancelDefaultImage: false });
        this.setState({ setDefaultImage: true });
        this.setState({ disabled: false });
        axios
          .put(`/users/revise/resetUserMenuImage/${userInfo.user_id}`)
          .then((response) => {
            this.setState({ disabled: true });
            let imageResponse = response.data;
            toast.success(imageResponse.message);
            const userInformation = localStorage.getItem("userInfo");
            const parseUserInformation = JSON.parse(userInformation);
            parseUserInformation.menu = imageResponse.data;
            const storeUserInformation = JSON.stringify(parseUserInformation);
            localStorage.setItem("userInfo", storeUserInformation);
            // Swal.fire("Default Pictures Reset Successfully");
            Swal.fire({
              text: "Default Pictures Reset Successfully",
              icon: "success",
              confirmButtonColor: "#010b40",
            });
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      } else {
        // this.setState({ cancelDefaultImage: true });
        // this.setState({ setDefaultImage: false });
        // this.setState({ disabled: true });
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    await axios
      .put(`/users/revise/profilefields/${userInfo.user_id}`, this.state.form)
      .then((response) => {
        this.setState({ loading: false });
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        this.fetchUserInfo(this.state.userInfo2);
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
        this.setState({ loading: false });
      });
  };

  handleChange = (e) => {
    let { form } = this.state;
    form[e.target.name] = e.target.value;
    this.setState({
      form,
    });
  };

  setDefaultImage = () => {
    this.setState({ cancelDefaultImage: false });
    this.setState({ setDefaultImage: true });
    this.setState({ disabled: false });
  };

  onChangeInputImage = (e) => {
    if (e.target.files.length === 1) {
      if (
        e.target.files[0]?.type === "image/jpeg" ||
        e.target.files[0]?.type === "image/webp" ||
        e.target.files[0]?.type === "image/png" ||
        e.target.files[0]?.type === "image/svg+xml"
      ) {
        const files = [];
        const reader = new FileReader();
        files.push(e.target.files[0]);
        reader.onloadend = () => {
          files[0].preview = reader.result;
          files[0].toUpload = true;
          this.setState({
            imageFiles: files,
          });
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        toast.error("We Only Support PNG, WEBP, Or JPG Image");
      }
    }
  };

  uploadImage = async () => {
    var formData = new FormData();
    formData.append("image", this.state.imageFiles[0]);
    formData.append("instagram_username", userInfo.username);
    this.setState({ loadingImage: true });
    await axios
      .put(`/users/revise/profileimage/${userInfo.user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        this.setState({ loadingImage: false });
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        this.fetchUserInfo(this.state.userInfo2);
        this.setState({ imageFiles: [] });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loadingImage: false });
        this.setState({ imageError: err.response.data.message });
      });
  };

  clearImage = () => {
    this.setState({
      imageFiles: [],
      userImage: this.state.userImage,
    });
  };

  render() {
    const userData = this.state.userData;
    return (
      <div className="profile-page">
        <div className="container-fluid">
          <Row className="mt-4">
            <Col md={12}>
              <h4 className="page-title">Settings - Basic Setup</h4>
            </Col>
          </Row>
          <div className="profile_container_main container">
            <div className="row">
              <div className="profile_box_main col-md-6">
                <div className="dash_block_profile">
                  <div className="dash_content_profile">
                    {/* <h5>Profile</h5> */}
                    <div className="dp_cont mb-5">
                      <span>
                        {this.state.imageFiles.length > 0 ? (
                          <>
                            {this.state.imageFiles.map((file, idx) => (
                              <>
                                <img
                                  alt="..."
                                  src={file.preview}
                                  key={`img-id-${idx.toString()}`}
                                  style={{ width: "76px", height: "76px" }}
                                  className="circle profile-icon"
                                />
                                <strong>Logo</strong>
                              </>
                            ))}
                          </>
                        ) : this.state.userImage === "" ||
                          this.state.userImage === undefined ? (
                          <>
                            <img
                              style={{ width: "76px", height: "76px" }}
                              className="circle profile-icon"
                              alt="profile-icon"
                              src={Placeholder}
                            />
                            <strong>Logo</strong>
                          </>
                        ) : (
                          <>
                            <img
                              style={{ width: "76px", height: "76px" }}
                              className="circle profile-icon"
                              alt="profile-icon"
                              src={this.state.userImage}
                            />
                            <strong>Logo</strong>
                          </>
                        )}

                        {/* <img src={avatar} alt="Profile" /> */}
                      </span>
                      <div className="dp_buttons">
                        <input
                          accept=".jpg, .jpeg, .png, .webp, .gif"
                          onChange={(e) => this.onChangeInputImage(e)}
                          id="fileupload5"
                          type="file"
                          name="file"
                          className="d-none"
                        />
                        <Button
                          accept=".jpg, .jpeg, .png, .webp, .gif"
                          onChange={(e) => this.onChangeInputImage(e)}
                          type="file"
                          color="default"
                          className="select-image"
                        >
                          <label htmlFor="fileupload5">Change Image</label>
                        </Button>

                        {this.state.loadingImage ? (
                          <Button className="d-block upload-btn">
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            onClick={this.uploadImage}
                            className="d-block upload-btn"
                            disabled={
                              this.state.imageFiles.length > 0 ? false : true
                            }
                          >
                            Save
                          </Button>
                        )}

                        <Button
                          onClick={this.clearImage}
                          type="button"
                          color="default"
                          className="select-image"
                        >
                          <label>Cancel</label>
                        </Button>
                      </div>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                      <div className="dp_fields mb-0">
                        <h5>Profile</h5>
                        <div className="mb-3">
                          <label>Enter Name</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            onInput={this.handleChange}
                            className="form-control comment-field"
                            required
                            defaultValue={userData.name}
                          />
                        </div>
                        <div className="mb-0">
                          <label>Enter Bio</label>
                          <textarea
                            name="bio"
                            placeholder="Enter Bio"
                            onInput={this.handleChange}
                            className="form-control comment-field pt-2"
                            defaultValue={userData.bio}
                            rows="4"
                          />
                        </div>
                        <div className="pr-sv-btn mt-3">
                          {this.state.loading ? (
                            <Button>
                              <Loader />
                            </Button>
                          ) : (
                            <Button color="default" type="submit">
                              Save
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="profile_box_main col-md-6">
                <div className="dash_block_profile">
                  <div className="dash_content_profile">
                    <h5>Screen Buttons</h5>
                    <ScreenButton
                      cancelDefaultImage={this.state.cancelDefaultImage}
                      setDefaultImage={this.state.setDefaultImage}
                      setImageDefault={() => {
                        this.setState({ setDefaultImage: false });
                      }}
                      defaultImage="https://cdn.konnect.bio/menu/profile.jpg"
                      name="Profile"
                      key={0}
                      id={0}
                    />
                    <ScreenButton
                      cancelDefaultImage={this.state.cancelDefaultImage}
                      setDefaultImage={this.state.setDefaultImage}
                      setImageDefault={() => {
                        this.setState({ setDefaultImage: false });
                      }}
                      defaultImage="https://cdn.konnect.bio/menu/all_posts.jpg"
                      name="All"
                      key={1}
                      id={1}
                    />
                    <ScreenButton
                      cancelDefaultImage={this.state.cancelDefaultImage}
                      setDefaultImage={this.state.setDefaultImage}
                      setImageDefault={() => {
                        this.setState({ setDefaultImage: false });
                      }}
                      defaultImage="https://cdn.konnect.bio/menu/links.jpg"
                      name="Links"
                      key={2}
                      id={2}
                    />
                    {/* <ScreenButton
                      cancelDefaultImage={this.state.cancelDefaultImage}
                      setDefaultImage={this.state.setDefaultImage}
                      setImageDefault={() => {
                        this.setState({ setDefaultImage: false });
                      }}
                      defaultImage="https://cdn.konnect.bio/menu/coupon.PNG"
                      name="Coupons"
                      key={3}
                      id={3}
                    /> */}
                    <hr></hr>
                    <div className="pr-sv-btn mt-3">
                      <Button
                        onClick={() => {
                          // this.setDefaultImage();
                          this.resetImages();
                        }}
                        type="submit"
                        color="default"
                      >
                        Reset All
                      </Button>
                      {/* <Button
                        onClick={() => {
                          this.resetImages();
                        }}
                        disabled={this.state.disabled}
                        type="button"
                        color="default"
                        className="select-image"
                      >
                        Save
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="profile_password profile_box_main col-md-6">
                <ChangePassword userID={userInfo.user_id} />
              </div>
              <div className="profile_password profile_box_main col-md-6">
                <ChangePreferences userID={userInfo.user_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MyProfile;
