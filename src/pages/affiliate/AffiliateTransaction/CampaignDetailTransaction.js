// import React, { useEffect, useState } from "react";
// import { Row, Col, Button, Table, Modal } from "react-bootstrap";
// import * as affiliateTransactionsActions from "../../../actions/affiliateTransactions";
// import { connect } from "react-redux";
// import ReactPaginate from "react-paginate";
// import Loader from "../../../components/Loader/Loader";
// import Select from "react-select";
// import NoDataFound from "../../../components/NoDataFound/NoDataFound";
// import moment from "moment";
// import numeral from "numeral";

// function CampaignDetailTransaction({
//   campaignModal,
//   setCampaignModal,
//   detailLoading,
//   setDetailLoading,
//   campaignDetailTransactions,
//   campaignId,
//   getCampaignDetailTransactions,
// }) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [transactionModal, setTransactionModal] = useState(false);

//   const detailLimit = 12;
//   const handleDetailPageClick = (e) => {
//     const page = e.selected;
//     setCurrentPage(page);
//     setDetailLoading(true);
//     getCampaignDetailTransactions(campaignId.value, page + 1, detailLimit).then(
//       () => {
//         if (campaignDetailTransactions?.message?.data?.length > 0) {
//           setDetailLoading(false);
//         }
//       }
//     );
//   };
//   function dataDetailTable() {
//     let data = campaignDetailTransactions?.message?.data;
//     if (data) {
//       return (
//         <>
//           <Table responsive="sm" className="transactions-box">
//             <thead>
//               <tr>
//                 <th>Campaign</th>
//                 <th>Category </th>
//                 <th>Influencer </th>
//                 <th>Clicks</th>
//                 <th>Impressions</th>
//                 <th>CTR</th>
//                 <th>Spent</th>
//                 <th className="text-center">View</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, i) => {
//                 return (
//                   <tr key={i}>
//                     <td>{item?.campaign_name}</td>
//                     <td>{item?.c_category}</td>
//                     <td>
//                       <a
//                         href={`https://konnect.bio/${item?.instagram_username}`}
//                         target="_blank"
//                       >
//                         {item?.instagram_username}
//                       </a>
//                     </td>
//                     <td>{numeral(item?.clicks).format("0,0'")}</td>
//                     <td>{numeral(item?.impressions).format("0,0'")}</td>
//                     <td>{numeral(item?.ctr).format("0.00") + "%"}</td>
//                     <td>{numeral(item?.spent).format("$0,0.00'")}</td>
//                     <td className="text-center">
//                       <i
//                         role="button"
//                         onClick={() => {
//                           // setSingleData(item);
//                           setTransactionModal(true);
//                         }}
//                         className="fa fa-eye"
//                       ></i>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </>
//       );
//     }
//   }

//   return (
//     <React.Fragment>
//       <Modal
//         show={campaignModal}
//         // onHide={() => {
//         //   setCampaignModal(false);
//         // }}
//         className="campaign-detail-modal"
//         centered
//         // size="xl"
//         animation={false}
//         backdrop={true}
//         keyboard={false}
//         dialogClassName="modal-90w"
//       >
//         <Modal.Header>
//           <Modal.Title>Campaign Details</Modal.Title>
//           <button
//             type="button"
//             class="close"
//             onClick={() => {
//               setCampaignModal(false);
//             }}
//           >
//             <span aria-hidden="true">×</span>
//             <span class="sr-only">Close</span>
//           </button>
//         </Modal.Header>
//         <Modal.Body className="bg-white transection-detail aff-payment">
//           {detailLoading ? (
//             <Loader size="30" />
//           ) : (
//             <>
//               {campaignDetailTransactions?.message?.data?.length === 0 ? (
//                 <>
//                   <NoDataFound />
//                 </>
//               ) : (
//                 dataDetailTable()
//               )}
//             </>
//           )}
//           {campaignDetailTransactions?.message?.data?.length > 0 &&
//             !detailLoading && (
//               <Row>
//                 <ReactPaginate
//                   previousLabel=""
//                   nextLabel=""
//                   pageClassName="page-item "
//                   pageLinkClassName="page-link custom-paginate-link btn btn-primary"
//                   previousClassName="page-item"
//                   previousLinkClassName="page-link custom-paginate-prev btn btn-primary"
//                   nextClassName="page-item"
//                   nextLinkClassName="page-link custom-paginate-next btn btn-primary"
//                   breakLabel="..."
//                   breakClassName="page-item"
//                   breakLinkClassName="page-link"
//                   forcePage={currentPage}
//                   pageCount={Math.ceil(
//                     campaignDetailTransactions?.message?.total_records /
//                       detailLimit
//                   )}
//                   marginPagesDisplayed={2}
//                   pageRangeDisplayed={window.innerWidth <= 760 ? 1 : 7}
//                   onPageChange={handleDetailPageClick}
//                   containerClassName={
//                     "pagination justify-content-center mt-2 custom-paginate"
//                   }
//                   // subContainerClassName={"pages pagination"}
//                   activeClassName={"active"}
//                 />
//               </Row>
//             )}
//         </Modal.Body>
//       </Modal>

