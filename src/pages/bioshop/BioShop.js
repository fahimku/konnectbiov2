import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Modal, ModalHeader, ModalBody } from "reactstrap";
import config from "../../config";
import placeholder from "../../images/placeholder.png";
import TopBar from "../../components/Topbar";
import MobilePreview from "./component/MobilePreview";
import ShopRightBar from "./component/ShopRightBar/index";

const BioShop = () => {

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo.user_id;
  const username = userInfo.username;
  const [iframeKey, setIframeKey] = useState(0);
  const [showIframe, setShowIframe] = useState(true);
  const [modal, setModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const url = config.visitorURL + "/";

  useEffect(() => {
    fetchCategories(userId);
  }, []);

  //Fetch Categories
  const fetchCategories = async (userId) => {
    await axios
      .get(`/users/receive/categories?id=${userId}`)
      .then((response) => {
        const selectCategories = [];
        const categories = response.data.message;
        categories.map(({ category_id, category_name }) => {
          selectCategories.push({ value: category_id, label: category_name });
        });
        setCategories(selectCategories);
      });
  };

  const shopRightBar = () => {
    return (
      <ShopRightBar
        key={1}
        categories={categories}
        showEditModal={(boolean) => {
          setModal(boolean);
        }}
        showIframe={(boolean) => {
          setShowIframe(boolean);
          setIframeKey((iframeCount) => iframeCount + 1);
        }}
      ></ShopRightBar>
    );
  };

  return (
    <div className="linkin-bio">
      <Row className="app_main_cont_ift main-container">
        <Col className="left-column" md="5" xs="12" xl="3">
          <TopBar username={username} url={url} />
          <MobilePreview
            pageName="Bio Shop"
            placeholder={placeholder}
            username={username}
            showIframe={(boolean) => {
              setShowIframe(boolean);
            }}
            showEditModal={(boolean) => {
              setModal(boolean);
            }}
          />
        </Col>
        <Col
          className={`right-bar bg-white ${showIframe ? "no-padding" : ""} `}
          md="7"
          xs="12"
          xl="9"
        >
          <div className={`${showIframe ? "show_ift_iframe show" : "hidden"}`}>
            {username !== "" ? (
              <iframe
                key={iframeKey}
                src={`${url + username}?iframe=yes`}
                title=""
                className="myshop-iframe"
              ></iframe>
            ) : null}
          </div>
          <Row className="linked_edit_box">
            <Col key={1} xs="12" className="p-5">
              {shopRightBar()}
            </Col>
          </Row>
        </Col>
      </Row>
      {window.innerWidth <= 760 && (
        <Modal
          toggle={() => setModal(false)}
          className="abcd"
          size="sm"
          isOpen={modal}
          centered
        >
          <ModalHeader toggle={() => setModal(false)}>Edit Post</ModalHeader>
          <ModalBody className="bg-white">{shopRightBar()}</ModalBody>
        </Modal>
      )}
    </div>
  );
};
export default BioShop;