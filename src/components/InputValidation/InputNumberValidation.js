import React from "react";
import PropTypes from "prop-types";
import Formsy from "formsy-react";

Formsy.addValidationRule(
  "isRange",
  (values, value, array) => value >= array[0] && value <= array[1]
);

class InputNumberValidation extends React.Component {
  /* eslint-disable */
  static propTypes = {
    trigger: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    placeholder: PropTypes.string,
    setValue: PropTypes.func,
    isFormSubmitted: PropTypes.func,
    getErrorMessage: PropTypes.func,
    showRequired: PropTypes.func,
  };
  /* eslint-enable */

  static defaultProps = {
    trigger: null,
    type: "text",
    className: "",
    name: "",
    id: "",
    placeholder: "",
  };

  constructor() {
    super();
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const errorMessageObj =
      this.props.isFormSubmitted() || this.props.trigger
        ? this.props.getErrorMessage()
        : null;
    const required =
      this.props.isFormSubmitted() && this.props.showRequired() ? (
        <span className={"number-error help-block text-danger"}>
          This value is required.
        </span>
      ) : null;
    const errorMsg = [];
    if (errorMessageObj) {
      Object.keys(errorMessageObj).forEach((type) => {
        errorMsg.push(errorMessageObj[type]);
      });
    }
    const errorList = errorMsg.map((msg, index) => (
      <span
        key={`msg-err-${index.toString()}`}
        className={"number-error help-block text-danger"}
      >
        {msg}
      </span>
    ));

    return (
      <div className={this.props.className}>
        <div className="mb-2 input-group">
          <span class="input-group-text">%</span>
          <input
            type={this.props.type}
            name={this.props.name}
            id={this.props.id}
            className={"form-control"}
            onBlur={this.changeValue}
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
            disabled={this.props.disabled ? true : false}
            autoComplete="off"
            onKeyDown={(evt) =>
              ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
            }
            min={this.props.min}
            max={this.props.max}
          />
        </div>
        {required}
        {errorList}
      </div>
    );
  }
}

export default Formsy.HOC(InputNumberValidation);
