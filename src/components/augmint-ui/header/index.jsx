import React from "react";
import Icon from "components/augmint-ui/icon";

import { StyledHeaderH5, StyledHeaderH4, StyledHeaderH3, StyledHeaderH2, StyledHeaderH1 } from "./styles";

export default function Header(props) {
    const { as, children, content, icon } = props;

    let elementType = StyledHeaderH3,
        _icon;

    if (as === "h2") {
        elementType = StyledHeaderH2;
    }

    if (as === "h4") {
        elementType = StyledHeaderH4;
    }

    if (as === "h1") {
        elementType = StyledHeaderH1;
    }
    if (as === "h5") {
        elementType = StyledHeaderH5;
    }
    if (icon) {
        _icon = <Icon name={icon} />;
    }

    return React.createElement(elementType, props, children, _icon, content);
}
