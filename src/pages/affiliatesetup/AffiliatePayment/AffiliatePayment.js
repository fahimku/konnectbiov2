import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row,Col, Button } from "react-bootstrap";
import "./payment.scss";
import * as affiliateDepositActions from "../../../actions/affiliateDeposit";
import { connect } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import AffiliateDeposit from "../../affiliate/AffiliateBalance/AffiliateDeposit";

function AffiliatePayment({
  getAffiliateCards,
  affiliateCards,
  makePayment,
  affiliatePayment,
}) {
  const [cardLoading, setCardLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // setCardLoading(true);
    getAffiliateCards().then(() => {
      setCardLoading(false);
    });
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

  function dataCardDetail() {
    let data = affiliateCards?.message?.data;
    if (data) {
      return (
        <>
          <div className="amount-box">
            <h6>Deposit Method</h6>
            {data.map((item, i) => {
              return (
                <>
                  <div className="deposit_card">
                    <input
                      type="radio"
                      name="card"
                      id={item.id}
                      class="infchecked"
                      value={item.id}
                      defaultChecked={i === 0 ? true : false}
                      // onChange={(e) => {
                      //   setChangeCard(e.target.value);
                      //   setPaymentType(item.type);
                      // }}
                    />
                    <label for={item.id}>
                      <div className="pull-left">
                        <span className="card-name">{item.card.brand}</span>{" "}
                        ending in {item.card.last4}
                      </div>
                      <div className="text-right">
                      <span className="card-expired"> Expired: {item.card.exp_month}/{item.card.exp_year}</span>
                      
                      <span className="fa fa-pencil edit-icon ml-2"></span>
                      
                      <span className="fa fa-trash ml-2"></span>
                      
                      </div>
                    </label>
                  </div>
                </>
              );
            })}
          </div>
          <div className="amount-box pt-0">
            <Button
              variant="primary"
              className=""
              onClick={() => paymentMethod()}
            >
              Add New Card
            </Button>
          </div>
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Payment Method</h4>
        <div className="brand_container_main container aff-payment">
          <Row>
            <div className="col-md-8">
              <div className="conn-set-inner">
                {cardLoading ? (
                  <div className="deposit_loader">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {affiliateCards?.is_payment_method ? (
                      <>{dataCardDetail()}</>
                    ) : (
                      <>
                        <AffiliateDeposit
                          affiliatePayment={affiliatePayment}
                          page="setup"
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({ affiliateCards, affiliatePayment }) {
  return {
    affiliateCards,
    affiliatePayment,
  };
}
export default connect(mapStateToProps, { ...affiliateDepositActions })(
  AffiliatePayment
);
