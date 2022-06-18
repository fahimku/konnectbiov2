import React from "react";
import { Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { createBrowserHistory } from "history";
import Placeholder from "../../../images/placeholder.svg";

export const history = createBrowserHistory({
  forceRefresh: true,
});

class CustomCategory extends React.Component {
  state = {
    loading: false,
    cat_modal: false,
    imageFiles: [],
    category_name: "",
  };
  onChangeInputImage = (e) => {
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
  };
  handleChange = (e) => {
    this.setState({
      category_name: e.target.value,
    });
  };

  onSubmitting = async (e) => {
    e.preventDefault();

    var formData = new FormData();
    formData.append(
      "image",
      this.state.imageFiles[0] === undefined ? "" : this.state.imageFiles[0]
    );
    formData.append("category_name", this.state.category_name);
    formData.append("user_id", this.props.userID);
    this.setState({ loading: true });
    await axios
      .post(`/customcategory/reserve`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        this.setState({ loading: false });
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        this.props.fetchMyCategory();
        this.props.fetchCustomCategory();
        this.categoryToggleModal();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loading: false });
      });
  };
  categoryToggleModal = () => {
    if (this.state.cat_modal) {
      this.setState({
        category_name: "",
        imageFiles: [],
      });
    }
    const { cat_modal } = this.state;
    this.setState({
      cat_modal: !cat_modal,
    });
  };
  categoryModal = () => {
    return (
      <Modal
        show={this.state.cat_modal}
        onHide={this.categoryToggleModal}
        className="change-password"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Category</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.onSubmitting}>
          <div className="mb-3">
            <Col md={12} className="text-center">
              <div className="fileinput file-profile">
                <input
                  accept="image/*"
                  onChange={(e) => this.onChangeInputImage(e)}
                  id="fileupload2"
                  type="file"
                  name="file"
                  className="d-none"
                />
                <div className="fileinput-new thumbnail">
                  {this.state.imageFiles.length > 0 ? (
                    <div>
                      {this.state.imageFiles.map((file, idx) => (
                        <img
                          alt="profile-icon"
                          src={file.preview}
                          key={`img-id-${idx.toString()}`}
                          style={{ width: "100px", height: "100px" }}
                          className="circle profile-icon"
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      alt="profile-icon"
                      src={Placeholder}
                      style={{ width: "100px", height: "100px" }}
                      className="circle profile-icon"
                    />
                  )}
                </div>
              </div>
              <Button type="button" color="default" className="select-image">
                <label for="fileupload2">Choose Category Image</label>
              </Button>
            </Col>
          </div>
          <div className="mb-3">
            <Col md={12}>
              <label>Enter Category Name</label>
              <input
                type="text"
                name="category_name"
                placeholder="Enter Category Name"
                onInput={this.handleChange}
                className="form-control comment-field"
                required
                autoComplete="off"
              />
            </Col>
          </div>

          <div className="mb-3">
            <Col md={12} className="update-col">
              {this.state.loading ? (
                <Button>
                  <Loader />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className="category-btn btn-block "
                >
                  Add Category
                </Button>
              )}
            </Col>
          </div>
        </form>
      </Modal>
    );
  };

  render() {
    return (
      <div className="catmodel-box">
        <Button
          variant="primary"
          className="btn-block"
          onClick={this.categoryToggleModal}
        >
          Create Custom Categories
        </Button>

        {this.categoryModal()}
      </div>
    );
  }
}
export default CustomCategory;
