import React from "react";
import { Button } from "react-bootstrap";

const PaymentButton = (props) => {
  const userId = props.userId;
  const packageId = props.packageId;

  if (props.paymentMethod === "Micro Influencer" && props.plan === "Monthly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="micro_influencer_form_monthly"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />

          <input type="hidden" name="x_login" value="WSP-KONNE-j&AXMgDiJw" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="10" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395715661178193895"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-64fd415396556aa9dccc8fa17636ee46adeb88dd"
          />
          <input type="hidden" name="x_amount" value="10" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input type="hidden" name="button_code" value="Pay Now Influencer" />
        </form>
        <Button
          onClick={() => {
            document.getElementById("micro_influencer_form_monthly").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (
    props.paymentMethod === "Micro Influencer" &&
    props.plan === "Yearly"
  )
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="micro_influencer_form_yearly"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="96" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-PsjK0gDiRA" />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16360933072217852277"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-3b2c1b6bd72fe4f5aa52097adf8279ce0de6f80f"
          />
          <input type="hidden" name="x_amount" value="96" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Micro Influencer"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("micro_influencer_form_yearly").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod ==="61c02e2ff40bec74fac2ca09" && props.plan === "Monthly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="influencer_monthly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="25" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-j&AXMgDiJw" />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16418013572309673855"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-f035ab07aa7cb311499205efa08228fa0130a3e6"
          />
          <input type="hidden" name="x_amount" value="25" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input type="hidden" name="button_code" value="Pay Now Premium" />
        </form>
        <Button
          onClick={() => {
            document.getElementById("influencer_monthly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          className={props.btnClass}
          disabled={props.disableButton}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod ==="61c02e2ff40bec74fac2ca09" && props.plan === "Yearly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="influencer_yearly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="240" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-PsjK0gDiRA" />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16418014771681001000"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-d5f500a35464fa65fda08e9d3e9d3a633fb95d8e"
          />
          <input type="hidden" name="x_amount" value="240" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input type="hidden" name="button_code" value="Pay Now Premium" />
        </form>
        <Button
          onClick={() => {
            document.getElementById("influencer_yearly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          className={props.btnClass}
          disabled={props.disableButton}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod ==="61d695e9bccdaf69f46efc66" && props.plan === "Monthly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="premium_plus_monthly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="100" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-WfnZXgDjzg" />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="1641563190110405587"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-ab77531692af0f3452d7e33eae7077cc6c1140c3"
          />
          <input type="hidden" name="x_amount" value="100" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Premium Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("premium_plus_monthly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          className={props.btnClass}
          disabled={props.disableButton}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod ==="61d695e9bccdaf69f46efc66" && props.plan === "Yearly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="premium_plus_yearly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="1000" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-hl3QnQDjzw" />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16415636274179247125"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-3cf0d243ea4df72a2c5f2ec0104f5e0e9475abc4"
          />
          <input type="hidden" name="x_amount" value="1000" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Premium Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("premium_plus_yearly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          className={props.btnClass}
          disabled={props.disableButton}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (
    props.paymentMethod === "Influencer Plus" &&
    props.plan === "Monthly"
  )
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="influencer_plus_monthly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-o1gmRQDjQw" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="25" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395721241270037672"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-e3caad4141bfe3a8e965e0dd7eeee7974a93c0b9"
          />
          <input type="hidden" name="x_amount" value="25" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Influencer Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("influencer_plus_monthly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          disabled
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod === "Influencer Plus" && props.plan === "Yearly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="influencer-plus_yearly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-h28WCgDjRA" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="240" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="1639572233595821658"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-31e46765d17e531de24df5b33bc2a1f949c47e8d"
          />
          <input type="hidden" name="x_amount" value="240" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Influencer Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("influencer-plus_yearly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
          disabled
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod === "Business" && props.plan === "Monthly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="business_monthly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-b3XpvADicw" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="100" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395723893504459433"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-d0546a7303d41effcef4482ce2f53201356d95e1"
          />
          <input type="hidden" name="x_amount" value="100" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input type="hidden" name="button_code" value="Pay Now Business" />
        </form>
        <Button
          onClick={() => {
            document.getElementById("business_monthly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod === "Business" && props.plan === "Yearly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="business_yearly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input type="hidden" name="x_login" value="WSP-KONNE-WvNkbwDidA" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="960" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395724351978904691"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-50d3c7651bdd694b8b1a8606b9021875018d4b6c"
          />
          <input type="hidden" name="x_amount" value="960" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input type="hidden" name="button_code" value="Pay Now Business" />
        </form>
        <Button
          onClick={() => {
            document.getElementById("business_yearly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod === "Business Plus" && props.plan === "Monthly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="business_plus_monthly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-xHt90wDidQ" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="500" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-66-1635196"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395725124245231369"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-6861136169ffeb85a2037cb0f783c1c72dab5bc2"
          />
          <input type="hidden" name="x_amount" value="500" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Business Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("business_plus_monthly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else if (props.paymentMethod === "Business Plus" && props.plan === "Yearly")
    return (
      <>
        <form
          action="https://checkout.globalgatewaye4.firstdata.com/pay"
          id="business_plus_yearly_form"
          method="post"
        >
          <input type="hidden" name="x_user_id" value={userId} />
          <input type="hidden" name="x_package_id" value={packageId} />
          <input
            type="hidden"
            name="x_recurring_payment_type"
            value={props.plan}
          />
          <input type="hidden" name="x_login" value="WSP-KONNE-R2KueQDidg" />
          <input type="hidden" name="x_recurring_billing" value="TRUE" />
          <input name="x_recurring_billing_amount" value="4800" type="hidden" />
          <input
            name="x_recurring_billing_id"
            value="MB-KONNE-4-1635197"
            type="hidden"
          />
          <input type="hidden" name="x_show_form" value="PAYMENT_FORM" />
          <input
            type="hidden"
            name="x_fp_sequence"
            value="16395725531922611512"
          />
          <input
            type="hidden"
            name="x_fp_hash"
            value="PNB-1.0-8e86a1e787fb706ac5e251732b73af14781fd1e7"
          />
          <input type="hidden" name="x_amount" value="4800" />
          <input type="hidden" name="x_currency_code" value="USD" />
          <input type="hidden" name="x_test_request" value="FALSE" />
          <input type="hidden" name="x_relay_response" value="" />
          <input type="hidden" name="donation_prompt" value="" />
          <input
            type="hidden"
            name="button_code"
            value="Pay Now Business Plus"
          />
        </form>
        <Button
          onClick={() => {
            document.getElementById("business_plus_yearly_form").submit();
          }}
          variant={props.variant ? props.variant : "primary"}
        >
          {props.name ? props.name : "Make Payment"}
        </Button>
      </>
    );
  else return "";
};
export { PaymentButton };
