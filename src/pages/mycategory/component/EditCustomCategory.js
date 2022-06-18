import React from "react";
import { Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import { createBrowserHistory } from "history";
// import Placeholder from "../../../images/placeholder.svg";

export const history = createBrowserHistory({
  forceRefresh: true,
});

class EditCustomCategory extends React.Component {
  state = {
    loading: false,
    cat_modal: false,
    imageFiles: [],
    category_name: this.props.catData.label,
    cat_image: this.props.catData.image,
    cat_id: this.props.catData.category_id,
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
      }
      else {
        toast.error("We Only Support PNG, WEBP, Or JPG Image")
      }
    }
  };
  // handleChange = (e) => {
  //   this.setState({
  //     category_name: e.target.value,
  //   });
  // };

  onSubmitting = async () => {
    var formData = new FormData();
    formData.append(
      "image",
      this.state.imageFiles[0] === undefined ? "" : this.state.imageFiles[0]
    );
    formData.append("category_name", this.state.category_name);
    // formData.append("user_id", this.props.userID);
    this.setState({ loading: true });
    await axios
      .put(`/usercategory/revise/${this.state.cat_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        this.setState({ loading: false });
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        this.props.fetchMyCategory();
        // this.props.fetchCustomCategory();
        this.props.fetchSaveCategory();
        this.categoryToggleModal();
      })
      .catch((err) => {
        this.setState({ loading: false });
        toast.error(err.response.data.message);
      });
  };
  categoryToggleModal = () => {
    // if (this.state.cat_modal) {
    //   this.setState({
    //     category_name: "",
    //     imageFiles: [],
    //   });
    // }
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
          <Modal.Title>Edit Custom Category</Modal.Title>
        </Modal.Header>
        {/* <form onSubmit={this.onSubmitting}> */}
        <div className="mb-3">
          <Col md={12} className="text-center">
            <div className="fileinput file-profile">
              <input
                accept=".jpg, .jpeg, .png, .webp, .svg"
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
                    src={this.state.cat_image}
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
        {/* <div className="mb-3">
            <Col md={12}>
              <label>Enter Category Name</label>
              <input
                type="text"
                name="category_name"
                placeholder="Enter Category Name"
                onInput={this.handleChange}
                value={this.state.category_name}
                className="form-control comment-field"
                required
                autoComplete="off"
              />
            </Col>
          </div> */}

        <div className="mb-3">
          <Col md={12} className="update-col">
            {this.state.loading ? (
              <Button>
                <Loader />
              </Button>
            ) : (
              <Button
                variant="primary"
                // type="submit"
                className="category-btn btn-block "
                onClick={this.onSubmitting}
                disabled={this.state.imageFiles[0] === undefined ? true : false}
              >
                Update Category
              </Button>
            )}
          </Col>
        </div>
        {/* </form> */}
      </Modal>
    );
  };

  render() {
    return (
      <>
        {/* <button
          className="btn btn-link edit-icon"
          // onClick={this.categoryToggleModal}
        >
          
        </button> */}
        <span
          onClick={this.categoryToggleModal}
          className="fa fa-edit edit-icon link"
          title="Edit"
        ></span>
        {this.categoryModal()}
      </>
    );
  }
}
export default EditCustomCategory;
