import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as postAct from "../../../actions/posts";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { Row } from "react-bootstrap";
import Select from "react-select";
import "../bioshop.scss";

const SortableItem = SortableElement((props) => {
  const { value: value } = props;

  return (
    <div className="image-post-box-aff" key={value.post_id}>
      <div className="image-post-box-aff-inr">
        <div className="image-post-box-aff-inr-inr">
          {value.media_type === "VIDEO" ? (
            <video
              id={`post-video-${value.post_id}`}
              //autoPlay
              controls
              controlsList="nodownload"
            >
              <source
                src={value.media_url + "#t=0.001"}
                type="video/mp4"
              ></source>
            </video>
          ) : (
            <img
              src={value.media_url}
              alt="post-img"
              className="post-image"
              style={{
                width: "100%",
                // height: "auto",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, ...restProps } = props;
  return (
    <div className="bioshop-area row">
      {items.map((item, index) => (
        <SortableItem
          key={`item-${item.post_id}`}
          index={index}
          value={item}
          {...restProps}
        />
      ))}
    </div>
  );
});

function BioShopPost({ getPosts, posts, id, selectPost, clearPost }) {
  const [sort, setSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savePost, setSavePost] = useState([]);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);
  const [bioShopLimit, setBioShopLimit] = useState({
    value: 100,
    label: "100",
  });

  useEffect(() => {
    getPosts(1, null, clearPost, 100).then(() => setLoading(false));
    document.body.classList.add("bioshop-body");
  }, []);

  useEffect(() => {
    setSavePost(posts.data);
  }, [posts]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 150) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setSavePost(arrayMove(savePost, oldIndex, newIndex));
    setSort(true);
  };
  const sortBioShop = () => {
    Swal.fire({
      title: `Are you sure you want Save BioShop?`,

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
          .post(`/users/revise/sortbioshopposts`, { posts: savePost })
          .then((response) => {
            setSortLoading(false);
            // toast.success(response.data.message);
            toast.success("Save BioShop Successfully");
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

  const bioshopOptions = [
    { value: 100, label: "100" },
    { value: 300, label: "300" },
    { value: 500, label: "500" },
  ];

  const handleBioShopLimit = (e, options) => {
    setLoading(true);
    setBioShopLimit(options);
    getPosts(1, null, clearPost, options.value).then(() => setLoading(false));
  };

  return (
    <React.Fragment>
      <div className="bioshop_container_main">
        <Row className="bioshop-title">
          <div className="col-sm-6 col-12">
            <h4 className="page-title">
              BioShop Post
              <small class="text-muted ml-2">(Sort Bioshop)</small>
            </h4>
          </div>
          <div className="col-sm-6 col-12 bioshopaction">
            <div className="bioshoplimit">
              <Select
                name="post"
                className="selectCustomization"
                options={bioshopOptions}
                placeholder="Select Bioshop"
                onChange={(options, e) => handleBioShopLimit(e, options)}
                value={{
                  value: bioShopLimit.value,
                  label: "Limit - " + bioShopLimit.label,
                }}
                isDisabled={
                  sortLoading || loading || posts.next?.page ? false : true
                }
              />
            </div>
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
        <Row>
          <div className="col-md-12">
            {!loading ? (
              savePost.length > 0 ? (
                <SortableList
                  // shouldUseDragHandle={true}
                  // useDragHandle
                  axis="xy"
                  items={savePost}
                  onSortEnd={onSortEnd}
                  lockToContainerEdges={true}
                  lockOffset="50%"
                  // distance={1}
                />
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
                    <i
                      className="la la-spinner la-spin"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Row>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({ posts }) {
  return { posts };
}
export default connect(mapStateToProps, postAct)(BioShopPost);
