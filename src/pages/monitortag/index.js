import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import Content from "./Content";
import UpgradeAccount from "../upgradeAccount/UpgradeAccount";
import SelectPages from "./SelectPages";
import ConnectFb from "../connectToFb/connFb"

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [insta, setInsta] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userInfo")).fb_token;
    const fbPage = JSON.parse(localStorage.getItem("userInfo")).page_token;
    if (token) {
      setFacebookUserAccessToken(token);
      // console.log(fbPage)
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
              var userInfo = JSON.parse(localStorage.getItem("userInfo"));
              userInfo.page_token = json.access_token;
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            });
        }
      },
      {
        // Scopes that allow us to publish content to Instagram
        scope: "instagram_basic,pages_show_list",
      }
    );
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
    //         setPages(response.data);
    //     }
    // );
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
    // setCheckLoading(true)
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

  const pagesMemo = useMemo(() => {
    if (facebookUserAccessToken) {
      getFacebookPages();
    }
  }, [facebookUserAccessToken]);

  const idMemo = useMemo(() => {
    if (selectedPage) {
      // console.log("calling")
      getInstagramAccountId(selectedPage);
    }
  }, [selectedPage]);

  const logOutOfFB = () => {
    localStorage.removeItem("fbPage");
    localStorage.removeItem("fbToken");
    setFacebookUserAccessToken("");
    setComplete("");
  };
  return (
    <div>
        {facebookUserAccessToken === '' && selectedPage === '' ?
        <ConnectFb/>
        :
        <>
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
            next={() => {
              setComplete(true);
              var userInfo = JSON.parse(localStorage.getItem("userInfo"));
              userInfo.page_token = selectedPage;
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            }}
            checkLoading={checkLoading}
          />
        ) : (
          <Content
            insta={insta}
            accessToken={facebookUserAccessToken}
            logOut={logOutOfFB}
          />
        )
      ) : (
        <UpgradeAccount />
      )}
      </>
}
    </div>
  );
}
