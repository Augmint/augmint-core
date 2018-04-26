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
        case "connect":
            className += " fas fa-plug";
            break;
        case "account":
            className += " far fa-id-card";
            break;
        case "exchange":
            className += " fas fa-exchange-alt";
            break;
        case "lock":
            className += " fas fa-lock";
            break;
        case "loan":
            className += " far fa-money-bill-alt";
            break;
        case "reserves":
            className += " fas fa-university";
            break;
    }
    if (props.loading) {
        className += " loading fas fa-circle-notch";
    }

    return React.createElement(StyledIcon, { ...props, className: className }, children);
}
