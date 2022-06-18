import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader/Loader";
import Select from "react-select";
import { Label, Input } from "reactstrap";

export default function BuySubscription({
  heading,
  name,
  subscribeServices,
  showInterval,
  changePlan,
  plan,
  unitAmount,
  monthly,
  yearly,
  usageLimit,
}) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [buySelected, setBuySelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleBuySelect = (e, options) => {
    setBuySelected(options);
  };

  const onsubmitBuy = async (e) => {
    e.preventDefault();
    setSubmit(true);
    if (!(Number(usageLimit) + Number(buySelected.value) > 21)) {
      if (buySelected.value) {
        setLoading(true);
        subscribeServices(buySelected.value, plan)
          .then((res) => {
            window.open(res.message, "_self");
            setLoading(false);
          })
          .catch((err) => {
            toast.error(err.response.message);
            setLoading(false);
          });
      }
    } else {
      toast.error("Limit Reached. (Maximum 21 Allowed)");
    }
  };

  const buyItem = [
    {
      value: "3",
      label: "3",
      isDisabled: Number(usageLimit) + 3 > 21 ? true : false,
    },
    {
      value: "6",
      label: "6",
      isDisabled: Number(usageLimit) + 6 > 21 ? true : false,
    },
    {
      value: "12",
      label: "12",
      isDisabled: Number(usageLimit) + 12 > 21 ? true : false,
    },
  ];
  // console.log(unitAmount, "unitAmount");
  // console.log(buySelected.value, "value");
  return (
    <>
      <form onSubmit={onsubmitBuy}>
        <p
          style={{
            color: "gray",
            borderBottom: "1px solid lightgray",
            paddingBottom: 10,
          }}
        >
          {heading}
        </p>
        <Row>
          <Col md={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <label>No. of {name}</label>
            </div>

            <Select
              name="category"
              className="selectCustomization"
              options={buyItem}
              value={buySelected}
              placeholder={`Select No. of ${name}`}
              onChange={(options, e) => handleBuySelect(e, options)}
            />
            {submit && !buySelected.value ? (
              <small className="help-block text-danger">Please select</small>
            ) : null}
          </Col>
          {userInfo.package.recurring_payment_type && buySelected.value ? (
            <Col md={12} className="mt-2 mb-1">
              Amount: ${unitAmount * buySelected.value} /{" "}
              {userInfo.package.recurring_payment_type}
            </Col>
          ) : null}
          {showInterval && buySelected.value ? (
            <Col md={12}>
              <div className="checkbox abc-checkbox abc-checkbox-primary mt-3">
                <Input
                  defaultChecked={plan === "Monthly" ? true : false}
                  name="payment"
                  value="Monthly"
                  className="mt-0"
                  id="checkbox1"
                  type="radio"
                  onChange={(e) => {
                    changePlan(e.target.value);
                  }}
                />{" "}
                <Label for="checkbox1" />
                Pay Monthly : ${monthly * buySelected.value} /month
              </div>
              <div className="checkbox abc-checkbox abc-checkbox-primary">
                <Input
                  defaultChecked={plan === "Yearly" ? true : false}
                  name="payment"
                  value="Yearly"
                  className="mt-0"
                  id="checkbox2"
                  type="radio"
                  onChange={(e) => {
                    changePlan(e.target.value);
                  }}
                />{" "}
                <Label for="checkbox2" />
                Pay Yearly : ${yearly * buySelected.value} /year
              </div>
            </Col>
          ) : null}
        </Row>

        <Row>
          <Col md={5} xl={12}>
            {loading ? (
              <Button variant="primary" className="category-btn btn-block mt-2">
                <Loader />
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                className="category-btn btn-block mt-4"
                id="mark-upgrade"
              >
                Upgrade {name}
              </Button>
            )}
          </Col>
        </Row>
      </form>
    </>
  );
}
