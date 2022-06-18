import React from "react";
import GallerySummaryComponent from "./GallerySummaryComponent";

class GalleryDashboard extends React.Component {
  state = {
    username: this.props.username,
  };

  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <h4 className="page-title">Dashboard</h4>
          <div className="brand_container_main container">
            <div className="row">
              <GallerySummaryComponent
                username={this.state.username}
                className="col-md-8"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default GalleryDashboard;
