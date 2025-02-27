import React, { forwardRef } from "react";
import PropTypes from "prop-types";
const CustomButton = forwardRef(
  (
    {
      iconStart,
      iconEnd,
      text
    },
    ref
  ) => {
    return (
      <Button ref={ref}>
        {iconStart}
        {text}
        {iconEnd}
      </Button>
    );
  }
);
CustomButton.displayName = "CustomButton";
CustomButton.propTypes = {
  text: PropTypes.string,
  iconStart: PropTypes.element,
  iconEnd: PropTypes.element,
};
export default CustomButton;