//       <Modal
//         show={transactionModal}
//         // onHide={() => {
//         //   setTransactionModal(false);
//         // }}
//         // className="change-password"
//         centered
//         className="campaign-detail-modal"
//         animation={false}
//         backdrop={true}
//         keyboard={false}
//         dialogClassName="modal-90w"
//       >
//         <Modal.Header>
//           <Modal.Title>Transaction Information</Modal.Title>
//           <button
//             type="button"
//             class="close"
//             onClick={() => {
//               setTransactionModal(false);
//             }}
//           >
//             <span aria-hidden="true">×</span>
//             <span class="sr-only">Close</span>
//           </button>
//         </Modal.Header>
//         <Modal.Body className="bg-white transection-detail">
//           <Row>
//             <Col xs={12} xl={6} md={6}>
//               <div class="card analytic-box analytics-page">
//                 <h5 className="mb-4">User Information</h5>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">Pixel ID</h5>
//                   <h3 class="count">{singleData?.user?.pixel_id}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">Username</h5>
//                   <h3 class="count">{singleData?.instagram_username}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">Email</h5>
//                   <h3 class="count">{singleData?.user?.email}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">Country</h5>
//                   <h3 class="count">{singleData?.user?.country}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">State</h5>
//                   <h3 class="count">{singleData?.user?.state}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">City</h5>
//                   <h3 class="count">{singleData?.user?.city}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">Gender</h5>
//                   <h3 class="count">{singleData?.user?.gender}</h3>
//                 </div>
//               </div>
//             </Col>
//             <Col xs={12} xl={6} md={6}>
//               <div class="card analytic-box analytics-page">
//                 <h5 className="mb-4">Campaign Information</h5>
//                 <div class="card-row row">
//                   <div class="any-post-img-col col-5">
//                     <div class="any-post-image">
//                       <div class="any-image-box">
//                         <div class="any-image-box-iner">
//                           <img
//                             src={singleData?.campaign?.media_url}
//                             class="img-fluid media-image"
//                             alt="IMAGE"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div class="col-7 analytic-caption">
//                     <div class="row count-main-box">
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Campaign Name</h5>
//                         <h3 class="count" title="Test 3">
//                           {singleData?.campaign?.campaign_name}
//                         </h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Campaign Type</h5>
//                         <h3 class="count">
//                           {singleData?.campaign?.campaign_type}
//                         </h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Category</h5>
//                         <h3 class="count">
//                           {singleData?.parent_category?.category_name}
//                         </h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Budget</h5>
//                         <h3 class="count">${singleData?.campaign?.budget}</h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Click Rate</h5>
//                         <h3 class="count">
//                           ${singleData?.campaign?.pay_per_hundred}
//                         </h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">Start Date</h5>
//                         <h3 class="count">
//                           {moment(singleData?.campaign?.start_date).format(
//                             "YYYY-MM-DD"
//                           )}
//                         </h3>
//                       </div>
//                       <div class="col-12 count-box">
//                         <h5 class="count-title">End Date</h5>
//                         <h3 class="count">
//                           {moment(singleData?.campaign?.end_date).format(
//                             "YYYY-MM-DD"
//                           )}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//             <Col xs={12} xl={6} md={6}>
//               <div class="card analytic-box analytics-page">
//                 <h5 className="mb-4">System Information</h5>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">IP Address</h5>
//                   <h3 class="count">{singleData?.ip_address}</h3>
//                 </div>
//                 <div class="col-12 count-box">
//                   <h5 class="count-title">User Agent</h5>
//                   <h3 class="count">{singleData?.user_agent?.substr(0, 50)}</h3>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Modal.Body>
//       </Modal>
//     </React.Fragment>
//   );
// }

// export default CampaignDetailTransaction;
