import React, { useEffect, useState, useRef, useMemo } from "react";
import * as sub from "../../../../actions/subCategory.action";
import { connect } from "react-redux";
import { Select } from "antd";
import Loader from "../../../../components/Loader";
const { Option } = Select;
let IdData = [];
let HandleSub = "";
let count = 0;
function SubCategories({
    getSubCategories,
    subcategories,
    subcategoryId,
    categoryData,
}) {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState("");
    const [handleIdSub, setSubId] = useState("");
   
    useEffect(() => {
        if (subcategoryId.autoFocus === true) {
            setData("");
            count = 0;
            setShow(false);
            HandleSub = subcategoryId.IdSub;
            IdData=[];

        }
        if (subcategoryId.autoFocus === false) {
            setData("");
            count = 0;
            setShow(false);
            HandleSub = "";
            IdData = subcategoryId.subCategoryId
            console.log(IdData,"IdData");
           
        }

    }, [subcategoryId]);

    useMemo(() => {


        if (subcategoryId.parentSubCategory.length > 0) {

            getSubCategories(subcategoryId.parentSubCategory)
                .then((res) => {
                    setShow(true);
                    setData(subcategoryId.IdSub);
                    setLoader(true);
                })
                .catch((res) => { });
        }

    }, [subcategoryId.media_id])
    useMemo(() => {


        if (subcategoryId.subCategoryId.length> 0) {

            getSubCategories(IdData)
                .then((res) => {
                    setShow(true);
                    setData("");
                    setLoader(true);
                })
                .catch((res) => { });
        }

    }, [subcategoryId])

    // useEffect(() => {
    //     ///For First Time Unlinked Post

    //     if (subcategoryId.subCategoryId != "" || subcategoryId.subCategoryId != []) {
    //         setLoader(false);
    //         getSubCategories(subcategoryId.subCategoryId)
    //             .then((res) => {
    //                 setShow(true);
    //                 setData("");
    //                 setLoader(true);
    //             })
    //             .catch((res) => { });
    //     } else {
    //         if (subcategoryId.parentSubCategory !=[]) {
    //             //Update Post

    //             fetch(subcategoryId.parentSubCategory);

    //         }

    //     }

    // }, [subcategoryId.parentSubCategory]);

    // const fetch = (Id) => {

    //     if (count == 0) {
    //                 getSubCategories(Id)
    //                     .then((res) => {
    //                         setShow(true);
    //                         setData(Id);
    //                         setLoader(true);
    //                     })
    //                     .catch((res) => { });
    //             }
    //             count++;   
    //    } 

    const changeCategory = (value) => {

        setData(value);
        categoryData(value);
        count = 0;
    };
    return (
        <></>
        // <div className="select-categories mt-3">
        //     {show ? (
        //         <>
        //             {loader ? (
        //                 <>
        //                     <label>Select Sub Category</label>

        //                     <Select
        //                         key={Date.now()}
        //                         value={data}
        //                         showSearch
        //                         style={{ width: "100%" }}
        //                         placeholder="Select Sub Category"
        //                         optionFilterProp="children"
        //                         clearable={false}
        //                         searchable={false}
        //                         required
        //                         onChange={changeCategory}
        //                         // onFocus={onFocus}
        //                         // onBlur={onBlur}
        //                         // onSearch={onSearch}
        //                         filterOption={(input, option) =>
        //                             option.children.toLowerCase().indexOf(input.toLowerCase()) >=
        //                             0
        //                         }
        //                     // disabled={
        //                     //     PermissionHelper.categoryCheck() || props.singleLoading
        //                     //         ? true
        //                     //         : false
        //                     // }
        //                     >
        //                         {subCategoriesData.map(({ value, label }, i) => (
        //                             <Option value={value}>{label}</Option>
        //                         ))}
        //                     </Select>
        //                 </>
        //             ) : (
        //                 <Loader />
        //             )}
        //         </>
        //     ) : (
        //         <h5>Select Category </h5>
        //     )}
        // </div>
    );
}

function mapStateToProps({ getSubCategories, subcategories }) {
    return {
        getSubCategories,
        subcategories,
    };
}

export default connect(mapStateToProps, { ...sub })(SubCategories);
