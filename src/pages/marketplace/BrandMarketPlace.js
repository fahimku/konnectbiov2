import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Box from "./Box";
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import Loader from "../../components/Loader/Loader";
import { connect } from "react-redux";
import * as markActions from "../../actions/marketPlace";
import ReactPaginate from "react-paginate";
import moment from "moment";

function BrandMarketPlace({
  getMarketPlace,
  marketPlace,
  addCampaignToShop,
  type,
  brandId,
  catId,
  activateDeactivateCampaign,
}) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ value: "date", label: "DATE" });
  const [orderBy, setOrderBy] = useState({ value: "desc", label: "DESC" });
  const [currentPage, setCurrentPage] = useState(0);
  const fromDate = moment(new Date()).format("YYYY-MM-DD");
  const toDate = moment().add(1, "year").format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(fromDate);
  const [endDate, setEndDate] = useState(toDate);
  const limit = 8;

  useEffect(() => {
    setLoading(true);
    getMarketPlace(
      1,
      limit,
      catId,
      "date",
      "desc",
      startDate,
      endDate,
      type,
      brandId,
      "users/marketPlace/getCampaigns"
    ).then(function () {
      setLoading(false);
    });
    // // getBrands();
    // return () => {};
  }, []);

  const handlePageClick = (e) => {
    const page = e.selected;
    setCurrentPage(page);
    setLoading(true);
    getMarketPlace(
      page + 1,
      limit,
      catId,
      sortBy.value,
      orderBy.value,
      startDate,
      endDate,
      type,
      brandId,
      "users/marketPlace/getCampaigns"
    ).then(function () {
      setLoading(false);
    });
  };

  // if (!loading) {
  return (
    <>
      <div className="analytics-page affiliate-page linkin-bio">
        <div className="">
          {!loading ? (
            marketPlace?.message?.length > 0 ? (
              <>
                <Row className="post-analytics-tab-boxes-ift">
                  {marketPlace.message.map((item, index) => (
                    <Box
                      key={index}
                      userInfo={userInfo}
                      addCampaignToShop={addCampaignToShop}
                      activateDeactivateCampaign={activateDeactivateCampaign}
                      item={item}
                      index={index}
                    />
                  ))}
                </Row>
                <ReactPaginate
                  previousLabel=""
                  nextLabel=""
                  pageClassName="page-item "
                  pageLinkClassName="page-link custom-paginate-link btn btn-primary"
                  previousClassName="page-item"
                  previousLinkClassName="page-link custom-paginate-prev btn btn-primary"
                  nextClassName="page-item"
                  nextLinkClassName="page-link custom-paginate-next btn btn-primary"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  forcePage={currentPage}
                  pageCount={Math.ceil(marketPlace.totalCount / limit)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
                  onPageChange={handlePageClick}
                  containerClassName={
                    "pagination justify-content-center mt-2 custom-paginate"
                  }
                  // subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </>
            ) : (
              <NoDataFound />
            )
          ) : (
            <Loader size={40} />
          )}
        </div>
      </div>
    </>
  );
}
function mapStateToProps({ marketPlace }) {
  return {
    marketPlace,
  };
}
export default connect(mapStateToProps, {
  ...markActions,
})(BrandMarketPlace);
