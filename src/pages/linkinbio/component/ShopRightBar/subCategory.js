import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Select } from "antd";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory({
  forceRefresh: true,
});

const subCategories = () => {

    fetchCategories = async () => {
        await axios
          .get(`/users/receive/categories?id=${this.state.userId}`)
          .then((response) => {
            const selectCategories = [];
            const categories = response.data.message;
            categories.map(({ parent_id, category_name, category_id }) => {
              return selectCategories.push({
                value: category_id,
                label: category_name,
                parentId: parent_id,
              });
            });
            this.setState({ categories: selectCategories });
          });
      };


    return (
        <div className="select-categories mt-3">
        <label>Select Category</label>
        <Select
          key={Date.now()}
          value={props.category}
          showSearch
          style={{ width: "100%" }}
          placeholder="Select Category"
          optionFilterProp="children"
          clearable={false}
          searchable={false}
          required
          onChange={props.changeCategory}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            option.children
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          disabled={
            PermissionHelper.categoryCheck() || props.singleLoading
              ? true
              : false
          }
        >
          {props.categories.map(({ value, label }, i) => (
            <Option value={value}>{label}</Option>
          ))}
        </Select>
      </div>
    )
}

export default subCategories;