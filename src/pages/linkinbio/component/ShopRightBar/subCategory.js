import React, { useEffect, useState, useRef, useMemo } from "react";
import * as sub from "../../../../actions/subCategory.action";
import { connect } from "react-redux";
import { Select } from "antd";
import Loader from "../../../../components/Loader";
const { Option } = Select;

var parent_id="";
var sub_id="";
function SubCategories({
    getSubCategories,
    Campaign,
    subcategories
}) {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [data, setData] = useState('');
   
    console.log(Campaign,"Modal");
    useEffect(()=>{
        if(Campaign.categories.length >0){
         parent_id = Campaign.categories[0].parent_id;
         sub_id = Campaign.sub_categories[0].sub_category_id
         setShow(true)
         getSubCategories(parent_id).then((res)=>{

           
            setData(sub_id)
            setShow(false)
         })
        }
        

    },[Campaign.categories])

    const changeCategory = (value) => {

        setData(value);
        
    };
    return (
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
                                disabled={true}
                                required
                                onChange={changeCategory}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
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
                
          
    
    );
}

function mapStateToProps({ getSubCategories, subcategories }) {
    return {
        getSubCategories,
        subcategories,
    };
}

export default connect(mapStateToProps, { ...sub })(SubCategories);
