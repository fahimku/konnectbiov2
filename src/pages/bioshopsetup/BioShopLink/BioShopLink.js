import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as linkAct from "../../../actions/links";
import {
  sortableContainer,
  sortableElement,
  arrayMove,
} from "react-sortable-hoc";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { Row } from "react-bootstrap";
import "../bioshop.scss";

const SortableItem = sortableElement(({ value }) => (
  <li className="link-items col-md-12">{value.caption}</li>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <ul className="biolink-area row">{children}</ul>;
});
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
function BioShopLink({ getLinks, links }) {
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [linkPost, setLinkPost] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);

  useEffect(() => {
    getLinks(userInfo?.pid).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLinkPost(links);
  }, [links]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setLinkPost(arrayMove(linkPost, oldIndex, newIndex));
    setSort(true);
  };
  const sortBioShop = () => {
    Swal.fire({
      title: `Are you sure you want Save Links?`,

      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        setSortLoading(true);
        axios
          .post(`/users/revise/sortbioshoplinks`, { posts: linkPost })
          .then((response) => {
            setSortLoading(false);
            // toast.success(response.data.message);
            toast.success("Save Links Successfully");
          })
          .catch((err) => {
            // toast.error(err.response.data.message);
            toast.error("Something went wrong!!", {
              autoClose: false,
            });
            setSortLoading(false);
          });
      } else {
        setSortLoading(false);
      }
    });
  };

  return (
    <React.Fragment>
      <div className="bioshop_container_main bioshop-link">
        <Row className="bioshop-title">
          <div className="col-sm-6 col-6">
            <h4 className="page-title">
              BioShop Link
              <small class="text-muted ml-2">(Sort Links)</small>
            </h4>
          </div>
          <div className="col-sm-6 col-6 bioshopaction">
            <div className="syncbutton">
              <button
                id="sort-button"
                className={`btn btn-primary btn-sm ${
                  showTopBtn ? "icon-position" : ""
                }`}
                onClick={() => sortBioShop()}
                disabled={sortLoading || loading}
              >
                Save
              </button>
              {sortLoading && (
                <div class="sync_loading">
                  <span className="loading_text">
                    Please Wait
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span
                      class="spinner-grow spinner-grow-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </Row>

        {!loading ? (
          linkPost.length > 0 ? (
            <SortableContainer
              onSortEnd={onSortEnd}
              axis="xy"
              lockToContainerEdges={true}
              lockOffset="10%"
            >
              {linkPost.map((value, index) => (
                <SortableItem
                  key={`item-${value.post_id}`}
                  index={index}
                  value={value}
                />
              ))}
            </SortableContainer>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <h4>Not Found</h4>
            </div>
          )
        ) : (
          <>
            <div className="col-md-12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 5,
                  height: 300,
                }}
              >
                <i className="la la-spinner la-spin" style={{ fontSize: 40 }} />
              </div>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({ links }) {
  return { links };
}
export default connect(mapStateToProps, linkAct)(BioShopLink);
