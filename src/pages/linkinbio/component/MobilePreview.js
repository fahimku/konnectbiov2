import React from "react";
import { Row, Col } from "react-bootstrap";
import Loader from "../../../components/Loader/Loader";
import ConnectInstagram from "../../../pages/connectToInstagram/connInstagram";

const MobilePreview = ({
  placeholder,
  username,
  paneDidMount,
  instagramPosts,
  selectPost,
  pageName,
  postLoading,
  dropdown,
  accessToken,
}) => {
  const [videoIcon, setVideoIcon] = React.useState(false);

  function Pauseplay(e, id) {
    e.preventDefault();

    var testvideo = document.getElementById(id);

    if (testvideo.paused) {
      testvideo.play();
      setVideoIcon(true);
    } else {
      testvideo.pause();
      setVideoIcon(false);
    }
  }
  const instaPosts = [];
  if (instagramPosts) {
    for (let i = 0; i < instagramPosts.data.length; i++) {
      if (
        instagramPosts.data[i].media_type === "IMAGE" ||
        instagramPosts.data[i].media_type === "CAROUSEL_ALBUM"
      ) {
        instaPosts.push(
          <Col key={i} xs="4">
            <div className="mobile-image-box">
              <div
                onClick={
                  instagramPosts.data[i].post_type === "campaign"
                    ? null
                    : (ev) => selectPost(true, i)
                }
                className="mobile_box_inr"
              >
                <img
                  className={
                    instagramPosts.data[i].linked ||
                    instagramPosts.data[i].select
                      ? "linked"
                      : ""
                  }
                  key={i}
                  id={"img" + i}
                  src={instagramPosts.data[i].media_url}
                  alt="instagramPosts"
                />
                {instagramPosts.data[i].linked &&
                instagramPosts.data[i].post_type === "campaign" ? (
                  <span className="linked-label">CAMPAIGN</span>
                ) : instagramPosts.data[i].linked ? (
                  <span className="linked-label">
                    LINKED <span class="glyphicon glyphicon-link"></span>
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>
        );
      } else {
        instaPosts.push(
          <Col key={i} xs="4" onClick={(ev) => selectPost(true, i)}>
            <div className="mobile-image-box">
              <div className="mobile_box_inr">
                <video
                  // oncontextmenu="return false;"
                  // id="myVideo"
                  // autoplay
                  // controls
                  controlsList="nodownload"
                  className={
                    instagramPosts.data[i].linked ||
                    instagramPosts.data[i].select
                      ? "linked"
                      : ""
                  }
                  key={i}
                  id={"img" + i}
                >
                  <source
                    src={instagramPosts.data[i].media_url}
                    type="video/mp4"
                  ></source>
                </video>
                <span
                  className={`video-label fa fa-play`}
                  aria-hidden="true"
                  onClick={(e) => Pauseplay(e, "img" + i)}
                ></span>
                {instagramPosts.data[i].linked &&
                instagramPosts.data[i].post_type === "campaign" ? (
                  <span className="linked-label">CAMPAIGN</span>
                ) : instagramPosts.data[i].linked ? (
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
  return (
    <div className="mobile-preview">
      <div className="mobile-header">
        {dropdown == "instagram" ? (
          <>
            {/* <img
              className="place-holder-image"
              src={placeholder}
              alt="placeholder"
            /> */}
            <span className="place-holder-name">{username}</span>
          </>
        ) : (
          <span className="place-holder-name">Active Media Gallery</span>
        )}
        <div className="page-name">{pageName}</div>
      </div>
      <div>
        <div ref={paneDidMount} className="mobile-gallery">
          {postLoading ? (
            <Loader />
          ) : !accessToken && dropdown == "instagram" ? (
            <ConnectInstagram className={"coming_iner mobile-connectinsta"} />
          ) : instaPosts.length === 0 ? (
            <div class="no-data-found-mobile text-center">No Post Added</div>
          ) : (
            <Row>{instaPosts}</Row>
          )}
        </div>
      </div>
    </div>
  );
};
export default MobilePreview;
