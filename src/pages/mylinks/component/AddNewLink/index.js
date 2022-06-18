import React, {useRef, useEffect, useState} from "react";
import {Button} from "reactstrap";
import Loader from "../../../../components/Loader";
import InputValidation from "../../../../components/InputValidation";
import Formsy from "formsy-react";

const AddNewLink = (props) => {

  const [canSubmit, setCanSubmit] = useState(false);
  const formRef = useRef("LinkForm");

  useEffect(() => {
    if (props.updatePage)
      enableButton();
  }, [props.updatePage]);

  useEffect(() => {
    if (props.isDeleted) resetForm();
  }, [props.isDeleted]);

  function resetForm() {
    formRef.current.reset();
    setCanSubmit(false);
  }

  function disableButton() {
    setCanSubmit(true);
  }

  function enableButton() {
    setCanSubmit(false);
  }

  return (
    <>
      <div className={`image-edit-box ${props.isPreview ? "show" : "hidden"}`}>
        <span
          onClick={() => props.preview(false, "")}
          className="fa fa-times ift-cancel"
        ></span>
        <div className="image-box-info">
          <h4>
            Add New Link
          </h4>
        </div>
        <div className="c-links-wrapper">
          <Formsy.Form
            onValidSubmit={() => {
              if (props.updatePage) {
                props.updateLink();
                props.preview(false, "");
              } else {
                props.saveLink && props.saveLink();
                props.preview(false, "");
                resetForm();
              }
            }}
            ref={formRef}
            onValid={enableButton}
            onInvalid={disableButton}
          >
            <div className="image-edit-links">
              <div className="mt-3">
                <label>Title</label>
                <InputValidation
                  className=""
                  type="text"
                  id="basic"
                  name="basic"
                  required
                  value={props.title}
                  placeholder="Add A Link Title"
                  onChange={(evt) => {
                    props.titleChange(evt.target.value);
                  }}
                />
              </div>
              <div className="mt-3">
                <label>URL</label>
                <InputValidation
                  className=""
                  placeholder="Please Enter Website Address"
                  type="text"
                  id="website"
                  required
                  name="website"
                  trigger="change"
                  validations="isUrl"
                  validationError={{
                    isUrl: "This Value Should Be A Valid Url.",
                  }}
                  value={props.redirectedUrl}
                  onChange={(evt) => {
                    props.redirectedUrlChange(evt.target.value);
                  }}
                />
              </div>
              <div className="edit_button_main pane-button">
                {props.updatePage ? (
                  <>
                    {props.loading ? (
                      <Button>
                        <Loader />
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          color="primary"
                          className="custom_btns_ift"
                        >
                          &nbsp;&nbsp;Update&nbsp;&nbsp;
                        </Button>

                        <Button
                          disabled={canSubmit}
                          className="custom_btns_ift"
                          color="primary"
                          onClick={() => props.testUrl(props.redirectedUrl)}
                        >
                          &nbsp;&nbsp;Test&nbsp;&nbsp;
                        </Button>

                        <Button
                          className="custom_btns_ift"
                          color="primary"
                          onClick={() => {
                            props.preview(false, "");
                            props.closeModel();
                          }}
                        >
                          &nbsp;&nbsp;Cancel&nbsp;&nbsp;
                        </Button>

                        <Button
                          className="custom_btns_ift"
                          color="primary"
                          onClick={() => {
                            props.deleteLink();
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {props.loading ? (
                      <Button>
                        <Loader />
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          color="primary"
                          className="custom_btns_ift"
                        >
                          &nbsp;&nbsp;Save&nbsp;&nbsp;
                        </Button>

                        <Button
                          disabled={canSubmit}
                          className="custom_btns_ift"
                          color="primary"
                          onClick={() => props.testUrl(props.redirectedUrl)}
                        >
                          &nbsp;&nbsp;Test&nbsp;&nbsp;
                        </Button>

                        <Button
                          className="custom_btns_ift"
                          color="primary"
                          onClick={() => {
                            props.preview(false, "");
                            props.closeModel();
                          }}
                        >
                          &nbsp;&nbsp;Cancel&nbsp;&nbsp;
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Formsy.Form>
        </div>
      </div>
    </>
  );
};
export default AddNewLink;