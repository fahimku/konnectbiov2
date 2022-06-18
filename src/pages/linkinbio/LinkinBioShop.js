/* eslint-disable */
import axios from "axios";
import React from "react";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import placeholder from "../../images/placeholder.png";
import config from "../../config";
import TopBar from "../../components/Topbar";
import MobilePreview from "./component/MobilePreview";
import ShopRightBar from "./component/ShopRightBar/index";
import moment from "moment";

class LinkinBioShop extends React.Component {
  constructor(props) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let username = userInfo.username;
    let userId = userInfo.user_id;
    super(props);
    this.error = this.error.bind(this);
    this.state = {
      postLoading: false,
      deleteId: "",
      startDate: moment(),
      endDate: moment().add(30, "days"),
      userId: userId,
      confirmModal: false,
      iframeKey: 0,
      loading: false,
      modal: false,
      media_id: "",
      instagramPosts: null,
      postType: "image",
      page: 1,
      limit: 20,
      categories: [],
      category: [],
      subCategories: [],
      subCategory: [],
      singlePost: "",
      dbSinglePost: "",
      dbCategoryName: "",
      dbSubCategory: "",
      currentPost: "",
      url: config.visitorURL + "/",
      nextPageUrl: "",
      username: username,
      redirectedUrl: "",
      selectPost: false,
      dropdownOpen: false,
      accordionFirst: [false, false, false],
      accordionSecond: [false, true, false],
      error: "",
      autoFocus: false,
      updatedAt: "",
      fetchUserPost: [],
    };
    this.changeCategory = this.changeCategory.bind(this);
    this.changeSubCategory = this.changeSubCategory.bind(this);
    this.changePostType = this.changePostType.bind(this);
  }

  componentDidMount() {
    this.fetchInstagramPosts(
      this.state.username,
      this.state.limit,
      this.state.page
    );
    this.fetchCategories();
  }

  //Second Request From User
  async fetchInstagramPosts(username, limit, page) {
    this.setState({ postLoading: true });
    await axios
      .get(`shop/posts?limit=${limit}&page=${page}&post_type=image,campaign`)
      .then((response) => {
        this.setState({ postLoading: false });
        this.setState({ instagramPosts: response.data.message.result });
        if (response.data.message.result.hasOwnProperty("next")) {
          this.setState({ page: response.data?.message?.result?.next.page });
        } else {
          this.setState({ page: 0 });
        }
      })
      .catch((err) => {
        this.setState({ postLoading: false });
        console.log(err);
      });
  }
  //nextPageInstagramPosts
  async nextPageInstagramPosts(username, limit, page) {
    await axios
      .get(`shop/posts?limit=${limit}&page=${page}&post_type=image,campaign`)
      .then((response) => {
        // console.log(response.data.message.result);
        if (response.data?.message?.result?.hasOwnProperty("next")) {
          this.setState({ page: response.data.message.result.next.page });
        } else {
          this.setState({ page: 0 });
        }
        let instagramPosts = [];
        let nextPageInstagramPosts = response.data.message.result.data;
        let PreviousInstagramPosts = this.state.instagramPosts;
        instagramPosts.push(PreviousInstagramPosts);
        for (let i = 0; i < nextPageInstagramPosts.length; i++) {
          instagramPosts[0].data.push(nextPageInstagramPosts[i]);
        }
        this.setState({ instagramPosts: instagramPosts[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //Fetch Categories
  //Fetch Categories
  fetchCategories = async () => {
    await axios
      .get(`/users/receive/categories?id=${this.state.userId}`)
      .then((response) => {
        const selectCategories = [];
        const categories = response.data.message;
        categories.map(({ category_id, category_name }) => {
          selectCategories.push({ value: category_id, label: category_name });
        });
        this.setState({ categories: selectCategories });
      });
  };

  //Fetch Sub Categories
  async fetchSubCategories(category_id) {
    await axios
      .post(`/common/receive/subCategories`, { category_id: category_id })
      .then((response) => {
        const selectSubCategories = [];
        const subCategories = response.data.message;
        subCategories.map(({ sub_category_id, sub_category_name }) => {
          selectSubCategories.push({
            value: sub_category_id,
            label: sub_category_name,
          });
        });
        this.setState({ subCategories: selectSubCategories });
      });
  }

  savePost = () => {
    if (this.state.redirectedUrl) {
      this.setState(
        (previousState) => ({
          currentPost: previousState.singlePost,
        }),
        async () => {
          this.setState({ loading: true });
          await axios
            .post(`/posts/reserve`, {
              id: this.state.currentPost.id,
              caption: this.state.currentPost.caption,
              media_url: this.state.currentPost.media_url,
              media_type: this.state.currentPost.media_type,
              timestamp: this.state.currentPost.timestamp,
              redirected_url: this.state.redirectedUrl,
              username: this.state.currentPost.username,
              categories: this.state.category,
              sub_categories: this.state.subCategory,
              post_type: this.state.postType,
              start_date: this.state.startDate,
              end_date: this.state.endDate,
            })
            .then((response) => {
              this.setState({ loading: false });
              let singlePostIndex = this.state.instagramPosts.data.findIndex(
                (item) => item.id === this.state.currentPost.id
              );
              let currentPost = this.state.currentPost;
              currentPost.redirected_url = this.state.redirectedUrl;
              currentPost.linked = true;
              let instagramPosts = JSON.parse(
                JSON.stringify(this.state.instagramPosts)
              );
              instagramPosts.data[singlePostIndex] = currentPost;
              this.setState({ instagramPosts: instagramPosts }, () => {});
              this.selectPost(false, "");
            })
            .catch((err) => {
              this.setState({ loading: false });
              toast.error(err);
            });
        }
      );
    }
  };

  updatePost = async (id, url) => {
    let newCategory = this.state.category;
    if (
      typeof this.state.category === "string" ||
      this.state.category instanceof String
    ) {
      newCategory = newCategory.split();
    } else {
      newCategory = newCategory;
    }
    this.setState({ loading: true });
    await axios
      .put(`/posts/revise/${id}`, {
        redirected_url: url,
        categories: newCategory,
        sub_categories: this.state.subCategory,
        post_type: this.state.postType,
        start_date: this.state.startDate,
        end_date: this.state.endDate,
      })
      .then((response) => {
        let singlePostIndex = this.state.instagramPosts.data.findIndex(
          (item) => item.id === id
        );
        let currentPost = this.state.singlePost;
        currentPost.redirected_url = url;
        let instagramPosts = JSON.parse(
          JSON.stringify(this.state.instagramPosts)
        );
        instagramPosts.data[singlePostIndex] = currentPost;
        this.setState({ instagramPosts: instagramPosts });
        toast.success("BioShop Updated Successfully");
        this.setState({ loading: false });
        this.selectPost(false, "");
      });
  };

  deletePost = async (id) => {
    this.setState({ loading: true });
    await axios.delete(`/posts/remove/${id}`).then((response) => {
      let singlePostIndex = this.state.instagramPosts.data.findIndex(
        (item) => item.id === id
      );
      let currentPost = this.state.singlePost;
      currentPost.linked = false;
      let instagramPosts = JSON.parse(
        JSON.stringify(this.state.instagramPosts)
      );
      instagramPosts.data[singlePostIndex] = currentPost;
      this.setState({ instagramPosts: instagramPosts });

      toast.success("Your Post is Unlinked Successfully");
      this.setState({ loading: false });
      this.setState({ redirectedUrl: "" });
      this.setState({ startDate: moment() });
      this.setState({ endDate: moment().add(30, "days") });
      this.fetchInstagramPosts(this.state.username, this.state.limit, 1);
    });
    this.setState({ confirmModal: false });
    this.selectPost(false, "");
  };

  paneDidMount = (node) => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  handleScroll = (event) => {
    let node = event.target;
    const bottom =
      parseInt(node.scrollHeight + 1 - node.scrollTop) ===
        parseInt(node.clientHeight) ||
      parseInt(node.scrollHeight - node.scrollTop) ===
        parseInt(node.clientHeight);
    if (bottom) {
      if (this.state.page) {
        console.log("page");
        console.log(this.state.page);
        this.nextPageInstagramPosts(
          this.state.username,
          this.state.limit,
          this.state.page
        );
      }
    }
  };

  // Fetch Single Post
  fetchSinglePost = async (media_id) => {
    await axios
      .get(`/posts/retrieve/${media_id}`)
      .then((response) => {
        this.setState({ fetchUserPost: response.data.message });
        this.setState({ postType: response.data.message.post_type });
        this.setState({ updatedAt: response.data.message.updated_at });
        this.setState({ media_id: media_id });
        let category = response.data.message.categories[0].category_id;
        this.setState({ category: category });
        this.changeDateRange(
          response.data.message.start_date,
          response.data.message.end_date
        );
      })
      .catch((err) => {
        this.setState({ category: [] });
        this.setState({ subCategory: [] });
        this.setState({ postType: "image" });
      });
  };

  selectPost = (state, postIndex) => {
    this.fetchCategories();
    if (postIndex !== "") {
      this.setState((prevState) => ({
        autoFocus: !prevState.autoFocus,
      }));
      //make border appear on post image
      let currentPost = this.state.instagramPosts.data[postIndex];
      let post_id = currentPost.post_id;
      let lastPost = this.state.singlePost;

      this.fetchSinglePost(post_id);
      //unlinked last selected post
      if (lastPost) {
        lastPost.select = false;
      }
      currentPost.select = true;
      let instagramPosts = JSON.parse(
        JSON.stringify(this.state.instagramPosts)
      );
      instagramPosts.data[postIndex] = currentPost;
      this.setState({ instagramPosts: instagramPosts });
      //link current post
      this.setState(
        {
          singlePost: currentPost,
        },
        () => {
          if (currentPost.redirected_url)
            this.setState({ redirectedUrl: currentPost.redirected_url });
          else this.setState({ redirectedUrl: "" });
        }
      );
    }
    this.setState({ selectPost: state });
    this.setState({ modal: true });
    if (state == false && postIndex == "")
      this.setState({ iframeKey: this.state.iframeKey + 1 });
  };

  error(error) {
    this.setState({ error: error });
  }

  changeCategory = (category) => {
    if (category) {
      this.setState({ category: category.split() });
      //this.fetchSubCategories(category);
    }
  };

  changeSubCategory = (subCategories) => {
    this.setState({ subCategory: subCategories });
  };

  changePostType = (e) => {
    if (e.target.checked) {
      this.setState({ postType: e.target.value });
    }
  };

  copyToClipboard = (e) => {
    let textField = document.createElement("textarea");
    textField.innerText = this.state.url + this.state.username;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied to Clipboard!");
  };

  toggle(id) {
    this.setState((prevState) => ({
      [id]: !prevState[id],
    }));
  }

  testUrl = (url) => {
    let newUrl;
    if (url.includes("http://")) {
      newUrl = url;
    } else if (url.includes("https://")) {
      newUrl = url;
    } else {
      newUrl = "https://" + url;
    }
    window.open(newUrl, "_blank");
  };

  changeDateRange = (startDate, endDate) => {
    this.setState({ startDate: startDate });
    this.setState({ endDate: endDate });
  };

  shopRightBar = () => {
    return (
      <ShopRightBar
        fetchUserPost={this.state.fetchUserPost}
        closeModel={() => {
          this.setState({ modal: false });
        }}
        dateRange={(startDate, endDate) => {
          this.changeDateRange(startDate, endDate);
        }}
        testUrl={this.testUrl}
        loading={this.state.loading}
        autoFocus={this.state.autoFocus}
        submitted={this.submitted}
        isSelectPost={this.state.selectPost}
        selectPost={this.selectPost}
        singlePost={this.state.singlePost}
        redirectedUrl={this.state.redirectedUrl}
        categories={this.state.categories}
        changeCategory={this.changeCategory}
        category={this.state.category}
        subCategory={this.state.subCategory}
        changeSubCategory={this.changeSubCategory}
        subCategories={this.state.subCategories}
        changePostType={this.changePostType}
        postType={this.state.postType}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        //  savePost={this.savePost}
        updatePost={(val1, val2) => {
          this.updatePost(val1, val2);
        }}
        media_id={this.state.media_id}
        deletePost={(deleteId) => {
          this.setState({ confirmModal: true });
          this.setState({ deleteId: deleteId });
        }}
        callBack={(e) => {
          this.setState({ redirectedUrl: e.target.value });
        }}
        updatedDate={this.state.updatedAt}
      ></ShopRightBar>
    );
  };

  render() {
    return (
      <div className="linkin-bio">
        <Row className="app_main_cont_ift main-container">
          <Col className="left-column" md="5" xs="12" xl="3">
            <TopBar
              username={this.state.username}
              url={this.state.url}
              copyToClipboard={this.copyToClipboard}
            />
            <MobilePreview
              postLoading={this.state.postLoading}
              pageName="Bio Shop"
              placeholder={placeholder}
              username={this.state.username}
              error={this.state.error}
              paneDidMount={this.paneDidMount}
              instagramPosts={this.state.instagramPosts}
              selectPost={this.selectPost}
            />
          </Col>
          <Col
            className={`right-bar bg-white ${
              !this.state.selectPost ? "no-padding" : ""
            } `}
            md="7"
            xs="12"
            xl="9"
          >
            <div
              className={`${
                !this.state.selectPost ? "show_ift_iframe show" : "hidden"
              }`}
            >
              {/* <iframe
                key={this.state.iframeKey}
                src={`${this.state.url + this.state.username}?iframe=yes`}
                title=""
                className="myshop-iframe"
              ></iframe> */}
              {this.state.username !== "" ? (
                <iframe
                  key={this.state.iframeKey}
                  src={`${this.state.url + this.state.username}?iframe=yes`}
                  title=""
                  className="myshop-iframe"
                ></iframe>
              ) : null}
            </div>

            <Row className="linked_edit_box">
              <Col xs="12" className="p-5">
                {this.shopRightBar()}
              </Col>
            </Row>
          </Col>
        </Row>
        {window.innerWidth <= 760 && (
          <Modal
            className="abcd"
            size="sm"
            isOpen={this.state.modal}
            toggle={() => this.toggle("modal")}
            centered
          >
            <ModalHeader toggle={() => this.toggle("modal")}>
              Edit Post
            </ModalHeader>
            <ModalBody className="bg-white">{this.shopRightBar()}</ModalBody>
          </Modal>
        )}

        <Modal
          isOpen={this.state.confirmModal}
          toggle={() => this.toggle("confirmModal")}
        >
          <ModalHeader toggle={() => this.toggle("confirmModal")}>
            Delete Post
          </ModalHeader>
          <ModalBody className="bg-white">
            Are You Sure You Want To Delete?
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="btn btn-primary"
              onClick={() => this.toggle("confirmModal")}
            >
              Close
            </Button>
            <Button
              color="primary"
              onClick={() => this.deletePost(this.state.deleteId)}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default LinkinBioShop;
