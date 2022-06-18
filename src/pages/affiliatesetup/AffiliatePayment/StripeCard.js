import React, { useState } from "react";
import axios from "axios";
import { Row, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import "./payment.scss";

function StripeCard({ showEdit, setShowEdit }) {
  const [token, setToken] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  // const [showEdit, setShowEdit] = useState(false);

  const stripePromise = loadStripe(
    "pk_test_51KKN8wESMcKchi62cRYwS5o4v1hiIUYZVF4GQRbqcjj8FQ9su5vvWCq1sSbN11MDmBB3LIOCG36oXygjVq2S0GMT00t9ASYQfK"
  );

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async () => {
      // Block native form submission.

      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      // Use your card Element with other Stripe.js APIs

      const result = await stripe.createToken(cardElement);
      setSubmit(true);
      if (result.error) {
        console.log("[error]", result.error);
        toast.error(result.error.message);
      } else {
        // console.log("[PaymentMethod]", result.token.id);
        console.log("[PaymentMethod]", result);
        stripeTokenHandler(result.token);
      }
    };
    function stripeTokenHandler(token) {
      const paymentData = { token: token.id };

      const response = fetch("/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      // Return and display the result of the charge.
      console.log(response, "response");
      // return response.json();
    }
    const options = {
      iconStyle: "solid",
      hidePostalCode: true,
      style: {
        base: {
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    };
    const handleSubmit2 = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      const payload = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
      });
      if (payload.error) {
        console.log("[error]", payload.error);
        // setError(payload.error.message);
        toast.error(payload.error.message);
      } else {
        // console.log("[PaymentMethod]", result.token.id);
        console.log("[PaymentMethod]", payload);
        toast.success("Successfully");
        setShowEdit(false);
      }
    };

    return (
      <>
        {/* <div className="stripe-form-field">
          <CardElement options={options} />
        </div>
        <button
          disabled={!stripe}
          onClick={handleSubmit}
          className="btn btn-primary btn-block"
        >
          Make Payment
        </button> */}
        <form onSubmit={handleSubmit2} className="row">
          <label className="col-md-12">
            Card number
            <CardNumberElement
              options={options}
              // onReady={() => {
              //   console.log("CardNumberElement [ready]");
              // }}
              // onChange={(event) => {
              //   console.log("CardNumberElement [change]", event);
              //   setError(event.complete ? true : false);
              // }}
              // onBlur={() => {
              //   console.log("CardNumberElement [blur]");
              // }}
              // onFocus={() => {
              //   console.log("CardNumberElement [focus]");
              // }}
              // className="form-control"
            />
          </label>
          <label className="col-md-12">
            Expiration date
            <CardExpiryElement
              options={options}
              // onReady={() => {
              //   console.log("CardNumberElement [ready]");
              // }}
              // onChange={(event) => {
              //   console.log("CardNumberElement [change]", event);
              // }}
              // onBlur={() => {
              //   console.log("CardNumberElement [blur]");
              // }}
              // onFocus={() => {
              //   console.log("CardNumberElement [focus]");
              // }}
              // className="form-control"
            />
          </label>
          <label className="col-md-12">
            CVC
            <CardCvcElement
              options={options}
              // onReady={() => {
              //   console.log("CardNumberElement [ready]");
              // }}
              // onChange={(event) => {
              //   console.log("CardNumberElement [change]", event);
              // }}
              // onBlur={() => {
              //   console.log("CardNumberElement [blur]");
              // }}
              // onFocus={() => {
              //   console.log("CardNumberElement [focus]");
              // }}
              // className="form-control"
            />
          </label>
          {/* <label className="col-md-12 text-danger">{error}</label> */}
          <label className="col-md-12">
            <button
              type="submit"
              disabled={!stripe}
              className="btn btn-block btn-primary mt-2"
            >
              Save
            </button>
          </label>
        </form>
      </>
    );
  };

  return (
    <React.Fragment>
      <Modal
        className="addbio-modal"
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Card Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="stripe-card conn-set-inner"> */}
          <div className="stripe-card">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default StripeCard;
