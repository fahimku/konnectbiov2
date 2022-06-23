import React, { useEffect, useState, useMemo, useRef } from "react";
import { connect } from "react-redux";
import * as bioPostAct from "../../../../actions/bioPost";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import numeral from "numeral";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

let gb;
let children_item;
const userInfo = JSON.parse(localStorage.getItem("userInfo"))
function BioShopPostGallery({
  getNewBioPost,
  bioPosts,
  id,
  selectPost,
  clearNewBioPost,
  profileUser,
}) {
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState(false);
  const [circles, setCircles] = useState([]);
  const [singleItem, setSingleItem] = useState("");
  const [Pid, setPid] = useState("");
  const [nextSlide, setNextSlide] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [copy, setCopy] = useState(false);

  const caroselRef = useRef(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")).pid;
   
    getNewBioPost(1, null, clearNewBioPost, 18, userInfo).then(() =>
      setLoading(false)
    );
  }, []);

  useMemo(() => {
    if (id === "allPost") {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo")).pid;
      getNewBioPost(1, null, clearNewBioPost, 18,userInfo).then(() =>
        setLoading(false)
      );
    }
    if (id && id !== "allPost") {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo")).pid;
      getNewBioPost(1, id, clearNewBioPost, 18, userInfo).then(() =>
        setLoading(false)
      );
    }
  }, [id]);

  const childrenAttr = (children) => {
    let circles = [];
    children.map((item) => {
      let obj = item.coordinates[0];

      circles.push(obj);
    });
    setCircles(circles);
  };

  const clickModal = (data) => {
    setImageModal(true);
    setSingleItem(data);
    if (data?.children?.length !== 0) {
      childrenAttr(data?.children);
    } else {
      setCircles([]);
    }

    gb = data;
  };

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const discountPercent = (percent, actualAmount) => {
    let num = percent.replace(/[^0-9]/g, "");
    return ((num / 100) * actualAmount).toFixed(2);
  };

  const copyToClipboard = (url) => {
    let textField = document.createElement("textarea");
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    // setCopy("Copied!");
    setCopy(true);
  };

  const ImageModal = (item) => {
    children_item = item;

    if (item) {
      return (
        <Modal
          show={imageModal}
          // onHide={() => setAddImageModal(false)}
          centered
          className="bio-image-modal iframe-bio-image"
          animation={false}
          backdrop={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>{profileUser?.name}</Modal.Title>
            <button
              type="button"
              class="close"
              onClick={() => {
                setImageModal(false);
                setNextSlide(0);
              }}
            >
              <span aria-hidden="true">×</span>
              <span class="sr-only">Close</span>
            </button>
          </Modal.Header>
          <div className="image-inner-box">
            {item?.children.length !== 0 ? (
              <>
                <img
                  src={item.media_url}
                  alt="media_image"
                  className="image-inner-media"
                />

                {circles &&
                  circles.map((item, i) => (
                    <div
                      onClick={() => {
                        setNextSlide(i);
                        caroselRef.current.goToSlide(i, true);
                      }}
                      key={i}
                      className={`tag-div-main ${
                        nextSlide === i ? "active-circle" : ""
                      }`}
                      style={{ top: item.y, left: item.x }}
                    >
                      {i + 1}
                    </div>
                  ))}
              </>
            ) : (
              <Link
                to={{
                  pathname: item.redirected_url,
                }}
                target="_blank"
                className="image_link"
              >
                <img
                  src={item.media_url}
                  alt="media_image"
                  className="rounded image-inner-media"
                />
              </Link>
            )}
          </div>
          <Carousel
            responsive={responsive}
            swipeable={false}
            autoPlay={false}
            arrows={true}
            beforeChange={(nextSlide) => {
              setNextSlide(nextSlide);
            }}
            ref={caroselRef}
          >
            {item.children.map((item, index) => (
              <div className="inner-image-box row">
                <div className="col-4 space-grid-right">
                  <img
                    alt="product-image"
                    src={item.media_url}
                    key={index}
                    className="img1"
                  />
                </div>
                <div className="col-8 space-grid-left d-flex align-content-between flex-wrap">
                  <div className="prod-name">{item.ProductName}</div>

                  <div className="prod-sku mt-2">
                    <div className="prod-skunumber">
                      #
                      {item.ProductSku !== ""
                        ? item.ProductSku
                        : item.skuDataOther}
                    </div>

                    <div
                      className="prod-amount"
                      style={{
                        color: "green",
                        // fontWeight: 'bold',
                      }}
                    >
                      {" "}
                      {item?.productPromoCodePromo === "KB0"
                        ? `$${numeral(item?.productAmount).format("0.00")}`
                        : item?.productPromoCodeDscs?.includes("%")
                        ? `$${numeral(
                            item?.productAmount -
                              discountPercent(
                                item?.productPromoCodeDscs,
                                item?.productAmount
                              )
                          ).format("0.00")}  `
                        : `$${numeral(
                            item?.productAmount -
                              item?.productPromoCodeDscs.replace(/[^0-9]/g, "")
                          ).format("0.00")}  `}
                      {item?.productPromoCodePromo !== "KB0" && (
                        <div
                          style={{
                            color: "red",
                            textDecorationLine: "line-through",
                          }}
                          className="prod-discount"
                        >
                          ${numeral(item?.productAmount).format("0.00")}
                        </div>
                      )}
                    </div>

                    {/* <div className="prod-amount">${item.productAmount}</div> */}
                  </div>
                  <div className="prod-footer">
                    <div className="prod-shop">
                      <div
                        className="btn shop-button btn-block shop13"
                        onClick={() => {
                          setShowShare(true);
                          setCopy("");
                        }}
                      >
                        <i
                          class="fa fa-share-alt d-inline-block"
                          aria-hidden="true"
                        ></i>
                        Share
                      </div>
                    </div>
                    <div className="prod-shop">
                      <div className="btn shop-button btn-block shop13">
                        <i
                          class="fa fa-heart d-inline-block"
                          aria-hidden="true"
                        ></i>
                        Add To My List
                      </div>
                    </div>
                    <div
                      className="prod-shop"
                      // onMouseDown={(e) => {
                      //   if (e.nativeEvent.button === 1) {
                      //     postClick(
                      //       children_item.post_id,
                      //       username,
                      //       children_item.media_url,
                      //       children_item.media_type,
                      //       children_item.caption,
                      //       children_item.timestamp,
                      //       userId,
                      //       children_item.post_type,
                      //       isIframe,
                      //       children_item.media_id
                      //     );
                      //   }
                      // }}
                      // onClick={(ev) => {
                      //   postClick(
                      //     children_item.post_id,
                      //     username,
                      //     children_item.media_url,
                      //     children_item.media_type,
                      //     children_item.caption,
                      //     children_item.timestamp,
                      //     userId,
                      //     children_item.post_type,
                      //     isIframe,
                      //     children_item.media_id
                      //   );
                      // }}
                    >
                      <a
                        href={item.ProductUrl}
                        target="_blank"
                        className="btn shop-button btn-block shop13"
                      >
                        <i
                          class="fa fa-shopping-cart d-inline-block"
                          aria-hidden="true"
                        ></i>
                        Shop
                      </a>
                    </div>
                    <Modal
                      dialogClassName="bio-share-modal"
                      show={showShare}
                      onHide={() => {
                        setShowShare(false);
                        setCopy("");
                      }}
                      centered
                      backdropClassName="bio-share"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Share</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="your-copy-link">
                          <div className="item-a">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={item.ProductUrl}
                            >
                              {item.ProductUrl}
                            </a>
                          </div>
                          {copy ? (
                            <div disabled={copy} className="item-b copyied">
                              Copied
                            </div>
                          ) : (
                            <div
                              disabled={copy}
                              onClick={() =>
                                !copy ? copyToClipboard(item.ProductUrl) : null
                              }
                              className="item-b"
                            >
                              Copy
                            </div>
                          )}
                        </div>
                        {/* {copy && <div className="copy-error">{copy}</div>} */}
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </Modal>
      );
    }
  };

  if (!loading) {
    return (
      <>
        {bioPosts.data.length > 0 ? (
          <div className="post-box no-gutters affiliate-page">
            <InfiniteScroll
              pageStart={0}
              className="af-rm-mn row"
              loadMore={() =>
                //            alert('test')
                //getNewBioPost(1, null, clearNewBioPost, 18, userInfo)
                getNewBioPost(bioPosts.next?.page,id && id !== "allPost" ? id : null
                )
              }
              hasMore={bioPosts.next?.page ? true : false}
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
            
              {bioPosts.data.map((item, i) => (
                <div className="image-post-box-aff" key={i}>
                  <div className="image-post-box-aff-inr">
                    <div
                      onClick={() => clickModal(item)}
                      className={`image-post-box-aff-inr-inr ${
                        item.linked ? "" : ""
                      }`}
                    >
                      {item.media_type === "VIDEO" ? (
                        <video
                          id={`post-video-${item.post_id}`}
                          //autoPlay
                          controls
                          controlsList="nodownload"
                        >
                          <source
                            src={item.media_url + "#t=0.001"}
                            type="video/mp4"
                          ></source>
                        </video>
                      ) : (
                        <img
                          src={item.media_url}
                          alt="post-img"
                          className="post-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 100,
            }}
          >
            <h4>Not Found</h4>
          </div>
        )}
        {ImageModal(gb)}
      </>
    );
  } else {
    return (
      <div className="col-md-12">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 5,
            height: 300,
          }}
        >
          <i className="la la-spinner la-spin" style={{ fontSize: 40 }} />
        </div>
      </div>
    );
  }
}
const styles = {
  linked: {
    position: "absolute",
    zIndex: 1,
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(50, 59, 67, 0.5)",
    color: "white",
    fontSize: "0.80rem",
    padding: "0.16667rem 0.4rem",
    borderRadius: 2,
  },
  active: {
    position: "absolute",
    zIndex: 1,
    top: 5,
    right: 5,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
};
function mapStateToProps({ bioPosts }) {
  return { bioPosts };
}
export default connect(mapStateToProps, bioPostAct)(BioShopPostGallery);
