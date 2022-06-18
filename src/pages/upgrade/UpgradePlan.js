import React from "react";
import axios from "axios";
import Select from "react-select";
import { Row, Col, Button } from "react-bootstrap";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

class MyCategory extends React.Component {
  state = {
    myCategory: "",
    user_id: "",
    category: "",
    defaultCategory: "",
  };

  componentDidMount() {
    this.setState({ user_id: userInfo.user_id });
    this.fetchMyCategory();
    this.fetchSaveCategory();
  }

  fetchMyCategory = async () => {
    await axios
      .get("/category/receive")
      .then((response) => {
        const selectCategories = [];
        const mycategories = response.data.message;
        mycategories.map(({ category_id, category_name }) => {
          selectCategories.push({ value: category_id, label: category_name });
        });
        this.setState({ myCategory: selectCategories });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fetchSaveCategory = async () => {
    await axios
      .get(`/users/receive/categories?id=${userInfo.user_id}`)
      .then((response) => {
        const saveCategories = [];
        const mycategories = response.data.message;
        mycategories.map(({ category_id, category_name }) => {
          saveCategories.push({ value: category_id, label: category_name });
        });
        this.setState({ defaultCategory: saveCategories });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  handleSelect = (e, options) => {
    this.setState({
      category: options,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    let category = this.state.category.map((category) => {
      return category.value;
    });
    await axios
      .put(`/users/revise/categories/${userInfo.user_id}`, {
        categories: category,
      })
      .then((response) => {
        let categoryResponse = response.data;
        console.log(categoryResponse, "response");
      })
      .catch((err) => {
        console.log(err.response.data.message, "error");
      });
  };

  render() {
    console.log(this.state.defaultCategory, "defaultCategory");
    console.log(this.state.category, "category");
    return (
      <div className="category-page">
        <div className="container">
          <Row className="justify-content-md-center">
            <Col md={12}>
              <h4 className="page-title">Personal Category</h4>
            </Col>
          </Row>
          <form onSubmit={this.handleSubmit}>
            <Row className="justify-content-md-center">
              <Col md={6}>
                <label>Select Category: </label>
                <Select
                  isMulti={true}
                  name="category"
                  className="selectCustomization"
                  options={this.state.myCategory}
                  // value={this.state.defaultCategory}
                  // defaultValue={this.state.defaultCategory}
                  placeholder="Select Category"
                  onChange={(options, e) => this.handleSelect(e, options)}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="primary"
                  type="submit"
                  className="category-btn btn-block"
                >
                  Save Category
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}
export default MyCategory;