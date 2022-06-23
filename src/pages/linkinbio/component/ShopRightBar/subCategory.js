import React, { useEffect, useState, useRef } from "react";
import * as sub from "../../../../actions/subCategory.action";
import { connect } from "react-redux";
import { Select } from "antd";
const { Option } = Select;
var id = "";
var Categories = [];
function SubCategories({
    getSubCategories,
    subcategories,
    subcategoryId,
    categoryData
}) {

    const [loader, setLoader] = useState(true);
    useEffect(() => {

        if (subcategoryId.subCategoryId.length) {

            id = subcategoryId.subCategoryId[0]
            var subId = id.split(/[, ]+/).pop();

            setLoader(false);
            getSubCategories(subId)
                .then((res) => {
                    setLoader(true);
                })
                .catch((res) => {
                });
        }
    }, [subcategoryId]);

    useEffect(() => {
        changeCategory(subcategoryId.subCategoryId);

    }, [subcategoryId.subCategoryId])

    const changeCategory = (value) => {
        console.log(value)
        categoryData(value);

    };
    return (
        <div className="select-categories mt-3">

            {subcategories.length > 0 ?
                <>

                    <label>Select Sub Category</label>

                    <Select
                        key={Date.now()}
                        value={subcategoryId.subCategoryId}
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select Category"
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
                <></>
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
