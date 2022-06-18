import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import * as postAct from "../../../../actions/posts";
import InfiniteScroll from "react-infinite-scroller";

function PostGallery({ getPosts, posts, id, selectPost, clearPost }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPosts(1, null, clearPost).then(() => setLoading(false));
  }, []);

  useMemo(() => {
    if (id === "allPost") {
      setLoading(true);
      getPosts(1, null, clearPost).then(() => setLoading(false));
    }
    if (id && id !== "allPost") {
      setLoading(true);
      getPosts(1, id, clearPost).then(() => setLoading(false));
    }
  }, [id]);

  if (!loading) {
    return (
      <>
        {posts.data.length > 0 ? (
          <div className="post-box no-gutters">
            <InfiniteScroll
              pageStart={0}
              className="af-rm-mn row"
              loadMore={() =>
                //            alert('test')
                getPosts(posts.next?.page, id && id !== "allPost" ? id : null)
              }
              hasMore={posts.next?.page ? true : false}
              loader={
                <div className="col-md-12">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    <i
                      className="la la-spinner la-spin"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </div>
              }
              useWindow={false}
            >
              {posts.data.map((item, i) => (
                <div className="image-post-box-aff" key={i}>
                  <div className="image-post-box-aff-inr">
                    {item.linked ? (
                      <div style={styles.linked}>
                        LINKED{" "}
                        <span class="glyphicon glyphicon-link chain-icon"></span>
                      </div>
                    ) : null}

                    {/* <div style={{...styles.active,backgroundColor:item.active?"green":"red"}}/> */}
                    <div
                      onClick={() => {
                        if (!item.linked) selectPost(item.post_id);
                      }}
                      className={`image-post-box-aff-inr-inr ${
                        item.linked ? "" : ""
                      }`}
                    >
                      {item.media_type === "VIDEO" ? (
                        <video
                          id={`post-video-${item.post_id}`}
                          //autoPlay
                          controls
                          controlsList="nodownload"
                        >
                          <source
                            src={item.media_url + "#t=0.001"}
                            type="video/mp4"
                          ></source>
                        </video>
                      ) : (
                        <img
                          src={item.media_url}
                          alt="post-img"
                          className="post-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
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
        )}
      </>
    );
  } else {
    return (
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
    );
  }
}
const styles = {
  linked: {
    position: "absolute",
    zIndex: 1,
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(50, 59, 67, 0.5)",
    color: "white",
    fontSize: "0.80rem",
    padding: "0.16667rem 0.4rem",
    borderRadius: 2,
  },
  active: {
    position: "absolute",
    zIndex: 1,
    top: 5,
    right: 5,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
};
function mapStateToProps({ posts }) {
  return { posts };
}
export default connect(mapStateToProps, postAct)(PostGallery);
