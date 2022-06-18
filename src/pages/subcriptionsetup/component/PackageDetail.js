import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export default function PackageDetail({ packageToggleModal, singlePackage }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Platform Fee of 5% of earned commission will be charged.
    </Tooltip>
  );
  return (
    <>
      <div className="profile_box_main col-md-4 pkg_app_inner">
        <div className="custom_pkg">
          <h5>{singlePackage.package_name}</h5>
          <p>{singlePackage.package_description}</p>
          {/* <div className="pkg_price_ifti">
            <span className="pkg-trial">
              Try 14 days for free, no credit card information required.
            </span>
          </div> */}
          <ul className="pkg_detail_list_ift">
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Profile Page
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Social Links - Up to {singlePackage.link_count}
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              BIOSHOP with {singlePackage.category_count} Categories
            </li>

            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Affiliate Campaigns{" "}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <i className="fa fa-info pac-info"></i>
              </OverlayTrigger>
            </li>

            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Schedule Post
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Monitor Hashtags - Up to {singlePackage.hashtag_limit}
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Monitor Mention/Comment
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Monitor Competition Profiles - Up to {singlePackage.profile_limit}
            </li>
            <li>
              <span className="glyphicon glyphicon-menu-right"></span>
              Analytics
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
