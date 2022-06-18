import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Col, Table } from "react-bootstrap";
import AffiliateDeposit from "./AffiliateDeposit";
import { connect } from "react-redux";
import * as affiliateDepositActions from "../../../actions/affiliateDeposit";
import numeral from "numeral";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";

function AffiliateBalance({
  getAffiliateCards,
  affiliateCards,
  makePayment,
  affiliatePayment,
  showBalance,
  affiliateBalance,
}) {
  const [deposit, setDeposit] = useState("");
  const [changeCard, setChangeCard] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    setCardLoading(true);
    getAffiliateCards().then(() => {
      setCardLoading(false);
    });
    makePayment().then((res) => {
      setPaymentLoading(false);
    });

    showBalance().then((res) => {});
  }, []);

  const paymentMethod = () => {
    if (affiliatePayment?.success == true) {
      let data = affiliatePayment?.message;
      window.open(data, "_self");
    } else {
    }
  };

  const depositAmount = async (e) => {
    e.preventDefault();
    if (amount === "") {
      setAmountError(true);
    } else {
      setDepositLoading(true);
      await axios
        .post(`/deposit/intent`, {
          payment_method_type: paymentType
            ? paymentType.split()
            : affiliateCards?.message?.data[0].type.split(),
          payment_method: changeCard
            ? changeCard
            : affiliateCards?.message?.data[0].id,
          amount: Number(amount),
        })
        .then((response) => {
          console.log(response.data.message, "response");
          toast.success(response.data.message);
          setDeposit(response.data.message);
          setAmount("");
          setDepositLoading(false);
          showBalance().then((res) => {});
        })
        .catch((err) => {
          console.log(err.response, "err");
          setDepositLoading(false);
        });
    }
  };
  function dataCardDetail() {
    let data = affiliateCards?.message?.data;
    if (data) {
      return (
        <>
          <form onSubmit={depositAmount}>
            <div className="amount-box">
              <h6>Enter Amount</h6>
              <div className="d-flex flex-row hashtag-box">
                <span className="input-group-text">$</span>
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountError(false);
                  }}
                  type="number"
                  name="name"
                  placeholder="Enter Amount"
                  className="form-control comment-field"
                  value={amount}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  autoComplete="off"
                />
              </div>
              {amountError && (
                <span className="text-danger deposit-error">
                  This field is required
                </span>
              )}
            </div>
            <div className="amount-box">
              <h6>Choose an existing deposit method</h6>
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
                        onChange={(e) => {
                          setChangeCard(e.target.value);
                          setPaymentType(item.type);
                        }}
                      />
                      <label for={item.id}>
                        <div className="pull-left">
                          <span className="card-name">{item.card.brand}</span>{" "}
                          ending in {item.card.last4}
                        </div>
                        <div className="text-right">
                          Expired: {item.card.exp_month}/{item.card.exp_year}
                        </div>
                      </label>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="amount-box pt-0">
              {depositLoading ? (
                <Button>
                  <Loader />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className=""
                  disabled={depositLoading ? true : false}
                >
                  Deposit
                </Button>
              )}
              <Button
                variant="primary"
                className=""
                onClick={() => paymentMethod()}
              >
                Add Card
              </Button>
            </div>
          </form>
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="brand_container_main container aff-payment">
          <h4 className="page-title">Balance</h4>
          <Row>
            <div className="col-md-4">
              <div className="conn-set-inner">
                <div className="affiliate-wallet">
                  <h5>Deposit</h5>
                  {affiliateBalance?.success == true ? (
                    <div className="aff-amount">
                      {numeral(
                        affiliateBalance?.message?.deposit_amount
                      ).format("$0,0.0'")}

                      {/* {affiliateBalance?.message?.current_balance.toFixed(2)} */}
                    </div>
                  ) : (
                    <div className="aff-amount">$0</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="conn-set-inner"
                style={{ backgroundColor: "#010b40 ", color: "white" }}
              >
                <div className="affiliate-wallet">
                  <h5 style={{ color: "white" }}>Balance</h5>
                  {affiliateBalance?.success == true ? (
                    <div className="aff-amount">
                      {numeral(
                        affiliateBalance?.message?.current_balance
                      ).format("$0,0.0'")}
                    </div>
                  ) : (
                    <div className="aff-amount">$0</div>
                  )}
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className="col-md-4">
              <div className="conn-set-inner">
                <div className="affiliate-wallet">
                  <h5>Net Sales</h5>
                  {affiliateBalance?.success == true ? (
                    <div className="aff-amount">
                      {numeral(affiliateBalance?.message?.total_sale).format(
                        "$0,0.0'"
                      )}
                    </div>
                  ) : (
                    <div className="aff-amount">$0</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="conn-set-inner">
                <div className="affiliate-wallet">
                  <h5>Commission Paid</h5>
                  {affiliateBalance?.success == true ? (
                    <div className="aff-amount">
                      {numeral(affiliateBalance?.message?.spent_amount).format(
                        "$0,0.0'"
                      )}
                    </div>
                  ) : (
                    <div className="aff-amount">$0</div>
                  )}
                </div>
              </div>
            </div>
          </Row>
          {/* <AffiliateDeposit config={config} /> */}
          <h4 className="page-title">Deposit</h4>
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
                        {/* <div className="amount-box">addcard</div> */}
                        <AffiliateDeposit />
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
function mapStateToProps({
  affiliateCards,
  affiliatePayment,
  affiliateBalance,
}) {
  return {
    affiliateCards,
    affiliatePayment,
    affiliateBalance,
  };
}
export default connect(mapStateToProps, { ...affiliateDepositActions })(
  AffiliateBalance
);
