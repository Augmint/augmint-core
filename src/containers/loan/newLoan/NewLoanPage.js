import React from "react";
import { connect } from "react-redux";
import { Pgrid } from "components/PageLayout";
import store from "modules/store";
import { LoadingPanel } from "components/MsgPanels";
import { SubmissionError } from "redux-form";
import { newLoan, LOANTRANSACTIONS_NEWLOAN_CREATED } from "modules/reducers/loanTransactions";
import NewLoanForm from "./NewLoanForm";
import NewLoanSuccess from "./NewLoanSuccess";

class NewLoanPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: props.loanManager.products,
            isLoading: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.products !== this.props.products) {
            this.setState({
                isLoading: false
            });
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        });
    }

    async handleSubmit(values) {
        const product = values.product;
        const ethAmount = values.ethAmount;
        const minRate = values.minRate;
        const address = this.props.userAccount.address;

        const res = await store.dispatch(newLoan(product, ethAmount, address, minRate));
        if (res.type !== LOANTRANSACTIONS_NEWLOAN_CREATED) {
            throw new SubmissionError({
                _error: res.error
            });
        } else {
            this.setState({
                submitSucceeded: true,
                result: res.result,
                ethAmount: ethAmount
            });
            return res;
        }
    }

    render() {
        let msg;
        if (this.state.isLoading) {
            msg = <LoadingPanel>Fetching data...</LoadingPanel>;
        }
        if (msg) {
            return msg;
        }
        return (
            <Pgrid className="new-loan-page">
                <Pgrid.Row wrap={false}>
                    <Pgrid.Column>
                        {!this.state.submitSucceeded && (
                            <NewLoanForm
                                rates={this.props.rates}
                                products={this.props.products}
                                onSubmit={this.handleSubmit}
                            />
                        )}
                        {this.state.submitSucceeded && (
                            /* couldn't make this work yet:
                        <Redirect path="/getLoan/fetchLoansuccess" push component={fetchLoansuccess}/> */
                            <NewLoanSuccess result={this.state.result} ethAmount={this.state.ethAmount} />
                        )}
                    </Pgrid.Column>
                </Pgrid.Row>
            </Pgrid>
        );
    }
}

const mapStateToProps = state => ({
    loanManager: state.loanManager,
    products: state.loanManager.products,
    rates: state.rates,
    userAccount: state.userBalances.account
});

export default connect(mapStateToProps)(NewLoanPage);
