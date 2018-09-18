import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import theme from "styles/theme";
import Message from "components/augmint-ui/message";

const Box = styled(Message)`
    padding: 20px;
    background: transparent;
    border: 1px solid ${theme.colors.red};
    color: ${theme.colors.red};
    border-radius: 0;
    box-shadow: none;

    a,
    a:hover,
    a:focus {
        color: inherit;
    }
`;

class NoTokenAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: true
        };
        this.dismiss = this.dismiss.bind(this);
    }

    dismiss() {
        this.setState({
            isActive: false
        });
    }

    render() {
        const balanceIsNull = this.props.userAccount.tokenBalance === 0;

        return (
            this.state.isActive &&
            balanceIsNull && (
                <Box onDismiss={this.dismiss} {...this.props}>
                    <Link to="/how-to-get">
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: 15 }} />
                        You have no A-EUR yet. <u>How to get?</u> »
                    </Link>
                </Box>
            )
        );
    }
}

const mapStateToProps = state => ({
    userAccount: state.userBalances.account
});

export default connect(mapStateToProps)(NoTokenAlert);
