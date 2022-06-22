import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import * as linkAct from "../../../../actions/links";
import { Link } from "react-router-dom";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
function BioShopLinks({ getLinks, links }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getLinks(userInfo?.pid).then(() => setLoading(false));
  }, []);

  return (
    <>
      {!loading ? (
        links.length > 0 ? (
          <div className="biolink-area">
            {links.map((item, index) => (
              <Link
                to={{
                  pathname: item.redirected_url,
                }}
                target="_blank"
                className="link-box btn btn-block"
              >
                {item.caption}
              </Link>
            ))}
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
            <h4>No Link Added</h4>
          </div>
        )
      ) : (
        <>
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
        </>
      )}
    </>
  );
}

function mapStateToProps({ links }) {
  return { links };
}
export default connect(mapStateToProps, linkAct)(BioShopLinks);
