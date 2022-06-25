import React, { useEffect, useState, useRef } from "react";
import * as sub from "../../../../actions/subCategory.action";
import { connect } from "react-redux";
import { Select } from "antd";
import Loader from "../../../../components/Loader";
const { Option } = Select;
var updateCategory = "";
var Categories = [];
let IdData = "";
let HandleSub = "";
function SubCategories({
    getSubCategories,
    subcategories,
    subcategoryId,
    categoryData
}) {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState('');
    const [handleIdSub, setSubId] = useState('');

  

    useEffect(() => {
        setData('')
        setShow(false)
        if (subcategoryId.autoFocus == true) {
            HandleSub = "";
        }
        else {
            HandleSub = subcategoryId.IdSub;
        }

    }, [subcategoryId])

    useEffect(() => {
        if (subcategoryId.subCategoryId != "") {
            setLoader(false);
            getSubCategories(subcategoryId.subCategoryId)
                .then((res) => {
                    setShow(true)
                    setData('')
                    setLoader(true);
                })
                .catch((res) => {
                });
        }
        else {
            if (HandleSub != "") {
              

                subcategoryId.categories.map((item) => {
                    if (item.value == subcategoryId.category) {
                        IdData = item.parentId;
                        getSubCategories(IdData)
                            .then((res) => {
                                setShow(true)
                                setData(subcategoryId.IdSub)
                                setLoader(true);
                            })
                            .catch((res) => {
                            });

                    }
                })


            }
        }


    }, [subcategoryId])






    //     useEffect(() => {


    // if(subcategoryId.category !=''){

    //     updateCategory = subcategoryId.category;
    // }
    //         if (subcategoryId.subCategoryId != '') {

    //             // id = subcategoryId.subCategoryId[0]
    //             // var subId = id.split(/[, ]+/).pop();

    //             setLoader(false);
    //             getSubCategories(subcategoryId.subCategoryId)
    //                 .then((res) => {
    //                     setLoader(true);
    //                 })
    //                 .catch((res) => {
    //                 });
    //         }
    //     }, [subcategoryId]);


    // useEffect(() =>{
    //     if(IdData != ""){
    //     GetSubCategory(IdData)
    //     }
    // },[IdData])

    //     useEffect(() => {
    //        if(subcategoryId.category !='' ){
    //         subcategoryId.categories.map((item)=>{
    //             if(item.value == updateCategory){
    //              IdData = item.parentId;

    //              }
    //        })
    //     }

    //     }, [subcategoryId.category])

    //     const GetSubCategory = (val) =>{
    //         if(val != ""){
    //             if(subcategoryId.subCategoryId!=""){
    //                 getSubCategories(val)
    //                 .then((res) => {
    //                     setData(IdData)
    //                     setLoader(true);
    //                 })
    //                 .catch((res) => {
    //                 });
    //             }
    //             else{
    //         getSubCategories(val)
    //             .then((res) => {
    //                 setData(IdData)
    //                 setLoader(true);
    //             })
    //             .catch((res) => {
    //             });
    //         }
    //         }

    //     }

    //     useEffect(() => {

    //       console.log(subcategoryId.autoFocus,'----------------------');

    //         setData('')

    // },[subcategoryId.autoFocus])



    // const changeCategory = (value) => {
    //    if(value === null){
    //     setData("ALL");

    //    }
    //    else{
    //     setData(value);
    //     categoryData(value);
    //    }


    // };

    const changeCategory = (value) => {

        setData(value);
        categoryData(value);
    }
    return (
        <div className="select-categories mt-3">
            {show ?
                <>
                    {loader ?
                        <>

                            <label>Select Sub Category</label>

                            <Select

                                key={Date.now()}
                                value={data}
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select Sub Category"
                                optionFilterProp="children"
                                clearable={false}
                                searchable={false}
                                required
                                onChange={changeCategory}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            // disabled={
                            //     PermissionHelper.categoryCheck() || props.singleLoading
                            //         ? true
                            //         : false
                            // }
                            >
                                {subcategories.map(({ value, label }, i) => (
                                    <Option value={value}>{label}</Option>
                                ))}
                            </Select>
                        </>
                        :
                        <Loader />
                    }
                </>
                :
                <h5>Select Category </h5>
            }
        </div>
    )
}

function mapStateToProps({ getSubCategories, subcategories }) {
    return {
        getSubCategories, subcategories

    };
}

export default connect(mapStateToProps, { ...sub })(SubCategories);
