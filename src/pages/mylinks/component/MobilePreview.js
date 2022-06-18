import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const MobilePreview = ({
  placeholder,
  username,
  error,
  paneDidMount,
  myLinks,
  addNewLink,
  fetchSingleLink,
  style,
  pageName,
}) => {
  useEffect(() => {
    // Update the document title using the browser API
  }, [myLinks]);

  const links = [];
  if (myLinks) {
    for (let i = 0; i < myLinks.length; i++) {
      links.push(
        <Col key={i} xs="12">
          <div
            onClick={() => {
              if (!myLinks[i].post_id)
                addNewLink(myLinks[i].caption, myLinks[i].redirected_url);
              else fetchSingleLink(myLinks[i].post_id);
            }}
            className={style.links}
          >
            {myLinks[i].caption}
          </div>
        </Col>
      );
    }
  }
  return (
    <div className={`custome_link_main mobile-preview ` + style.myLinks}>
      <div className="mobile-header">
        {/* <img
          className="place-holder-image"
          src={placeholder}
          alt="placeholder"
        /> */}
        <span className="place-holder-name">{username}</span>
        <div className="page-name">{pageName}</div>
      </div>
      {error ? (
        <div className="error">
          {error.message}
          <br></br>
          <Link to="/connect">Connect Instagram</Link>
        </div>
      ) : (
        <div>
          <div
            className="visit-website"
            onClick={() => {
              addNewLink("", "");
            }}
          >
            Add a New Link
          </div>
          <div ref={paneDidMount} className="custome_link mobile-gallery">
            <Row>{links}</Row>
          </div>
        </div>
      )}
    </div>
  );
};
export default MobilePreview;
