import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as affiliateDepositActions from "../../../actions/affiliateDeposit";
import Loader from "../../../components/Loader/Loader";

function AffiliateDeposit({ makePayment, affiliatePayment, page }) {
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    setPaymentLoading(true);
    makePayment().then((res) => {
      setPaymentLoading(false);
    });
  }, []);

  const paymentMethod = () => {
    if (affiliatePayment?.success == true) {
      let data = affiliatePayment?.message;
      window.open(data, "_self");
    } else {
    }
  };

  return (
    <React.Fragment>
      {paymentLoading ? (
        <div className="deposit_loader">
          <Loader />
        </div>
      ) : (
        <div className="affiliate-wallet">
          {page === "setup" ? (
            <>
              <h5>Add New Card</h5>
              {/* <p>Make a deposit amount</p> */}
            </>
          ) : (
            <>
              <h5>Deposit Amount</h5>
              <p>Make a deposit amount</p>
            </>
          )}
          <button
            className="btn btn-primary btn-block"
            onClick={() => paymentMethod()}
          >
            {page === "setup" ? "Add New Card" : "Make Payment"}
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

function mapStateToProps({ affiliatePayment }) {
  return {
    affiliatePayment,
  };
}

export default connect(mapStateToProps, { ...affiliateDepositActions })(
  AffiliateDeposit
);
