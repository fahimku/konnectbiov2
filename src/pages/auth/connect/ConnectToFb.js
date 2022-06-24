import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import SelectPages from "./SelectPages";

function ConnectToFb({ username, username1, setFbPageLocal, userId }) {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [insta, setInsta] = useState(0);
  const [complete, setComplete] = useState(false);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).fb_token;
    const fbPage = JSON.parse(localStorage.getItem("userInfo")).page_token;
    if (token) {
      setFacebookUserAccessToken(token);
      // console.log(fbPage);
      if (fbPage) {
        setSelectedPage(fbPage);
        setComplete(true);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const fbLogin = () => {
    const secret = "e930fa5b68d5d128c0eb3081dd003da1";
    const client = "296013448922683";
    const url = "https://get.konnect.bio";
    window.FB.login(
      (response) => {
        // console.log(response.authResponse?.accessToken, "        olddddddd");
        if (response.authResponse?.accessToken) {
          fetch(`https://graph.facebook.com/v12.0/oauth/access_token?  
                        grant_type=fb_exchange_token&          
                        client_id=${client}&
                        client_secret=${secret}&
                        fb_exchange_token=${response.authResponse?.accessToken}`)
            .then((res) => res.json())
            .then((json) => {
              setFacebookUserAccessToken(json.access_token);
              // localStorage.setItem('fbToken', json.access_token)
              axios
                .post("/social/fb/token/user", {
                  fbToken: json.access_token,
                })
                .then((res) => {
                  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
                  userInfo.fb_token = json.access_token;
                  localStorage.setItem("userInfo", JSON.stringify(userInfo));
                });
            });
        }
      },
      {
        // Scopes that allow us to publish content to Instagram
        scope:
          "pages_show_list, instagram_content_publish, pages_read_engagement, instagram_basic, instagram_manage_comments, instagram_manage_messages, instagram_manage_insights,pages_manage_metadata",
      }
    );
  };

  const getInstagramAccountId = (facebookPageId) => {
    setCheckLoading(true);
    axios
      .get(
        `https://graph.facebook.com/v12.0/${facebookPageId}?fields=instagram_business_account&access_token=${facebookUserAccessToken}`
      )
      .then((res) => {
        setInsta(res.data.instagram_business_account?.id);
        setCheckLoading(false);
      });
    // window.FB.api(
    //     facebookPageId,
    //     {
    //         access_token: facebookUserAccessToken,
    //         fields: "instagram_business_account",
    //     },
    //     (response) => {
    //         setInsta(response.instagram_business_account?.id);
    //         setCheckLoading(false)
    //     }
    // );
  };
  const getFacebookPages = () => {
    // console.log("ffff", facebookUserAccessToken);
    axios
      .get(
        `https://graph.facebook.com/v12.0/me/accounts?access_token=${facebookUserAccessToken}`
      )
      .then((res) => {
        setPages(res.data.data);
      });
    // window.FB.api(
    //     "me/accounts",
    //     { access_token: facebookUserAccessToken },
    //     (response) => {
    //         console.log("aaaa",response)
    //         // setPages(response.data);
    //     }
    // );
  };
  const pagesMemo = useMemo(() => {
    if (facebookUserAccessToken) {
      getFacebookPages();
    }
  }, [facebookUserAccessToken]);

  const idMemo = useMemo(() => {
    if (selectedPage) {
      // console.log("calling");
      getInstagramAccountId(selectedPage);
    }
  }, [selectedPage]);

  const logOutOfFB = () => {
    axios
      .put(`/users/revise/disconnectinstagram/${userId}`)
      .then((response) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("fbToken");
        localStorage.removeItem("fbPage");
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        userInfo.page_token = "";
        userInfo.fb_token = "";
        userInfo.access_token = "";
        userInfo.instagram_id = "";
        userInfo.username = "";
        setFacebookUserAccessToken("");
        setComplete("");
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        history.push("/connect");
        history.go(0);
      });
  };
  return (
    <div class="conn-set-inner">
      {facebookUserAccessToken && complete ? (
        <span className="connection-status-badge-green">Connected</span>
      ) : (
        <span className="connection-status-badge-red">Not Connected</span>
      )}
      <div class="con-set-inner-1">
        <div class="con-set-inner-2">
          <h5>Facebook Connection</h5>
          <div class="row">
            <div class="col-md-12">
              <div class="dp_fields-setup mb-3">
                <div class="category_count">Connection Status</div>
              </div>
              <div class="dp_fields-setup">
                {loading ? (
                  <p>...Loading</p>
                ) : facebookUserAccessToken ? (
                  !complete ? (
                    <SelectPages
                      selectedPage={selectedPage}
                      setSelectedPage={(pageId) => {
                        setSelectedPage(pageId);
                      }}
                      pages={pages}
                      insta={insta}
                      clear={setFacebookUserAccessToken}
                      next={() => {
                        setComplete(true);
                        axios
                          .post("/social/fb/token/page", {
                            fbPage: selectedPage,
                            instaId: insta,
                          })
                          .then(() => {
                            var obj = localStorage.getItem("userInfo");
                            var userInfo = JSON.parse(obj);

                            userInfo.page_token = selectedPage;
                            userInfo.instagram_id = insta;
                            localStorage.setItem(
                              "userInfo",
                              JSON.stringify(userInfo)
                            );
                          });
                        axios
                          .get(
                            `https://graph.facebook.com/${selectedPage}?fields=access_token&access_token=${facebookUserAccessToken}`
                          )
                          .then((res) => {
                            axios.post(
                              `https://graph.facebook.com/v12.0/${selectedPage}/subscribed_apps?subscribed_fields=feed&access_token=${res.data.access_token}`
                            );
                          });
                        // localStorage.setItem('fbPage', selectedPage)
                        setFbPageLocal(selectedPage);
                      }}
                      checkLoading={checkLoading}
                    />
                  ) : (
                    <div className="dp_fields-setup">
                      <div className="connected-text text-left mb-2">
                        Connected
                      </div>
                      <Button
                        variant="primary"
                        className="btn-block cat-right-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        Disconnect Facebook
                      </Button>
                    </div>
                  )
                ) : (
                  <>
                    {(username1 ? username1 : username) ? (
                      <div className="connected-text text-left mb-2 text-danger">
                        Not Connected
                      </div>
                    ) : null}
                    <Button
                      disabled={
                        (username1 ? username1 : username) ? false : true
                      }
                      onClick={fbLogin}
                      variant="primary"
                      className="btn-block cat-right-btn"
                    >
                      <i className="fa fa-facebook" />
                      &nbsp;&nbsp; Connect Facebook
                    </Button>
                  </>
                )}
              </div>
              <Modal
                show={modal}
                onHide={() => setModal(false)}
                className="change-password"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Disconnect Facebook and Instagram</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-white">
                  Are you sure you want to disconnect both facebook and
                  instagram accounts?
                  <span className="strong"></span> This will remove all your
                  content from our platform.
                  <p>This action is not reversible.</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={() => {
                      setModal(false);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    className="disconnect-btn"
                    onClick={() => {
                      logOutOfFB();
                    }}
                  >
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectToFb;

// <div className="profile_container_main container">
//     <div className="dash_block_profile">
//         <div className="dash_content_profile">
//             <h5>Advance Connection</h5>
//             <Row>
//                 <Col md={12}>
//                     <div className="dp_fields-setup mb-3">
//                         <div className="category_count">Connection Status</div>
//                     </div>
//                         {
//                             loading ? (
//                                 <p>...Loading</p>
//                             ) : (
//                                 facebookUserAccessToken ? (
//                                     !complete ? (
//                                         <SelectPages
//                                             selectedPage={selectedPage}
//                                             setSelectedPage={(pageId) => {
//                                                 setSelectedPage(pageId)
//                                             }}
//                                             pages={pages}
//                                             insta={insta}
//                                             next={() => {
//                                                 setComplete(true)
//                                                 localStorage.setItem('fbPage', selectedPage)
//                                             }}
//                                             checkLoading={checkLoading}
//                                         />
//                                     ) : (
//                                         <div className="dp_fields-setup">
//                                             <div className="connected-text text-left mb-2">
//                                                 Connected: @
//                                                 {"test"}
//                                             </div>
//                                             <Button
//                                                 variant="primary"
//                                                 className="btn-block cat-right-btn"
//                                                 onClick={() => {
//                                                     logOutOfFB()
//                                                 }}
//                                             >
//                                                 Disconnect facebook
//                                             </Button>
//                                         </div>
//                                     )
//                                 ) : (
//                                     <LoginModal
//                                         call={fbLogin}
//                                     />
//                                 )
//                             )
//                         }
//                     {/* <div className="dp_fields-setup">
//                         {false ? (
//                             <>
//                                 <div className="connected-text text-left mb-2">
//                                     Connected: @
//                                     {"test"}
//                                 </div>
//                                 <Button
//                                     variant="primary"
//                                     className="btn-block cat-right-btn"
//                                     onClick={() => {

//                                     }}
//                                 >
//                                     Disconnect facebook
//                                 </Button>
//                             </>
//                         ) : (
//                             <Button
//                                 onClick={() => {

//                                 }}
//                                 variant="primary"
//                                 className="btn-block cat-right-btn"
//                             >
//                                 <i className="fa fa-facebook-square" />
//                                 &nbsp;&nbsp; Connect facebook
//                             </Button>
//                         )}
//                     </div> */}
//                 </Col>
//             </Row>
//         </div>
//     </div>
// </div>
