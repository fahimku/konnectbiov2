import React from "react";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import { ProgressBar } from "react-bootstrap";

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

const CreateDragDrop = () => {
  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  const onFileChange = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };
  const onSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove());
  };
  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };
  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const textMsg = files.length > 0 ? "Upload Again" : "Browse Image";
    return (
      <>
        <div className="upload_area">
          <h4>Upload your image</h4>
          
          <p className="text-muted">PNG, JPG and GIF files are allowed</p>
        </div>
        <div class="upload_area_3 form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Add Media Title"
          />
        </div>
        <div className="upload_area_2">
          <span class="pt-1 pb-4 glyphicon glyphicon-cloud-upload	fa-4x"></span>
          <h4>Drag & Drop your image here</h4>
          <h4>OR</h4>
          <label className="btn btn-primary mr-0 mb-0">
            {textMsg}
            <input
              style={{ display: "none" }}
              type="file"
              accept={accept}
              multiple
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
  const Preview = ({ meta, files }) => {
    const { name, percent, status, previewUrl, size } = meta;
    console.log(percent, "percent");
    return (
      <>
        <div className="upload_area">
          <h4>Upload your image</h4>
          <p className="text-muted">PNG, JPG and GIF files are allowed</p>
        </div>
        <div class="upload_area_3 form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Add Media Title"
          />
        </div>
        <div className="preview-box">
          <div className="pre-img-upload">
            <img src={previewUrl} />{" "}
          </div>

          <div className="pre-content-upload">
            <div className="glry-img-name">{name}</div>{" "}
            <div className="glry-img-size">{bytesToSize(size)}</div>
            <div className="status">{status}</div>
            <div className="pro-brar-ift">
              <ProgressBar
                animated
                now={percent}
                label={`${percent.toFixed(0)}%`}
              />
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
    allFiles.forEach((f) => f.remove());
  };

  return (
    <Dropzone
      onSubmit={onSubmit}
      onChangeStatus={onFileChange}
      InputComponent={selectFileInput}
      getUploadParams={fileParams}
      getFilesFromEvent={getFilesFromEvent}
      accept="image/*"
      maxFiles={1}
      inputContent="Drop A File"
      addClassNames={{ dropzone: "drag-drop-ift dash_content_profile" }}
      PreviewComponent={Preview}
      submitButtonContent="Create"
      styles={{
        dropzoneActive: { borderColor: "green" },
      }}
    />
  );
};
export default CreateDragDrop;
