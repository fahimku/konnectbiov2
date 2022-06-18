import React from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";

class AsyncSelectField extends React.Component {
  state = {
    brand: "",
    default_value: this.props.defaultValue,
    // paste_value: "",
  };

  loadOptions = async (input, callback) => {
    await this.smartSearchFilter(input);
    const result = this.state.brand.map((item) => {
      return {
        value: `${item.value}`,
        label: `${item.label}`,
      };
    });

    callback(result);
  };

  smartSearchFilter = async (value) => {
    if (this.props.name === "brand") {
      await axios
        .post("users/marketPlace/brands", {
          brand_name: value.trim(),
        })
        .then((response) => {
          const loadBrand = [];
          const brands = response.data.message;
          brands.map(({ brand_id, brand_name }) => {
            return loadBrand.push({
              value: brand_id,
              label: brand_name,
            });
          });

          this.setState({ brand: loadBrand });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  handleMultiSelect = (e, options) => {
    this.props.getBrand(options);
    this.setState({
      brand: options,
    });
  };

  handleOnPaste = async (e) => {
    const getData = e.clipboardData.getData("text");
    await this.smartSearchFilter(getData);
  };

  render() {
    return (
      <React.Fragment>
        <div
          //   style={{ height: "100%", width: "100%" }}
          onPaste={(e) => this.handleOnPaste(e)}
        >
          <AsyncSelect
            className={this.props.className}
            // isMulti={this.props.isMulti === false ? false : true}
            isMulti
            defaultOptions
            delimiter=","
            loadOptions={this.loadOptions}
            placeholder={this.props.placeholder}
            name={this.props.name}
            defaultValue={this.props.defaultValue}
            onChange={(options, e) => this.handleMultiSelect(e, options)}
          // value={this.props.defaultValue}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AsyncSelectField;
