import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import * as postAct from "../../../actions/bioshop";
import InfiniteScroll from "react-infinite-scroller";

const MobilePreview = ({
  placeholder,
  username,
  pageName,
  postLoading,
  getBioShop,
  bioshop,
  getSingleBioShop,
  showIframe,
  showEditModal,
  clearBioShop,
  clearSingleBioShop,
}) => {

  useEffect(() => {
    getSingleBioShop("", clearSingleBioShop);
    getBioShop(1, clearBioShop).then(() => {
      showIframe(true);
      showEditModal(false);
      getSingleBioShop("", clearSingleBioShop);
    });
  }, []);

  const instaPosts = [];
  if (bioshop) {
    for (let i = 0; i < bioshop.data.length; i++) {
      if (bioshop.data[i].media_type === "IMAGE" || bioshop.data[i].media_type === "CAROUSEL_ALBUM") {
        instaPosts.push(
          <Col key={i} xs="4">
            <div key={i} className="mobile-image-box">
              <div
                onClick={bioshop.data[i].post_type === "campaign" ? null
                  : () => {
                    getSingleBioShop(bioshop.data[i].post_id);
                    showIframe(false);
                    showEditModal(true);
                  }
                }
                className="mobile_box_inr"
              >
                <img className={bioshop.data[i].linked || bioshop.data[i].select? "linked": ""}
                  key={i}
                  id={"img" + i}
                  src={bioshop.data[i].media_url}
                  alt="bioshop"
                />
                {bioshop.data[i].linked &&
                  bioshop.data[i].post_type === "campaign" ? (
                  <span className="linked-label">CAMPAIGN</span>
                ) : bioshop.data[i].linked ? (
                  <span className="linked-label">LINKED</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>
        );
      }
      else {
        instaPosts.push(
          <Col
            key={i}
            xs="4"
            onClick={() => {
              getSingleBioShop(bioshop.data[i].media_id);
              showIframe(false);
              showEditModal(true);
            }}
          >
            <div className="mobile-image-box">
              <div className="mobile_box_inr">
                <video
                  oncontextmenu="return false;"
                  // id="myVideo"
                  // autoplay
                  controlsList="nodownload"
                  className={bioshop.data[i].linked || bioshop.data[i].select ? "linked"
                    : ""
                  }
                  key={i}
                  id={"img" + i}
                >
                  <source
                    src={bioshop.data[i].media_url}
                    type="video/mp4"
                  ></source>
                </video>
                <span
                  className="video-label fa fa-play"
                  aria-hidden="true"
                ></span>
                {bioshop.data[i].linked &&
                  bioshop.data[i].post_type === "campaign" ? (
                  <span className="linked-label">CAMPAIGN</span>
                ) : bioshop.data[i].linked ? (
                  <span className="linked-label">LINKED</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>
        );
      }
    }
  }

  if (!postLoading) {
    return (
      <div className="mobile-preview">
        <div className="mobile-header">
          <img
            className="place-holder-image"
            src={placeholder}
            alt="placeholder"
          />
          <span className="place-holder-name">{username}</span>
          <div className="page-name">{pageName}</div>
        </div>
        <div>
          <div id="scrollableDiv" className="mobile-gallery">
            <InfiniteScroll
              getScrollParent={() => document.getElementById("scrollableDiv")}
              pageStart={0}
              className="af-rm-mn row"
              loadMore={() => getBioShop(bioshop.next?.page)}
              hasMore={bioshop.next?.page ? true : false}
              threshold={5}
              loader={
                <div className="col-md-12">
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
                </div>
              }
              useWindow={false}
            >
              <Row>{instaPosts}</Row>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  } else {
    return "";
  }
};
function mapStateToProps({ bioshop }) {
  return { bioshop };
}
export default connect(mapStateToProps, postAct)(MobilePreview);