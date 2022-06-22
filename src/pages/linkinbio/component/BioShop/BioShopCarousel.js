import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import { NavLink } from "react-router-dom";
// import Post from "../../../../images/Post2.jpg";

class BioShopCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      active: this.props.page === "link" ? "links" : "allPost",
    };
  }

  render() {
    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 8,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 6,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 5,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 4,
      },
    };
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { userData } = this.props;

    return (
      <React.Fragment>
        <div className="header-fixed">
          <div className="header-box col-md-12">
            <img
              src={
                userData.profile_image_url === ""
                  ? "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTEiIGhlaWdodD0iMTQxIj48cmVjdCB3aWR0aD0iMTkxIiBoZWlnaHQ9IjE0MSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9Ijk1LjUiIHk9IjcwLjUiIHN0eWxlPSJmaWxsOiNhYWE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXNpemU6MTJweDtmb250LWZhbWlseTpBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4xOTF4MTQxPC90ZXh0Pjwvc3ZnPg=="
                  : userData.profile_image_url
              }
              width="65"
              height="65"
              className="rounded-circle header-image"
              alt={userData.name}
            />
            <span className="heading">{userData.name}</span>
          </div>
          {/* <div className="header-box col-md-12">
            <span className="new-heading">
              GET 10% OFF USING{" "}
              <a
                href="https://apps.apple.com/app/id1618762939"
                target="_blank"
                className="shop-btn"
              >
                KBSHOP
              </a>{" "}
              APP
            </span>
          </div> */}

          {userData?.promo && userData?.promo !== "KB0" ? (
            <div className="header-box col-md-12">
              <span className="sub-heading new-heading">
                GET {userData?.discount} OFF USING{" "}
                <a
                  href="https://apps.apple.com/app/id1618762939"
                  target="_blank"
                  className="shop-btn"
                >
                  KBSHOP
                </a>{" "}
                APP
              </span>
            </div>
          ) : null}
          {this.props.allCategory.length === 0 ? (
            <Carousel
              responsive={responsive}
              autoPlay={false}
              arrows={true}
              slidesToSlide={2}
              customTransition="transform 600ms ease-in-out"
              transitionDuration="600"
              partialVisible={true}
              className="main-carousel py-3 mb-2"
              itemClass="carousel-item-padding-40-px"
            >
              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "profile" });
                  // this.props.categoryFilter("allPost");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[0]?.image_url}
                    width="56px"
                    height="56px"
                    alt="profile"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "profile"
                        ? "aff-active-circle"
                        : null
                    }
                  >
                    Profile
                  </span>
                </button>
              </div>
              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "allPost" });
                  this.props.categoryFilter("allPost");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[1]?.image_url}
                    width="65px"
                    height="65px"
                    alt="logo"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "allPost"
                        ? "aff-active-circle"
                        : null
                    }
                  >
                    All
                  </span>
                </button>
              </div>

              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "links" });
                  // this.props.categoryFilter("links");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[1]?.image_url}
                    width="56px"
                    height="56px"
                    alt="logo"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "links" ? "aff-active-circle" : null
                    }
                  >
                    Links
                  </span>
                </button>
              </div>
            </Carousel>
          ) : (
            <Carousel
              responsive={responsive}
              autoPlay={false}
              arrows={true}
              slidesToSlide={2}
              customTransition="transform 600ms ease-in-out"
              transitionDuration="600"
              partialVisible={true}
              className="main-carousel py-3 mb-2"
              itemClass="carousel-item-padding-40-px"
            >
              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "profile" });
                  this.props.categoryFilter("profile");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[0]?.image_url}
                    width="56px"
                    height="56px"
                    alt="profile"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "profile"
                        ? "aff-active-circle"
                        : null
                    }
                  >
                    Profile
                  </span>
                </button>
              </div>
              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "allPost" });
                  this.props.categoryFilter("allPost");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[1]?.image_url}
                    width="56px"
                    height="56px"
                    alt="logo"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "allPost"
                        ? "aff-active-circle"
                        : null
                    }
                  >
                    All
                  </span>
                </button>
              </div>

              <div
                className="carousel-items"
                onClick={() => {
                  this.setState({ active: "links" });
                  this.props.categoryFilter("links");
                }}
              >
                <button className="btn-link">
                  <img
                    src={userInfo?.menu[1]?.image_url}
                    width="56px"
                    height="56px"
                    alt="logo"
                    className="circles"
                  />
                  <span
                    className={
                      this.state.active === "links" ? "aff-active-circle" : null
                    }
                  >
                    Links
                  </span>
                </button>
              </div>

              {this.props.allCategory.map((category, i) => (
                <div className="carousel-items" key={i}>
                  {/* <NavLink
                  to=""
                  onClick={() => this.categoryFilter}
                  key={i}
                  // to={`/${props.username}/post/${category.category_id}`}
                > */}
                  <button
                    onClick={() => {
                      this.setState({ active: category.category_id });
                      this.props.categoryFilter(category.category_id);
                    }}
                    className="btn-link"
                  >
                    <img
                      src={
                        category.image_url === ""
                          ? "https://via.placeholder.com/56"
                          : category.image_url
                      }
                      width="65px"
                      height="65px"
                      alt=""
                      className="circles"
                    />
                    <span
                      className={
                        this.state.active === category.category_id
                          ? "aff-active-circle"
                          : null
                      }
                    >
                      {category.category_name}
                    </span>
                  </button>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default BioShopCarousel;
