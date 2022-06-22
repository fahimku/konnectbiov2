import React, { useEffect, useState } from "react";
import BioShopCarousel from "./BioShopCarousel";
import "./bioshop.css";
import BioShopPostGallery from "./BioShopPostGallery";
import * as catActions from "../../../../actions/category";
import * as userActions from "../../../../actions/userInfo";
import { connect } from "react-redux";
import BioShopProfile from "./BioShopProfile";
import BioShopLinks from "./BioShopLinks";

const PublicBioShop = ({ getUserCategories, getUserInfo, page }) => {
  const [allCategory, setAllCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState([]);
  const [id, setId] = useState(page === "link" ? "links" : "");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    setCategoryLoading(true);
    getUserCategories().then(
      function (res) {
        const myCategories = res;
        setCategoryLoading(false);
        setAllCategory(myCategories);
      },
      function (error) {
        setCategoryLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    getUserInfo().then(
      function (res) {
        setUserData(res.data);
      },
      function (error) {}
    );
  }, []);

  const categoryFilter = async (id) => {
    setId(id);
  };
  const selectPost = (postId) => {
    // fetchSinglePost(postId);
  };

  return (
    <div className="bioshop-fixed">
      <div className="bioshop-container">
        {!categoryLoading ? (
          <>
            <BioShopCarousel
              allCategory={allCategory}
              categoryFilter={categoryFilter}
              userData={userData}
              page={page}
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
            <i className="la la-spinner la-spin" style={{ fontSize: 40 }} />
          </div>
        )}
        {id === "profile" ? (
          <BioShopProfile profile={userData} />
        ) : id === "links" ? (
          <BioShopLinks />
        ) : (
          <BioShopPostGallery
            selectPost={selectPost}
            id={id}
            profileUser={userData}
          />
        )}
      </div>
    </div>
  );
};
function mapStateToProps({}) {
  return {};
}
export default connect(mapStateToProps, {
  ...catActions,
  ...userActions,
})(PublicBioShop);
