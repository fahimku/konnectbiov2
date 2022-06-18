import axios from "axios";
import React from "react";
import {
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { toast } from "react-toastify";
import placeholder from "../../images/placeholder.png";
import config from "../../config";
import TopBar from "../../components/Topbar";
import Loader from "../../components/Loader/Loader";
import MobilePreview from "./component/MobilePreview";
import AddNewLink from "./component/AddNewLink/index";
import style from "./MyLinks.module.scss";
import moment from "moment";

class MyLinks extends React.Component {

  constructor(props) {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let username = userInfo.username;
    let userId = userInfo.user_id;
    super(props);
    this.error = this.error.bind(this);
    this.state = {
      isDeleted: false,
      singlePostLoading: false,
      confirmModal: false,
      iframeKey: 0,
      loading: false,
      modal: false,
      updatePage: false,
      myLinks: [
        {
          redirected_url: "",
          caption: "Facebook",
        },
        {
          redirected_url: "",
          caption: "Twitter",
        },
        {
          redirected_url: "",
          caption: "Youtube",
        },
        {
          redirected_url: "",
          caption: "Instagram",
        },
        {
          redirected_url: "",
          caption: "Tik Tok",
        },
        {
          redirected_url: "",
          caption: "My Website",
        },
        {
          redirected_url: "",
          caption: "Custom 1",
        },
        {
          redirected_url: "",
          caption: "Custom 2",
        },
        {
          redirected_url: "",
          caption: "Custom 3",
        },
      ],
      title: "",
      redirectedUrl: "",
      timestamp: moment().format("YYYY-MM-DD"),
      singlePost: "",
      url: config.visitorURL + "/",
      nextPageUrl: "",
      username: username,
      preview: false,
      dropdownOpen: false,
      accordionFirst: [false, false, false],
      accordionSecond: [false, true, false],
      autoFocus: false,
      error: "",
      userId: userId,
    };
    this.titleChange = this.titleChange.bind(this);
    this.redirectedUrlChange = this.redirectedUrlChange.bind(this);
  }

  componentWillMount() {
    this.fetchMyLinks(this.state.username);
  }

  fetchMyLinks = async (username) => {
    await axios
      .get(`/posts/receive?user=${username}&post_type=link`)
      .then((response) => {
        const myLinks = [...this.state.myLinks, ...response.data.message];
        const uniqueMyLinks = [...new Map(myLinks.map((item) => [item["caption"], item])).values()];
        this.setState({ myLinks: uniqueMyLinks });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  titleChange = (value) => {
    this.setState({ title: value });
  };

  redirectedUrlChange = (value) => {
    this.setState({ redirectedUrl: value });
  };

  fetchSingleLink = async (linkId) => {
    this.setState({ singlePostLoading: true });
    await axios
      .get(`posts/retrieve/${linkId}?post_type=link`)
      .then((res) => {
        this.setState({ preview: true });
        this.setState({ title: res.data.message.caption });
        this.setState({ redirectedUrl: res.data.message.redirected_url });
        this.setState({ updatePage: true });
        this.setState({ linkId: linkId });
        this.setState({ modal: true });
        this.setState({ selectPost: true });
        this.setState({ singlePostLoading: false });
      })
      .catch((error) => {
        this.setState({ singlePostLoading: false });
        console.log(error);
      });
  };

  saveLink = async () => {
    this.setState({ loading: true });
    this.setState({ singlePostLoading: true });
    await axios
      .post("posts/reserve", {
        caption: this.state.title,
        redirected_url: this.state.redirectedUrl,
        username: this.state.username,
        timestamp: this.state.timestamp,
        post_type: "link",
        user_id: this.state.userId,
      })
      .then(() => {
        this.fetchMyLinks(this.state.username);
        toast.success("New Link Added");
        this.setState({ loading: false });
        this.setState({ singlePostLoading: false });
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
        this.setState({ loading: false });
        this.setState({ singlePostLoading: false });
      });
  };

  updateLink = async (id, title, redirectedUrl) => {
    this.setState({ singlePostLoading: true });
    this.setState({ loading: true });
    await axios.put(`posts/revise/${id}`, {
      caption: title,
      redirected_url: redirectedUrl,
      post_type: "link",
    })
      .then(() => {
        let data = this.state.myLinks;
        let objIndex = data.findIndex((obj) => obj.post_id === id);
        data[objIndex].caption = title;
        data[objIndex].redirected_url = redirectedUrl;
        this.setState({ data: data });
        toast.success("Link Updated");
        this.setState({ loading: false });
        this.setState({ singlePostLoading: false });
        // window.location.reload();
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.setState({ singlePostLoading: false });
      });
  };

  deleteLink = async (id) => {
    this.setState({ loading: true });
    this.setState({ isDeleted: true });
    this.setState({ singlePostLoading: true });
    await axios
      .delete(`posts/remove/${id}?post_type=link`)
      .then(() => {
        const myLinks = this.state.myLinks.filter(function (item) { return item.post_id !== id; });
        this.setState({ myLinks: myLinks })
        toast.success("Link removed successfully.");
        this.setState({ loading: false });
        this.setState({ confirmModal: false });
        this.setState({ singlePostLoading: false });
        this.preview(false, "");
        //        window.location.reload();
        //this.addNewLink();


      })
      .catch(() => {
        this.setState({ singlePostLoading: false });
        this.setState({ loading: false });
        this.setState({ confirmModal: false });
      });
  };

  paneDidMount = (node) => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll.bind(this));
    }
  };

  handleScroll = (event) => {
    let node = event.target;
    const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
    if (bottom) {
      if (this.state.nextPageUrl) {
        //    this.nextPagemyLinks(this.state.nextPageUrl, this.state.username);
      }
    }
  };

  toggle(id) {
    this.setState((prevState) => ({
      [id]: !prevState[id],
    }));
  }

  preview = (state, postIndex) => {
    this.toggle();
    this.setState({ preview: false });
    this.setState({ iframeKey: this.state.iframeKey + 1 });
    this.setState({ confirmModal: false });
  };

  error(error) {
    this.setState({ error: error });
  }

  addNewLink = (title, redirectedUrl) => {
    this.setState({ title: title });
    this.setState({ redirectedUrl: redirectedUrl });
    this.setState({ preview: true });
    this.setState({ updatePage: false });
    this.setState({ loading: false });
    this.setState({ modal: true });
    this.setState({ selectPost: true });
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

  testUrl = (url) => {
    window.open(url, "_blank");
  };

  addNewLinkShop = () => {
    return (
      <AddNewLink
        testUrl={this.testUrl}
        isDeleted={this.state.isDeleted}
        addNewLink={this.addNewLink}
        loading={this.state.loading}
        titleChange={this.titleChange}
        redirectedUrlChange={this.redirectedUrlChange}
        title={this.state.title}
        redirectedUrl={this.state.redirectedUrl}
        submitted={this.submitted}
        autoFocus={this.state.autoFocus}
        isPreview={this.state.preview}
        preview={this.preview}
        saveLink={this.saveLink}
        updatePage={this.state.updatePage}
        updateLink={() => {
          this.updateLink(
            this.state.linkId,
            this.state.title,
            this.state.redirectedUrl
          );
        }}
        deleteLink={() => {
          this.setState({ confirmModal: true });
        }}
        closeModel={() => {
          this.setState({ modal: false });
        }}
      ></AddNewLink>
    );
  };

  submitted = (e) => {
    e.preventDefault();
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
              style={style}
              pageName="My Links"
              addNewLink={this.addNewLink}
              placeholder={placeholder}
              username={this.state.username}
              error={this.state.error}
              paneDidMount={this.paneDidMount}
              myLinks={this.state.myLinks}
              fetchSingleLink={this.fetchSingleLink}
            />
          </Col>
          <Col
            className={`right-bar bg-white ${!this.state.preview ? "no-padding" : ""
              } `}
            md="7"
            xs="12"
            xl="9"
          >
            {this.state.singlePostLoading ? <Loader /> : <>
              <div className={`${!this.state.preview ? "show_ift_iframe" : "hidden"}`}>
                {this.state.username !== "" ? (
                  <iframe
                    key={this.state.iframeKey}
                    src={`${this.state.url + this.state.username
                      }/links?coupon=no&brand=no&iframe=yes&mypost=hide`}
                    title="mylinks"
                    className="myshop-iframe"
                  ></iframe>
                ) : null}
              </div>
              <Row>
                <Col xs="12" className="p-3">
                  {this.addNewLinkShop()}
                </Col>
              </Row>
            </>
            }
          </Col>
        </Row>
        {window.innerWidth <= 760 && (
          <Modal
            size="sm"
            isOpen={this.state.modal}
            toggle={() => this.toggle("modal")}
            centered
          >
            <ModalHeader toggle={() => this.toggle("modal")}>
              Edit Link
            </ModalHeader>
            <ModalBody className="bg-white">{this.addNewLinkShop()}</ModalBody>
          </Modal>
        )}
        <Modal
          isOpen={this.state.confirmModal}
          toggle={() => this.toggle("confirmModal")}
        >
          <ModalHeader toggle={() => this.toggle("confirmModal")}>
            Delete Link
          </ModalHeader>
          <ModalBody className="bg-white">
            Are you sure you want to delete?
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
              onClick={() => this.deleteLink(this.state.linkId)}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default MyLinks;