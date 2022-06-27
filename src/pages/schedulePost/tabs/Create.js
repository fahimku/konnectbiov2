import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import * as instaPostActions from "../../../actions/instaPost";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { ProgressBar } from "react-bootstrap";
function HashtagsList({ createMedia, title }) {
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [imgSize, setImgsize] = useState(false);
  const [bytesSize, setBytesize] = useState("");
  const [ImgMsg, setImgMsg] = useState("");
  const [flag, setFlag] = useState(false);

  const [fields, setFields] = useState({
    title: "",
    image: "",
  });

  function onCreate(e) {
    e.preventDefault();
    setSubmit(true);
    if (fields.title && fields.image) {
      setLoading(true);
      createMedia(fields).then(() => {
        toast.success("Media Upload Successfully");
        setLoading(false);
        setFields({
          title: "",
          image: "",
        });
        setSubmit(false);
      });
    }
  }
  function bytesToSize(bytes) {
    var sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    for (var i = 0; i < sizes.length; i++) {
      if (bytes <= 1024) {
        return bytes + " " + sizes[i];
      } else {
        bytes = parseFloat(bytes / 1024).toFixed(2);
      }
    }
    return bytes + " P";
  }
  const onSubmit = (files, allFiles) => {
    setSubmit(true);
    if (fields.title && fields.image) {
      setLoading(true);
      createMedia(fields).then(() => {
        toast.success("Successfully Created");
        setLoading(false);
        files.forEach((f) => f.remove());
        setFields({
          title: "",
          image: "",
        });
        setSubmit(false);
      });
    }
  };
  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  const onFileChange = ({ file }) => {
    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif" ||
      file.type === "image/svg+xml"
    ) {
      setFields({
        ...fields,
        image: file,
      });
    } else {
      toast.error("We Only Support PNG, GIF, Or JPG Image");
    }
  };
  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };

  const remove = (allFiles) => {
    // setFields({
    //   ...fields,
    //   image: allFiles.forEach((f) => f.remove()) === undefined ? "" : "",
    // });
    setFlag(false);
    setImgMsg("");
    setSubmit(false);
    setLoading(false);
    allFiles.forEach((f) => f.remove());
  };

  const Preview = ({ meta, files, file }) => {
    // const [first, ...rest] = bytesSize.split(" ");
    // var val = parseFloat(first);
    // var byte = rest[0];
    console.log(meta.size, "meta.size");

    const { name, percent, status, previewUrl, size } = meta;

    if (size > 2050000) {
      setFlag(true);
      setImgsize(true);
      remove(files);
      setImgMsg("Your File Size Can Not Be Exceed More Than 20 MB.");
    }
    if (size < 20500) {
      setFlag(true);
      setImgsize(true);
      remove(files);
      setImgMsg("Your File Size Can Not Be Less Than 20 KB.");
    }

    setPreviewLoading(status === "done" ? false : true);
    return (
      <>
        <div className="preview-box">
          <div className="pre-img-upload">
            <img src={previewUrl} />{" "}
          </div>

          <div className="pre-content-upload">
            <div className="glry-img-name">{name}</div>{" "}
            <div className="glry-img-size">{bytesToSize(size)}</div>
            {status !== "done" ? <span>Uploading</span> : "Done"}
            <div className="status">{status}</div>
            <div className="pro-brar-ift">
              {flag === false ? (
                <ProgressBar
                  animated
                  now={percent}
                  label={`${percent.toFixed(0)}%`}
                />
              ) : (
                <></>
              )}
              <span
                className="glyphicon glyphicon-remove"
                onClick={removeFile(files)}
              ></span>
              {/* {status !== "done" && (
              <div className="percent"> ({Math.round(percent)}%)</div>
            )} */}
            </div>
          </div>
        </div>
      </>
    );
  };
  const removeFile = (allFiles) => () => {
    // setFields({
    //   ...fields,
    //   image: allFiles.forEach((f) => f.remove()) === undefined ? "" : "",
    // });
    setFlag(false);
    setImgMsg("");
    setSubmit(false);
    setLoading(false);
    allFiles.forEach((f) => f.remove());
  };
  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const textMsg = files.length > 0 ? "Upload Again" : "Browse Image";
    return (
      <>
        <div className="upload_area_2">
          <span class="pt-1 pb-4 glyphicon glyphicon-cloud-upload	fa-4x"></span>
          <h4>Drag & Drop Your Image Here</h4>
          <h4>Or</h4>
          {imgSize ? <h5 class="text-danger">{ImgMsg}</h5> : <></>}
          <label className="btn btn-primary mr-0 mb-0">
            {textMsg}
            <input
              style={{ display: "none" }}
              type="file"
              accept={accept}
              multiple={false}
              onChange={(e) => {
                getFilesFromEvent(e).then((chosenFiles) => {
                  onFiles(chosenFiles);
                });
              }}
            />
          </label>
        </div>
      </>
    );
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <h4 className="page-title">{title}</h4>

        <div className="brand_container_main container">
          <>
            <Row>
              <div className="profile_box_main col-md-8">
                <div className=" brand-section dash_block_profile dash_content_profile">
                  <div className="upload_area">
                    <h4>Upload Your Image</h4>
                    <p className="text-muted">
                      PNG, JPG, SVG & GIF Files Are Allowed
                    </p>
                  </div>
                  <div class="upload_area_3 form-group">
                    <input
                      type="text"
                      class="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Add Media Title"
                      onChange={(e) =>
                        setFields({ ...fields, title: e.target.value })
                      }
                      value={fields.title}
                    />
                    {submit && !fields.title ? (
                      <small style={{ color: "red" }}>
                        Please Fill Media Title
                      </small>
                    ) : null}
                  </div>
                  <Dropzone
                    onSubmit={onSubmit}
                    onChangeStatus={onFileChange}
                    InputComponent={selectFileInput}
                    getUploadParams={fileParams}
                    getFilesFromEvent={getFilesFromEvent}
                    accept=".jpg, .jpeg, .png, .gif, .svg"
                    maxFiles={1}
                    multiple={false}
                    maxSizeBytes={2050000}
                    minSizeBytes={20500}
                    // inputContent="Drop A File"
                    addClassNames={{
                      dropzone: "drag-drop-ift",
                      submitButtonContainer: "upload_btn",
                    }}
                    PreviewComponent={Preview}
                    submitButtonContent={() =>
                      loading ? <Loader /> : "Upload"
                    }
                    submitButtonDisabled={loading}
                    styles={{
                      dropzoneActive: { borderColor: "green" },
                    }}
                  />
                  {submit && !fields.image ? (
                    <small style={{ color: "red" }}>Please Select Image</small>
                  ) : null}
                </div>
              </div>
            </Row>
          </>
        </div>
      </div>
      {/* <div className="container-fluid">
        <h4 className="page-title">{title}</h4>
        <div className="brand_container_main container">
          <Row>
            <div className="profile_box_main col-md-8">
              <div className="brand-section dash_block_profile">
                <div className="dash_content_profile">
                  <form onSubmit={onCreate}>
                    <Row>
                      <Col md={12}>
                        <div class="form-group">
                          <label for="exampleFormControlInput1">Caption</label>
                          <input
                            type="text"
                            class="form-control"
                            id="exampleFormControlInput1"
                            placeholder="caption"
                            onChange={(e) =>
                              setFields({ ...fields, title: e.target.value })
                            }
                            value={fields.title}
                          />
                          {submit && !fields.title ? (
                            <p style={{ color: "red" }}>Please fill.</p>
                          ) : null}
                        </div>
                        <div class="form-group">
                          <label for="exampleFormControlFile1">Media</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setFields({ ...fields, image: e.target.files[0] })
                            }
                            class="form-control-file"
                            id="exampleFormControlFile1"
                          />
                          {submit && !fields.image ? (
                            <p style={{ color: "red" }}>Please Select.</p>
                          ) : null}
                        </div>
                      </Col>
                      <Col>
                        {loading ? (
                          <Button
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              width: "15%",
                            }}
                            variant="primary"
                            className="btn-block"
                          >
                            <Loader />
                          </Button>
                        ) : (
                          <Button
                            style={{
                              width: "15%",
                            }}
                            variant="primary"
                            type="submit"
                            className="btn-block"
                          >
                            Create
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </form>
                </div>
              </div>
            </div>
          </Row>
        </div>
      </div> */}
    </React.Fragment>
  );
}
// function mapStateToProps({ hashtags }) {
//     return { hashtags };
// }
export default connect(null, instaPostActions)(HashtagsList);
