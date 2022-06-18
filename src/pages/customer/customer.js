import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { connect } from "react-redux";
// import * as shopifyActions from "../../actions/shopifySetup";
// import axios from "axios";
import logo from "../../images/konnectbiologo.svg";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

function Customer() {
  // const [saveloading, setSaveLoading] = useState(false);
  useEffect(() => {
    console.log("dfd");
  }, []);

  return (
    <React.Fragment>
      <div className="login_header">
        <div className="header_inr group">
          <div className="header_inr_left">
            <div className="konnect_logo">
              <img className="logo" src={logo} alt="logo" />
            </div>
          </div>
          <div className="header_inr_right">
            <div className="create_account">
              <Button
                className="btn-connect"
                onClick={() => history.push("/logout")}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid pricing-table-ifti p-0 customer_page">
        <div class="container">
          <div class="row g-2 height d-flex justify-content-center align-items-center">
            <div class="col-md-6">
              <div class="text-center">
                <h3 class="title">Download App</h3>
                <div class="buttons mt-3">
                  <a
                    class="btn btn-dark app-button mb-3"
                    href="https://apps.apple.com/app/id1618762939"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i class="fa fa-apple fa-2x"></i>
                    <span class="ml-2">Apple store</span>
                  </a>{" "}
                  <a
                    class="btn btn-dark app-button"
                    href="https://play.google.com/store/apps/details?id=com.konnectbio1961"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i class="fa fa-play fa-2x"></i>
                    <span class="ml-2">Play Store</span>
                  </a>{" "}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="text-center">
                <img
                  src="https://i.imgur.com/ue3Oijg.png"
                  width="100%"
                  alt="mobile"
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
// function mapStateToProps({  }) {
//   return {  };
// }
export default Customer;
// export default connect(mapStateToProps, { ...shopifyActions })(Customer);
