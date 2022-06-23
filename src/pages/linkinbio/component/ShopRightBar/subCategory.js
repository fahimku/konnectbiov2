import React, { useEffect, useState, useRef } from "react";
import * as sub from "../../../../actions/subCategory.action";
import { connect } from "react-redux";
import { Select } from "antd";
const { Option } = Select;
var updateCategory = "";
var Categories = [];
function SubCategories({
    getSubCategories,
    subcategories,
    subcategoryId,
    categoryData
}) {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState('');
    useEffect(() => {

 
if(subcategoryId.category !=''){
    updateCategory = subcategoryId.category;
}
        if (subcategoryId.subCategoryId != '') {
          
            // id = subcategoryId.subCategoryId[0]
            // var subId = id.split(/[, ]+/).pop();

            setLoader(false);
            getSubCategories(subcategoryId.subCategoryId)
                .then((res) => {
                    setLoader(true);
                })
                .catch((res) => {
                });
        }
    }, [subcategoryId]);
  

    useEffect(() => {
       if(subcategoryId.category !='' ){
        subcategoryId.categories.map((item)=>{
            if(item.value == updateCategory){
            setData(item.parentId)
            getSubCategories(item.parentId)
            .then((res) => {
                setLoader(true);
            })
            .catch((res) => {
            });
            }
       })
    }

    }, [subcategoryId.IdSub])

    const changeCategory = (value) => {
        setData(value);
        console.log(data)
        categoryData(value);

    };
    return (
        <div className="select-categories mt-3">

            {subcategories.length > 0 || subcategoryId.IdSub != ""?
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
