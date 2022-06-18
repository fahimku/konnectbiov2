import { Button } from "react-bootstrap";
import Loader from "../../../components/Loader/Loader";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

export default function ScreenButtons(props) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [userImage, setUserImage] = useState(
    userInfo?.menu[props.id]?.image_url
  );
  let menuId = props.id + 1;
  menuId = menuId + "" + menuId + "" + menuId + "" + menuId;

  useEffect(() => {
    if (props.setDefaultImage) {
      setUserImage(props.defaultImage);
    }
  }, [props.setDefaultImage]);

  useEffect(() => {
    if (props.cancelDefaultImage) {
      clearImage();
    }
  }, [props.cancelDefaultImage]);

  const onChangeInputImage = (e) => {
    if (e.target.files.length === 1) {
      if (
        e.target.files[0]?.type === "image/jpeg" ||
        e.target.files[0]?.type === "image/webp" ||
        e.target.files[0]?.type === "image/png" ||
        e.target.files[0]?.type === "image/svg+xml"
      ) {
        props.setImageDefault(true);
        const files = [];
        const reader = new FileReader();
        files.push(e.target.files[0]);
        reader.onloadend = () => {
          files[0].preview = reader.result;
          files[0].toUpload = true;
          setImageFiles(files);
          setDisabled(false);
        };
        reader.readAsDataURL(e.target.files[0]);
      } else {
        toast.error("We Only Support PNG, WEBP, Or JPG Image");
      }
    }
  };

  const uploadImage = async (e) => {
    setLoading(true);
    var formData = new FormData();
    formData.append("image", imageFiles[0]);
    formData.append("instagram_username", userInfo.username);
    formData.append("menu_id", menuId);
    await axios
      .put(`/users/revise/changeUserMenuImage/${userInfo.user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        let imageResponse = response.data;
        toast.success(imageResponse.message);
        // setImageFiles([]);
        const userInformation = localStorage.getItem("userInfo");
        const parseUserInformation = JSON.parse(userInformation);
        parseUserInformation.menu = imageResponse.data;
        const storeUserInformation = JSON.stringify(parseUserInformation);
        localStorage.setItem("userInfo", storeUserInformation);
        setDisabled(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const clearImage = () => {
    setImageFiles([]);
    setUserImage(userInfo.menu[props.id].image_url);
  };

  return (
    <div className="dp_cont">
      <span>
        {imageFiles.length > 0 && !props.setDefaultImage ? (
          <>
            {imageFiles.map((file, idx) => (
              <img
                alt="..."
                src={file.preview}
                key={`img-id-${idx.toString()}`}
                style={{ width: "76px", height: "76px" }}
                className="circle profile-icon"
              />
            ))}
            <strong>{props.name}</strong>
          </>
        ) : (
          <>
            <img
              style={{ width: "76px", height: "76px" }}
              className="circle profile-icon"
              alt="profile-icon"
              src={userImage}
            />
            <strong>{props.name}</strong>
          </>
        )}
      </span>

      <div className="dp_buttons">
        <input
          accept=".jpg, .jpeg, .png, .webp"
          onChange={(e) => onChangeInputImage(e)}
          id={`fileupload` + props.id}
          type="file"
          name={`file`}
          className="d-none"
        />
        <Button
          accept="image/*"
          type="file"
          color="default"
          className="select-image"
        >
          <label htmlFor={`fileupload` + props.id}>Change Image</label>
        </Button>
        {loading ? (
          <Button type="button" color="default" className="select-image">
            <Loader />
          </Button>
        ) : (
          <Button
            disabled={disabled}
            onClick={() => {
              uploadImage();
            }}
            type="button"
            color="default"
            className="select-image"
          >
            <label>Save</label>
          </Button>
        )}
        <Button
          onClick={() => {
            clearImage();
          }}
          type="button"
          color="default"
          className="select-image"
        >
          <label>Cancel</label>
        </Button>
      </div>
    </div>
  );
}
