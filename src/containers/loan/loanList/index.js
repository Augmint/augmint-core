import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Psegment, Pheader } from "components/PageLayout";
import TopNavTitlePortal from "components/portals/TopNavTitlePortal";
import Segment from "components/augmint-ui/segment";
import { Menu } from "components/augmint-ui/menu";
import { NoItems } from "components/augmint-ui/list";
import Button from "components/augmint-ui/button";
import { ErrorPanel } from "components/MsgPanels";
import { LoanCard, MarginLoanCard } from "./LoanCard";
import LoanProductSelector from "./../newLoan/LoanProductSelector";
import { MARGIN_THRESHOLD } from "utils/constants.js";
import { Ratio } from "@augmint/js";

import "./styles.css";

function LoanList(props) {
    const { location, loanManager, ethFiatRate, products } = props;
    const { isLoading, error, loans } = props.loans;
    const isActivePage = location.pathname === "/loan";
    const isNewLoan = location.pathname === "/loan/new";

    function isMarginWarning(marginCallRate) {
        const warningLevel = marginCallRate.mul(Ratio.of(MARGIN_THRESHOLD));
        return ethFiatRate <= warningLevel.toNumber();
    }

    const listItems =
        loans &&
        loans
            .filter(loan => loan.isRepayable === isActivePage)
            .sort((a, b) => {
                return isActivePage ? a.maturity - b.maturity : b.maturity - a.maturity;
            })
            .map(loan => {
                if (loan.isMarginLoan && loan.marginCallRate) {
                    loan.marginWarning = isMarginWarning(loan.marginCallRate);
                    return (
                        <MarginLoanCard
                            key={`loan-${loan.id}-${loan.loanManagerAddress}`}
                            loan={loan}
                            loanManager={loanManager}
                            products={products}
                            rate={ethFiatRate}
                        />
                    );
                } else {
                    return (
                        <LoanCard
                            key={`loan-${loan.id}-${loan.loanManagerAddress}`}
                            loan={loan}
                            loanManager={loanManager}
                            rate={ethFiatRate}
                        />
                    );
                }
            });

    let content = null;
    if (isNewLoan) {
        content = <LoanProductSelector />;
    } else {
        content = listItems;
    }

    return (
        <Psegment id="loans-segment">
            <TopNavTitlePortal>
                <Pheader header="My loans" />
            </TopNavTitlePortal>
            <Segment className="block loans-block">
                <Menu>
                    <Menu.Item data-testid="newLoanLink" exact to="/loan/new" activeClassName="active">
                        New loan
                    </Menu.Item>
                    <Menu.Item exact to="/loan" activeClassName="active">
                        Active loans
                    </Menu.Item>
                    <Menu.Item exact to="/loan/archive" activeClassName="active">
                        Old loans
                    </Menu.Item>
                </Menu>

                <div className={isLoading ? "loading" : "loans"}>
                    {error && <ErrorPanel header="Error while fetching loan list">{error.message}</ErrorPanel>}
                    {listItems && listItems.length === 0 && !isNewLoan ? (
                        <NoItems title={isActivePage ? "You have no active loans." : "You have no old loans."}>
                            <div style={{ margin: "30px 0" }}>
                                <p>
                                    <strong>Start spending the value of your ETH while keeping your investment.</strong>
                                </p>
                                <p>
                                    You can get A-EUR for placing your ETH in escrow (collateral). You will get back all
                                    of your ETH when you repay your A-EUR loan anytime before it's due (maturity).
                                </p>
                            </div>
                        </NoItems>
                    ) : (
                        <div>{content}</div>
                    )}
                    {!isNewLoan && (
                        <div style={{ textAlign: "center" }}>
                            <Button content="Get a new loan" to="/loan/new" data-testid="newLoanLinkBtn" />
                        </div>
                    )}
                </div>
            </Segment>
        </Psegment>
    );
}

const mapStateToProps = state => ({
    userAccount: state.userBalances.account,
    loans: state.loans,
    loanManager: state.loanManager,
    ethFiatRate: state.rates.info.ethFiatRate,
    products: state.loanManager.products
});

export default withRouter(connect(mapStateToProps)(LoanList));
