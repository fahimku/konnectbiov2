import React from "react";
import { Button } from "react-bootstrap";
// import Select2 from "react-select";
// import Loader from "../../../components/Loader/Loader";
import { connect } from "react-redux";
import { getCampaignAnalytics } from "../../../actions/campaignAnalytics";

class AnalyticModal extends React.Component {
  state = {
    username: this.props.username,
  };

  componentDidMount() {
    this.props.dispatch(getCampaignAnalytics(this.props.affId));
  }

  render() {
    const { affId } = this.props;
    const { campaignAnalytics } = this.props;
    console.log(affId, "affId");
    console.log(this.props.campaignAnalytics, "affId");

    return (
      <React.Fragment>
        <div className="image-wrapper">
          {!campaignAnalytics.loading ? (
            // <Loader className="analytics-loading" size={60} />
            <h3>Coming Soon</h3>
          ) : (
            <div className="cam-data">data</div>
          )}
        </div>

        <div className="mt-4">
          <Button
            className="custom_btns_ift"
            color="primary"
            onClick={() => {
              this.props.analyticCloseModal();
            }}
          >
            &nbsp;Cancel&nbsp;
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
function mapStateToProps({ campaignAnalytics }) {
  return {
    campaignAnalytics: campaignAnalytics,
  };
}
export default connect(mapStateToProps)(AnalyticModal);
