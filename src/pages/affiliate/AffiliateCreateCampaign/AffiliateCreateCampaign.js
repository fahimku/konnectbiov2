import React from "react";
// import { Row, Col } from "reactstrap";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import CarouselComponent from "./components/CarouselComponent";
import AffiliateForm from "./components/AffiliateForm";
import PostGallery from "./components/PostGallery";
import Loader from "../../../components/Loader/Loader";
// import Connection from "../../connectToShopify/connShopify";

class AffiliateCreateCampaign extends React.Component {
  state = {
    username: this.props.username,
    user_id: this.props.user_id,
    data: [],
    allCategory: [],
    aff_modal: false,
    affData: "",
    countries: "",
    affDataLoading: false,
    id: "",
    categoryLoading: false,
    ShopifyConnFound: true,
  };

  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({ userInfo: userInfo });
    // this.getAllPost();
    this.fetchAllCategory();

    //   axios.get("/campaigns/receive/getpromocodes").then((res) =>{

    //   }).catch((res) =>{
    //     this.setState({ShopifyConnFound: false});
    // })
  }
  // getAllPost = async () => {
  //   await axios
  //     .get("shop/posts" + `?limit=16&page=1&post_type=image`)
  //     .then((response) => {
  //       const allpost = response.data.message.result.data;
  //       this.setState({ data: allpost });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };
  fetchAllCategory = async () => {
    this.setState({ categoryLoading: true });
    await axios
      .get("/users/receive/categories")
      .then((response) => {
        const myCategories = response.data.message;
        // myCategories.map(({ category_id, category_name, image_url }) => {
        //   return selectCategories.push({
        //     value: category_id,
        //     label: category_name,
        //     image: image_url,
        //   });
        // });
        this.setState({ categoryLoading: false });
        this.setState({ allCategory: myCategories });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ categoryLoading: false });
      });
  };
  selectPost = (postId) => {
    this.setState({ aff_modal: true });
    this.fetchSinglePost(postId);
    this.getCountries();
  };

  // Fetch Single Post
  fetchSinglePost = async (post_id) => {
    this.setState({ affDataLoading: true });
    await axios
      .get(`/posts/retrieve/${post_id}`)
      .then((response) => {
        this.setState({ affData: response.data.message });
        this.setState({ affDataLoading: false });
      })
      .catch((err) => {
        console.log(err, "err");
        this.setState({ affDataLoading: false });
      });
  };

  getCountries = async () => {
    await axios
      .get(`/campaigns/countries`)
      .then((response) => {
        const selectCountries = [];
        const countries = response.data.message;
        countries.map(({ name, code1 }) => {
          return selectCountries.push({ value: code1, label: name });
        });
        this.setState({ countries: selectCountries });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  categoryFilter = async (id) => {
    this.setState({ id: id });
    // await axios
    //   .get(`/shop/filter?limit=16&page=1&post_type=image&id=${id}`)
    //   .then((response) => {
    //     const allpost = response.data.message.result.data;
    //     this.setState({ data: allpost });
    //   })
    //   .catch((err) => {
    //     console.log(err, "err");
    //   });
  };

  affToggleModal = () => {
    const { aff_modal } = this.state;
    this.setState({
      aff_modal: !aff_modal,
    });
  };
  affiliateModal = () => {
    return this.state.aff_modal ? (
      <div className="affiliate-model image-edit-box">
        {/* <Alert onClose={this.affToggleModal} dismissible>
          <Alert.Heading>Create Campaign</Alert.Heading>
          {this.state.affDataLoading ? (
            <Loader className="analytics-loading" size={60} />
          ) : (
            <AffiliateForm
              affData={this.state.affData}
              countries={this.state.countries}
              affCloseModal={this.affToggleModal}
            />
          )}
        </Alert> */}
        {/* {this.state.ShopifyConnFound == true ?
        <> */}
        <div className="image-box-info">
          <h4>
            Create Campaign
            <span onClick={this.affToggleModal} className="fa fa-times"></span>
          </h4>
        </div>

        {this.state.affDataLoading ? (
          <Loader className="analytics-loading" size={60} />
        ) : (
          <AffiliateForm
            affData={this.state.affData}
            countries={this.state.countries}
            affCloseModal={this.affToggleModal}
            toggleTabs={this.props.toggleTabs}
          />
        )}
        {/* </>
        :
        <Connection/>
  }
         */}

        {/* {window.innerWidth <= 760 && (
          <Modal
            show={this.state.aff_modal}
            onHide={this.affToggleModal}
            backdrop="static"
            className="affiliate-model"
          >
            <Modal.Header closeButton>
              <Modal.Title>Create Campaign</Modal.Title>
            </Modal.Header>
            {this.state.affDataLoading ? (
              <Loader className="analytics-loading" size={60} />
            ) : (
              <AffiliateForm
                affData={this.state.affData}
                countries={this.state.countries}
                affCloseModal={this.affToggleModal}
                toggleTabs={this.props.toggleTabs}
              />
            )}
          </Modal>
        )} */}
      </div>
    ) : (
      <div className="create_campaign_heading">
        <h4>Create campaign</h4>
      </div>
    );
  };
  render() {
    return (
      <React.Fragment>
        <div className="aff-container-fulid container-fluid">
          <div className="create-affiliate">
            <Row className="app_main_cont_ift main-container">
              <Col className="left-column" md="5" xs="12" xl="3">
                <div className="">
                  {!this.state.categoryLoading ? (
                    <>
                      <CarouselComponent
                        allCategory={this.state.allCategory}
                        categoryFilter={this.categoryFilter}
                      />
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      <i
                        className="la la-spinner la-spin"
                        style={{ fontSize: 40 }}
                      />
                    </div>
                  )}
                  <PostGallery
                    selectPost={this.selectPost}
                    id={this.state.id}
                  />
                </div>
              </Col>
              <Col
                className={`right-bar-affiliate bg-white ${
                  this.state.aff_modal ? "affiliate-block" : ""
                }`}
                md="7"
                xs="12"
                xl="9"
              >
                {this.affiliateModal()}
              </Col>
              {/* {this.state.ShopifyConnFound == true ?
        <>
              <Col
                className={`right-bar-affiliate bg-white ${
                  this.state.aff_modal ? "affiliate-block" : ""
                }`}
                md="7"
                xs="12"
                xl="9"
              >
                {this.affiliateModal()}
              </Col>
              </>:
               <Col
               className={"right-bar-affiliate bg-white"}
               md="7"
               xs="12"
               xl="9"
             >
              <Connection/>
  </Col>
  } */}
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default AffiliateCreateCampaign;
