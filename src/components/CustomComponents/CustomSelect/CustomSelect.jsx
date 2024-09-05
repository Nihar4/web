import React from "react";
import "./CustomSelect.css";
import ArrowUp from "../../../assets/icons/ArrowUp.svg";
import ArrowDown from "../../../assets/icons/ArrowDown.svg";

class CustomSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      heading: this.props.heading || "Select",
      isListOpen: false,
      title: this.props.options[this.props.defaultIndex] || this.props.title,
      selectedIndex: this.props.defaultIndex,
    };
    this.toggleSelect = this.toggleSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.selectOption = this.selectOption.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultIndex !== prevProps.defaultIndex) {
      this.setState({
        title: this.props.options[this.props.defaultIndex] || this.props.title,
      });
    }

    if (this.props.options !== prevProps.options) {
      this.setState({
        title: this.props.options[this.props.defaultIndex] || this.props.title,
      });
    }

    const { isListOpen } = this.state;

    setTimeout(() => {
      if (isListOpen) {
        window.addEventListener("click", this.closeSelect);
      } else {
        window.removeEventListener("click", this.closeSelect);
      }
    }, 0);
  }

  toggleSelect() {
    this.setState((prevState) => ({
      isListOpen: !prevState.isListOpen,
    }));
  }

  selectOption(indx, value) {
    this.setState(
      {
        title: value,
        selectedIndex: indx,
      },
      () => {
        this.toggleSelect();
        this.props.onTypeChange(value);
      }
    );
  }

  closeSelect() {
    this.setState({
      isListOpen: false,
    });
  }

  render() {
    const { width, height, options, error } = this.props;
    const { title, heading, isListOpen, selectedIndex } = this.state;

    return (
      <div className="custom-select">
        <p className="select-title">{heading}</p>
        <div
          className="custom-select-header"
          onClick={() => {
            this.toggleSelect();
          }}
        >
          <span className="custom-select-title">
            {title ? title : this.props.placeholder}
          </span>
          <span>
            {isListOpen ? (
              <img width={20} height={20} src={ArrowUp} alt="" />
            ) : (
              <img width={20} height={20} src={ArrowDown} alt="" />
            )}
          </span>
          {isListOpen ? (
            <div className="custom-select-container overflow">
              {options.map((option, indx) => {
                return (
                  <span
                    key={indx}
                    className={
                      selectedIndex === indx
                        ? "custom-select-option option-selected"
                        : "custom-select-option"
                    }
                    onClick={() => {
                      this.selectOption(indx, option);
                    }}
                  >
                    {option}
                  </span>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
        <p
          className={
            error === ""
              ? "error-text hide swift-error"
              : "error-text swift-error"
          }
        >
          {error}
        </p>
      </div>
    );
  }
}

export default CustomSelect;
