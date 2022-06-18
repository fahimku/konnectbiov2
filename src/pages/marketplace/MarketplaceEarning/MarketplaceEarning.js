import React from "react";
import axios from "axios";
import { Button, Row, Col, Table } from "react-bootstrap";

function MarketplaceEarning() {
  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">Earning</h4>
        <div className="brand_container_main container aff-payment">
          <Row>
            <div className="col-md-4">
              <div className="conn-set-inner">
                <div className="affiliate-wallet">
                  <h5>Total Earning</h5>
                  <div className="aff-amount">$0</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="conn-set-inner">
                <div className="affiliate-wallet">
                  <h5>Pending Amount</h5>
                  <div className="aff-amount">$0</div>
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MarketplaceEarning;
