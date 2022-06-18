import React, { useEffect, useState, useRef } from "react";
import { Col, Button, Modal } from "react-bootstrap";
import Loader from "../../../../components/Loader/Loader";
import * as Promo from "../../../../actions/promoRequest";
// import { DatePicker } from "antd";
// import moment from "moment";
import { Select } from "antd";
// import numeral from "numeral";
import { toast } from "react-toastify";
// import AsyncSkuField from "./AsyncSkuField";
import Swal from "sweetalert2";
import { connect } from "react-redux";

const { Option } = Select;
// const { RangePicker } = DatePicker;
// const dateFormat = "YYYY-MM-DD";
let gb = [];
function ImageShop({
  getPromoRequest,
  promoRequest,
  PromoPayload,
  mediaUrl,
  selectPost,
  categoryList,
  promoList,
  promoLoading,
  Kbfee,
  imgData,
  children,
  category,
  skuOther,
  // setSource,
  source,
  updateProduct,
  obj,
  shopifyPromo,
}) {
  const [circles, setCircles] = useState([]);
  const [addImageModal, setAddImageModal] = useState(false);
  const [detailImageModal, setDetailImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [multiImage, setMultiImage] = useState([]);
  // const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // const [endDate, setEndDate] = useState(
  //   moment().add(1, "years").format("YYYY-MM-DD")
  // );
  const [loader, setLoader] = useState(true);
  const [ProductName, setProductName] = useState("");
  const [shopifyErr, setShopifyErr] = useState();
  // const [source, setSource] = useState("");
  const [ProductSku, setProductSku] = useState("");
  const [ProductUrl, setProductUrl] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productAmount, setProductAmount] = useState("");
  const [productCategory, setProductCategory] = useState([]);
  const [productPromoCodeDscs, setProductPromoCodeDscs] = useState("0%");
  const [productPromoCodePromo, setproductPromoCodePromo] = useState("KB0");
  const [submitData, setSubmitData] = useState([]);
  const [updateSubmitData, setUpdateSubmitData] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [skuData, setSkuData] = useState("");
  const [skuDataOther, setOtherSku] = useState();
  const [imgId, setImgId] = useState();
  const [flag, setFlag] = useState(false);
  const [flagsb, setFlagSb] = useState(false);
  // const [GetPromo, setgetPromo] = useState();

  // const [productSource, setProductSource] = useState("ecommerce");
  const [imageError, setImageError] = useState(false);

  const parentRef = useRef();
  const imgRef = useRef();
  let arr = [];
  let promoRequestCode = [];

  useEffect(() => {
    setImageFiles([]);
    setSubmitData([]);
    setMultiImage([]);
    setCircles([]);
    setSkuData("");
    setCoordinates("");
    setProductSku("");
    setUpdateSubmitData([]);
  }, [selectPost]);

  useEffect(() => {
    setLoader(false);
    getPromoRequest()
      .then((res) => {
        setLoader(true);
        setShopifyErr(res);
      })
      .catch((res) => {
        // setShopifyErr(false);
        // PromoPayload("",false)
      });
  }, []);

  useEffect(() => {
    imgData(submitData);
  }, [imgData]);

  if (loader == true) {
    promoRequestCode = promoRequest.message ? promoRequest.message : [];
  }

  useEffect(() => {
    if (category?.length >= 0) {
      setProductCategory(category);
    }
  }, [category]);

  useEffect(() => {
    if (children?.length !== 0) {
      childrenAttr();
      //   imgData(children);
    } else {
      setSubmitData([]);
      setCircles([]);
    }
  }, [children]);

  useEffect(() => {
    if (category?.length >= 0) {
      setProductCategory(category);
    }
  }, [category]);

  const childrenAttr = () => {
    let circles = [];
    children.map((item) => {
      let obj = item.coordinates[0];

      circles.push(obj);
    });
    setCircles(circles);
    setSubmitData(children);
  };

  const changePromoCode = (e, options, name, index) => {
    if (e === undefined) {
    } else {
      var values = e.value.split(" ");
      var discount = values[0];

      setProductPromoCodeDscs(discount);
      setproductPromoCodePromo(e.children);
    }
  };

  const onChangeInputImage = (e) => {
    e.preventDefault();
    const files = multiImage;
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      files.push({
        file: file,
        media_url: reader.result,
      });

      setImageFiles(files.reverse());
    };

    reader.readAsDataURL(file);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmitting = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let allData = [];
    let updateData = [];
    let updateMatched = {};
    let newAdd = {};
    let data = {};

    setDetailImageModal(false);

    if (source === "other") {
    } else {
      var media_url = imageFiles;
    }
    submitData.map((item) => {
      if (item.imgid === imgId) {
        let file = item.file ? item.file : "";
        let file_type = item.file_type ? item.file_type : "";
        let id = item.id;
        let coordinates = item.coordinates;
        let imgid = item.imgid;
        updateMatched = {
          ProductSku,
          skuDataOther,
          ProductName,
          productAmount,
          productDesc,
          ProductUrl,
          productCategory,
          productPromoCodePromo,
          productPromoCodeDscs,
          media_url,
          coordinates,
          file,
          file_type,
          imgid,
          id,
        };
        updateData.push(updateMatched);
      } else {
        updateData.push(item);
        setUpdateSubmitData(item);
      }
      setUpdateSubmitData(updateData);
    });

    setSubmitData(updateData);
    imgData(updateData);
    setImageFiles([]);
    setProductSku("");
    setProductName("");
    setOtherSku("");
    setproductPromoCodePromo("KB0");
    setProductPromoCodeDscs("0%");
    setProductUrl("");
    setProductAmount();
    setProductDesc("");
    setSkuData("");
    setImageError(false);
  };

  const clearImage = () => {
    setImageFiles([]);
    // setMultiImage(multiImage.slice(1));
  };
  const getSku = (sku, skuData) => {
    setProductSku(sku);
    setSkuData(skuData[0]._source);
    const productUrl =
      "https://" +
      skuData[0]._source?.domain +
      "/products/" +
      skuData[0]._source?.handle;
    const description = skuData[0]._source?.body_html
      ? skuData[0]._source?.body_html.replace(/<\/?[^>]+(>|$)/g, "")
      : "";
    setProductName(skuData[0]._source?.title);
    setProductAmount(skuData[0]._source?.variants[0]?.price);
    setProductUrl(productUrl);
    setProductDesc(description);
    setImageFiles(skuData[0]._source?.image?.src);
  };
  const copyToClipboard = (url) => {
    let textField = document.createElement("textarea");
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success("Copied to Clipboard!");
  };

  const style = {
    tagAreaMain: {
      // width: "290px",
      // height: "338px",
      position: "relative",
      // maxWidth: "100%",
      // backgroundColor: "lightblue",
    },
  };

  const alertImg = () => {
    Swal.fire({
      title: `Please Select Category `,
      icon: "warning",

      confirmButtonColor: "#010b40",

      confirmButtonText: `Ok`,
    });
  };

  const addCircle = (e) => {
    if (submitData.length < 3) {
      setFlag(true);
      setFlagSb(true);

      if (source) {
        // get click coordinates
        setAddImageModal(true);

        var pos_x = e.nativeEvent.offsetX;
        // ? e.offsetX
        // : e.pageX - imgRef.current.offsetLeft - 770;
        var pos_y = e.nativeEvent.offsetY;
        // ? e.offsetY
        // : e.pageY - imgRef.current.offsetTop - 190;

        // let pos_x_percent =
        //   (pos_x / parseInt(parentRef.current.style.width, 10)) * 100;
        // let pos_y_percent =
        //   (pos_y / parseInt(parentRef.current.style.height, 10)) * 100;
        let pos_x_percent = (pos_x / parentRef.current.clientWidth) * 100;
        let pos_y_percent = (pos_y / parentRef.current.clientHeight) * 100;

        // setCoordinates([
        //   ...coordinates,
        //   { x: `${pos_x_percent}%`, y: `${pos_y_percent}%` },
        // ]);
        setCoordinates([{ x: `${pos_x_percent}%`, y: `${pos_y_percent}%` }]);

        setCircles([
          ...circles,
          { x: `${pos_x_percent}%`, y: `${pos_y_percent}%` },
        ]);
      } else {
        toast.error("Please select source to add image");
      }
    } else {
      // setImageError("Only 3 image tag allowed")
      toast.error("Only 3 images allowed");
    }
  };

  const imgDelete = (id) => {
    Swal.fire({
      title: `Are you sure you want to remove this product?`,
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonColor: "#010b40",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        let imgFilter = submitData.filter(function (el) {
          return el.imgid !== id;
        });
        imgData(imgFilter);

        setSubmitData(imgFilter);

        let circles = [];
        imgFilter.map((item) => {
          let obj = item.coordinates[0];

          circles.push(obj);
        });
        setCircles(circles);
      }
    });
  };

  const ImageDetailModal = (data) => {
    return (
      <Modal
        show={detailImageModal}
        centered
        className="add-image-modal"
        animation={false}
        backdrop={true}
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Product Detail</Modal.Title>
          <button
            type="button"
            class="close"
            onClick={() => {
              setDetailImageModal(false);
            }}
          >
            <span aria-hidden="true">×</span>
            <span class="sr-only">Close</span>
          </button>
        </Modal.Header>

        <div className="mt-3 ml-4 mr-4">
          <div className=" row">
            <Col className="sku-image-box col-4">
              <div className="fileinput file-profile">
                <div className="fileinput-new mb-2">
                  {source === "other" ? (
                    <img
                      alt="sku-image"
                      src={data?.file}
                      className="sku-image popup-image"
                    />
                  ) : (
                    <img
                      alt="sku-image"
                      src={data?.media_url}
                      className="sku-image popup-image"
                    />
                  )}
                </div>
              </div>
            </Col>

            <Col className="col-8">
              <div class="row analytic-box mb-0 prod-box">
                {source !== "other" ? (
                  <div class="col-12 count-box">
                    <h5 class="count-title">SKU</h5>
                    <h3 class="count">{ProductSku} </h3>
                  </div>
                ) : (
                  <div class="col-12 count-box">
                    <h5 class="count-title">SKU</h5>
                    <h3 class="count">{skuDataOther} </h3>
                  </div>
                )}
                <div class="col-12 count-box">
                  <h5 class="count-title">Product Name </h5>
                  <h3 class="count">{ProductName} </h3>
                </div>

                <div class="col-12 count-box">
                  <h5 class="count-title">Price</h5>
                  <h3 class="count">${data?.productAmount} </h3>
                </div>

                {/* <div class="col-12 count-box">
                  <h5 class="count-title">Product SKU</h5>
                  <h3 class="count">{data?.skuDataOther} </h3>
                </div> */}
              </div>
              <div className="row">
                <div className="col-6 mt-3  mb-3">
                  <label>PromoCode</label>
                  <Select
                    size="small"
                    filterOption={(input, options) =>
                      options.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    //defaultValue={formState === "edit" ? form.getFieldValue().customerType : null}
                    //disabled={!(formState === "add" || formState === "edit")}
                    value={
                      productPromoCodePromo
                        ? productPromoCodePromo
                        : "Select PromoCode"
                    }
                    placeholder="KB0"
                    optionFilterProp="children"
                    className="w-100 campaign-promo-select height-45"
                    onChange={(options, e) => changePromoCode(e, options)}
                    showSearch
                    allowClear
                  >
                    {promoRequestCode?.lenght != 0 ? (
                      <>
                        {promoRequestCode.map((customer, key) => {
                          return (
                            <Option key={customer.promo_percent + " " + key}>
                              {customer.promo}
                            </Option>
                          );
                        })}
                      </>
                    ) : (
                      <> </>
                    )}
                  </Select>
                </div>

                <div className="col-6 mt-3 mb-3">
                  <label>Discount</label>
                  <div className="promo_discount form-control">
                    {productPromoCodeDscs}
                  </div>
                </div>
              </div>

              {/* <div class="col-12 count-box">
                  <h5 class="count-title">Product Description</h5>
                  <h3 class="count prod-desc">
                    {data?.productDesc
                      ? data?.productDesc.replace(/<\/?[^>]+(>|$)/g, "")
                      : ""}
                  </h3>
                </div> */}
              <div class="row">
                <div className="col-12 mb-3">
                  {imageLoading ? (
                    <Button>
                      <Loader />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="submit"
                      //    className="btn-block"
                      onClick={onSubmitting}
                      // disabled={this.state.imageFiles[0] === undefined ? true : false}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </div>
        </div>
      </Modal>
    );
  };

  const clickModal = (data) => {
    // setDetailImageModal(true);
    gb = data;

    //setAddImageModal(true);
    setDetailImageModal(true);
    gb = data;
    setImgId(gb.imgid);

    setProductSku(gb.ProductSku);
    setSkuData(gb);
    // // const productUrl =
    // //   "https://" +
    // //   skuData[0]._source?.domain +
    // //   "/products/" +
    // //   skuData[0]._source?.handle;
    const description = gb.productDesc
      ? gb.productDesc.replace(/<\/?[^>]+(>|$)/g, "")
      : "";
    setProductName(gb.ProductName);
    setProductAmount(gb.productAmount);
    setProductUrl(gb.ProductUrl);
    setOtherSku(gb.skuDataOther);
    setProductDesc(description);
    console.log(gb.skuDataOther, "_______");
    setImageFiles(gb.media_url);
    setProductCategory(gb.productCategory);
    setProductPromoCodeDscs(gb.productPromoCodeDscs);
    setproductPromoCodePromo(gb.productPromoCodePromo);
  };
  return (
    <>
      <div
        className="tag-area-main"
        style={style.tagAreaMain}
        ref={parentRef}
        id="tagImg"
      >
        {category?.length === 0 ? (
          <img
            onClick={(e) => alertImg(e)}
            ref={imgRef}
            src={mediaUrl}
            alt="media-image"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <img
            // onClick={(e) => addCircle(e)}
            ref={imgRef}
            src={mediaUrl}
            alt="media-image"
            // style={{ width: "100%", height: "100%" }}
          />
        )}
        {}
        {circles &&
          circles.map((item, i) => (
            <div
              key={i}
              className="tag-div-main"
              style={{ top: item.y, left: item.x }}
            >
              {i + 1}
            </div>
          ))}
      </div>

      <div className="row related-images">
        {submitData.map((item, index) => (
          <Col md={4}>
            <div className="inner-image-box">
              <span onClick={() => clickModal(item)} className="image_num">
                {index + 1}
              </span>
              {source === "other" ? (
                <img
                  alt="product-image"
                  src={`${item?.file}`}
                  key={index}
                  className="img1"
                  onClick={() => clickModal(item)}
                />
              ) : (
                <img
                  alt="product-image"
                  src={item.media_url}
                  key={index}
                  className="img1"
                  onClick={() => clickModal(item)}
                />
              )}
              {/* <span
                className="close"
                title="Remove"
                onClick={() => imgDelete(item.imgid)}
              >
                <span aria-hidden="true">×</span>
              </span> */}
            </div>
          </Col>
        ))}
      </div>

      {ImageDetailModal(gb)}
    </>
  );
}

function mapStateToProps({ getPromoRequest, promoRequest }) {
  return {
    getPromoRequest,
    promoRequest,
  };
}

export default connect(mapStateToProps, { ...Promo })(ImageShop);
