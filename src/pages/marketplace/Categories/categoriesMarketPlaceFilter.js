import React, { useState, useEffect } from "react";
import Loader from "../../../components/Loader/Loader";
import { Row, Col, Button } from "react-bootstrap";
import Select from "react-select";

function CategoriesMarketPlaceFilter({}) {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const [status, setStatus] = useState({ value: "", label: "ALL" });
  const [sortBy, setSortBy] = useState({
    value: "date",
    label: "DATE",
  });
  const style = {
    control: (base) => ({
      ...base,
      height: "44px",
      boxShadow: "none",
      "&:hover": {
        // border: "1px solid black",
      },
    }),
  };

  useEffect(() => {}, []);

  const searchMarketPlace = (e) => {
    e.preventDefault();
    //  setSearchLoading(true);
    //  setLoading(true);
    //  setCurrentPage(0);
    //  e.preventDefault();
    //  getMarketPlace(
    //    1,
    //    limit,
    //    category.value,
    //    sortBy.value,
    //    orderBy.value,
    //    startDate,
    //    endDate,
    //    type,
    //    brand.value,
    //    "users/marketPlace/getCampaigns"
    //  ).then(
    //    function () {
    //      setLoading(false);
    //      setSearchLoading(false);
    //    },
    //    function (error) {
    //      setLoading(false);
    //      setSearchLoading(false);
    //      toast.error(error?.response?.data?.message);
    //    }
    //  );
  };

  const clearMarketPlace = (e) => {
    e.preventDefault();

    // let page = marketPlace.message.length === 1 ? currentPage : currentPage + 1;
    // if (page === 0) {
    //   page = 1;
    // }
    // setCurrentPage(page - 1);
    // setClearLoading(true);
    // setLoading(true);
    // setCategory({ value: "all", label: "ALL" });
    // setBrand({ value: "all", label: "ALL" });
    // setSortBy({ value: "date", label: "DATE" });
    // setOrderBy({ value: "desc", label: "DESC" });
    // // setCurrentPage();
    // setStartDate(fromDate);
    // setEndDate(toDate);
    // getMarketPlace(
    //   page,
    //   limit,
    //   "all",
    //   "date",
    //   "desc",
    //   fromDate,
    //   toDate,
    //   type,
    //   "all",
    //   "users/marketPlace/getCampaigns"
    // ).then(
    //   function () {
    //     setLoading(false);
    //     setSearchLoading(false);
    //     setClearLoading(false);
    //   },
    //   function (error) {
    //     setLoading(false);
    //     setSearchLoading(false);
    //     setClearLoading(false);
    //     toast.error(error?.response?.data?.message);
    //   }
    // );
  };
  const statusOptions = [
    { value: "new", label: "NEW" },
    { value: "approved", label: "APPROVED" },
    { value: "pending", label: "UNDER REVIEW" },
    { value: "reject", label: "DISAPPROVED" },
  ];
  const sortByOptions = [
    { value: "date", label: "DATE" },
    { value: "commission", label: "INFLUENCER COMMISSION" },
  ];

  return (
    <div className="filter_marketplace">
      <Row className="post-analytics-tab mb-4">
        <Col xs={12} xl={12} md={12}>
          <form onSubmit={searchMarketPlace}>
            <Row>
              <Col xs={12} xl={2} md={6}>
                <p>Status</p>
                <Select
                  value={status}
                  name="status"
                  className="selectCustomization"
                  options={statusOptions}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                  placeholder="Select Status"
                  styles={style}
                />
              </Col>

              <Col xs={12} xl={2} md={6}>
                <p>Sort By</p>
                <Select
                  value={sortBy}
                  name="sort"
                  className="selectCustomization"
                  options={sortByOptions}
                  onChange={(e) => {
                    setSortBy(e);
                  }}
                  placeholder="Sort By"
                  styles={style}
                />
              </Col>
              {/* <Col xs={12} xl={2} md={6}>
                    <p>Order By</p>
                    <Select
                      value={orderBy}
                      name="sort"
                      className="selectCustomization"
                      options={sortOrderOptions}
                      onChange={(e) => {
                        setOrderBy(e);
                      }}
                      placeholder="Order By"
                      styles={style}
                    />
                  </Col> */}
              <Col className="d-flex" xs={12} xl={2} md={6}>
                {searchLoading ? (
                  <Button type="button" variant="primary" className="fltr-hpr">
                    <Loader />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="fltr-hpr"
                    id="fltr-camp"
                    disabled={clearLoading ? true : false}
                  >
                    Search
                  </Button>
                )}
                {/* {clearLoading ? (
                  <Button variant="gray" className="fltr-hpr btn-primary">
                    <Loader />
                  </Button>
                ) : (
                  <Button
                    onClick={clearMarketPlace}
                    variant="gray"
                    className="fltr-hpr btn-primary"
                    id="fltr-reset"
                    disabled={searchLoading ? true : false}
                  >
                    Reset
                  </Button>
                )} */}
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </div>
  );
}
// function mapStateToProps({ getCatbrands, categoryById }) {
//   return { getCatbrands, categoryById };
// }
// export default connect(mapStateToProps, {
//   ...brandActions,
// })(CategoriesMarketPlaceFilter);

export default CategoriesMarketPlaceFilter;
