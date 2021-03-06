import React from "react";
import { connect } from "react-redux";

import { Menu } from "components/augmint-ui/menu";
import Button from "components/augmint-ui/button";
import { Field, reduxForm } from "redux-form";
import { Form, Validations, Normalizations } from "components/BaseComponents";
import { Pblock, Pgrid } from "components/PageLayout";
import FundList from "./FundList/index";

import theme from "styles/theme";

import { FUNDS } from "./FundList/funds.js";

export const WITHDRAW = "withdraw";
export const ADDFUND = "addFunds";

const VALIDATE_MIN_EUR = Validations.minAddWithdrawAmount(FUNDS[0].eurLimit, "EUR");
const VALIDATE_MIN_AEUR = Validations.minAddWithdrawAmount(FUNDS[0].aeurLimit, "A-EUR");

class AddWithdrawForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderDirection: ADDFUND,
            amount: ""
        };
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onAmountChange = this.onAmountChange.bind(this);
    }

    onAmountChange(e) {
        this.setState({
            amount: e.target.value
        });
    }

    onMenuClick(e) {
        if (e.target.attributes["data-index"].value === ADDFUND) {
            this.setState({
                orderDirection: ADDFUND
            });
        } else {
            this.setState({
                orderDirection: WITHDRAW
            });
        }
    }

    render() {
        const { error, user } = this.props;
        const { orderDirection, amount } = this.state;

        const eurAmountValidations = [Validations.required, Validations.tokenAmount, VALIDATE_MIN_EUR];

        const aeurAmountValidations = [
            Validations.required,
            Validations.tokenAmount,
            VALIDATE_MIN_AEUR,
            Validations.userTokenBalance
        ];

        const isDesktop = window.innerWidth > 768;

        const header = (
            <div style={{ marginBottom: "2rem" }}>
                <Menu className={"filled"}>
                    <Menu.Item
                        active={orderDirection === ADDFUND}
                        data-index={`${ADDFUND}`}
                        onClick={this.onMenuClick}
                        data-testid={`${ADDFUND}Tab`}
                        className={"filled"}
                        tabIndex="0"
                    >
                        Buy A-EUR
                    </Menu.Item>
                    <Menu.Item
                        active={orderDirection === WITHDRAW}
                        data-index={`${WITHDRAW}`}
                        onClick={this.onMenuClick}
                        data-testid={`${WITHDRAW}Tab`}
                        className={"filled"}
                        tabIndex="0"
                    >
                        Sell A-EUR
                    </Menu.Item>
                </Menu>
            </div>
        );

        const buttonToGo = (
            <Pgrid.Row>
                <Button
                    type="submit"
                    labelposition="center"
                    size="large"
                    className="primary"
                    data-testid={orderDirection === ADDFUND ? `${ADDFUND}Link` : `${WITHDRAW}Link`}
                    style={{ width: "100%", padding: "15px 20px" }}
                >
                    Go to Mr.Coin
                </Button>
            </Pgrid.Row>
        );

        return (
            <Pblock style={{ margin: 0 }}>
                {header}
                <Form
                    error={error ? "true" : "false"}
                    action={orderDirection === ADDFUND ? FUNDS[0].buyUrl : FUNDS[0].sellUrl}
                    method="POST"
                    target="_blank"
                >
                    <label data-testid={`${orderDirection}AmountLabel`}>
                        {orderDirection === ADDFUND ? "Send from bank account ..." : "Send to bank account ..."}
                    </label>

                    <Field
                        name={"sending-amount"}
                        component={Form.Field}
                        as={Form.Input}
                        type="number"
                        inputmode="numeric"
                        step="any"
                        min="0"
                        onChange={this.onAmountChange}
                        validate={orderDirection === ADDFUND ? eurAmountValidations : aeurAmountValidations}
                        normalize={Normalizations.fiveDecimals}
                        data-testid={`${orderDirection}AmountInput`}
                        style={{ borderRadius: theme.borderRadius.left }}
                        labelAlignRight={orderDirection === ADDFUND ? "EUR" : "A-EUR"}
                        autoFocus={isDesktop}
                    />

                    <Field
                        name={orderDirection === ADDFUND ? "to-address" : "from-address"}
                        component={Form.Field}
                        as={Form.Input}
                        type="hidden"
                        inputmode="text"
                        data-testid={`${orderDirection}AddressInput`}
                    />

                    <label>Available exchange partner:</label>

                    <FundList user={user} amount={amount} direction={orderDirection} />

                    {buttonToGo}

                    <p style={{ fontSize: "14px" }}>
                        Interested in becoming an Augmint exchange partner?{" "}
                        <a href="mailto:hello@augmint.org">Contact us.</a>
                    </p>
                </Form>
            </Pblock>
        );
    }
}

AddWithdrawForm = reduxForm({
    form: "AddWithdrawForm",
    touchOnChange: true,
    touchOnBlur: false,
    enableReinitialize: true,
    shouldValidate: params => {
        // workaround for issue that validations are not triggered when changing orderDirection in menu.
        // TODO: this is hack, not perfect, eg. user clicks back and forth b/w sell&buy then balance check
        //       is not always happening before submission attempt.
        //       also lot of unnecessary validation call
        if (params.props.error) {
            return false; // needed otherwise submission error is not shown
        }
        return true;
    }
})(AddWithdrawForm);

function mapStateToProps(state, ownProps) {
    const address = ownProps.user.address;
    return { initialValues: { "to-address": address, "from-address": address } };
}

AddWithdrawForm = connect(mapStateToProps)(AddWithdrawForm);

export default AddWithdrawForm;
