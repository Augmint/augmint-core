import React from "react";

import { StyledIcon } from "./styles";

export default function Icon(props) {
    const { children, name } = props;
    let className = props.className;

    switch (name) {
        case "info":
            className += " fas fa-info";
            break;
        case "check":
            className += " fas fa-check";
            break;
        case "close":
            className += " fas fa-times";
            break;
    }
    if (props.loading) {
        className += " loading fas fa-circle-notch";
    }

    return React.createElement(StyledIcon, { ...props, className: className }, children);
}
