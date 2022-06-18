import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import * as Promo from "../../../../actions/promoRequest";
import Loader from "../../../../components/Loader/Loader";

let data;
// let a = [];
// let promoCodes = [];
function ShopifyPromo({ getPromoRequest, promoRequest, PromoPayload }) {
  const [loader, setLoader] = useState(true);
  // const [Pcode, setPcode] = useState('');
  const [shopifyErr, setShopifyErr] = useState();

  useEffect(() => {
    setLoader(false);
    getPromoRequest()
      .then((res) => {
        setLoader(true);
        setShopifyErr(res);
      })
      .catch((res) => {
        setShopifyErr(false);
        PromoPayload("", false);
      });
  }, []);

  if (loader == true) {
    data = promoRequest.message;
    PromoPayload(data, shopifyErr);
  }

  return (
    <>
      {!loader ? (
        <Loader size="30" />
      ) : (
        <div className="row">
          {/* <div className="col-md-6 mt-3">
                    <div class="form-check">
                                 
                      
                      <input onChange={() => PromoPayload(data)} class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Shopify
                      </label>
                    </div>
                  </div> */}

          {/* <div className="col-md-6 mt-3">
                    <div class="form-check">
                                 
                      
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked/>
                      <label class="form-check-label" for="flexRadioDefault1">
                        Shopify
                      </label>
                    </div>
                  </div> */}
        </div>
      )}
    </>
  );
}

function mapStateToProps({ getPromoRequest, promoRequest }) {
  return {
    getPromoRequest,
    promoRequest,
  };
}

export default connect(mapStateToProps, { ...Promo })(ShopifyPromo);
