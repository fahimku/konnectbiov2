import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Card, CardContent } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import * as instagramDataActions from "../../actions/instagramUserData";
import Loader from "../../components/Loader/Loader";
import InstagramPostDataComponent from "./InstagramPostDataComponent";
import Placeholder from "../../images/placeholder.svg";
import ConnectFb from "../connectToFb/connFb";

function AllPostDataComponent({ getInstagramUserData, instagramUserData }) {
  const [token, setToken] = useState("");
  const [fbPage, setFbpage] = useState("");
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).fb_token;
    const fbPage = JSON.parse(localStorage.getItem("userInfo")).page_token;
    setToken(token);
    setFbpage(fbPage);

    if (token !== "" && fbPage !== "") {
      getInstagramUserData();
    }
  }, []);
  const instagramData = instagramUserData.instagram_user;
  function intlFormat(num) {
    return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
  }
  function numberFormat(num) {
    if (num >= 1000000) return intlFormat(num / 1000000) + "M";
    if (num >= 1000) return intlFormat(num / 1000) + "k";
    return intlFormat(num);
  }
  if (token === "" && fbPage === "") {
    return <ConnectFb />;
  } else {
    return (
      <div className="all-nw-post container-fluid">
        <div class="post-instagram analytics-page mt-3">
          <h4 className="page-title">My Posts</h4>

          <>
            <Card
              sx={{ marginTop: 2, marginBottom: 2 }}
              className="card-shadow"
            >
              <CardContent>
                {instagramUserData.loading ? (
                  <Row>
                    <Col
                      xl={2}
                      lg={3}
                      sm={12}
                      className="d-flex flex-column justify-content-center align-items-center"
                    >
                      <Card
                        elevation={3}
                        sx={{ maxWidth: 200, borderRadius: "50%" }}
                      >
                        <img
                          style={{ width: "100%" }}
                          src={
                            instagramData.profile_picture_url
                              ? instagramData.profile_picture_url
                              : Placeholder
                          }
                        />
                      </Card>
                    </Col>
                    <Col
                      xl={10}
                      lg={9}
                      sm={12}
                      className="d-flex flex-column justify-content-center"
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ color: "gray", marginTop: 1 }}
                      >
                        <a
                          target="_blank"
                          href={`https://www.instagram.com/${instagramData.username}/`}
                          style={{ color: "gray" }}
                        >
                          {instagramData.username}
                        </a>
                      </Typography>
                      {/* <Paper variant='outlined'> */}
                      <div style={{ display: "flex" }}>
                        <Typography
                          variant="body"
                          sx={{
                            backgroundColor: "#e8e8e8",
                            padding: 1,
                            borderRadius: 1,
                            marginRight: 2,
                          }}
                        >
                          {numberFormat(instagramData.followers_count)}{" "}
                          Followers
                        </Typography>
                        <Typography
                          variant="body"
                          sx={{
                            backgroundColor: "#e8e8e8",
                            padding: 1,
                            borderRadius: 1,
                            marginRight: 2,
                          }}
                        >
                          {numberFormat(instagramData.follows_count)} Following
                        </Typography>
                        <Typography
                          variant="body"
                          sx={{
                            backgroundColor: "#e8e8e8",
                            padding: 1,
                            borderRadius: 1,
                            marginRight: 2,
                          }}
                        >
                          {numberFormat(instagramData.media_count)} Posts
                        </Typography>
                      </div>
                      <div className="mt-2">
                        <Typography variant="body" component="div" color="gray">
                          Biography:{" "}
                        </Typography>
                        <Typography variant="body" color="gray">
                          {instagramData.biography}
                        </Typography>
                      </div>
                      <div className="mt-2">
                        <Typography variant="body" component="div" color="gray">
                          Website:{" "}
                        </Typography>
                        <Typography
                          variant="body"
                          sx={{
                            color: "gray",
                            marginTop: 1,
                            textAlign: "center",
                          }}
                        >
                          <a target="_blank" href={instagramData.website}>
                            {instagramData.website?.slice(0, 40)}...
                          </a>
                        </Typography>
                      </div>
                      {/* </Paper> */}
                    </Col>
                  </Row>
                ) : (
                  <Loader size={30} />
                )}
              </CardContent>
            </Card>
            <InstagramPostDataComponent />
          </>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ instagramUserData }) {
  return {
    instagramUserData: instagramUserData,
  };
}
export default connect(mapStateToProps, { ...instagramDataActions })(
  AllPostDataComponent
);
