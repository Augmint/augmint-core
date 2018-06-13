import React from "react";
import { ConnectionStatus } from "components/MsgPanels";
import Segment from "components/augmint-ui/segment";
import Statistic from "components/augmint-ui/statistic";

export class LtdStats extends React.Component {
    render() {
        const { isLoaded, isLoading, loadError } = this.props.monetarySupervisor;
        const { monetarySupervisor } = this.props;
        const { totalLockedAmount, totalLoanAmount, ltdPercent } = this.props.monetarySupervisor.info;
        const { loanCount } = this.props.loanManager.info;
        const { lockCount } = this.props.lockManager.info;

        return (
            <Segment vertical textAlign="center" loading={isLoading || (!isLoaded && !loadError)}>
                <ConnectionStatus contract={monetarySupervisor} />

                <Statistic.Group>
                    <Statistic
                        data-testid="totalSupply"
                        style={{ padding: "1em" }}
                        label="Total locked"
                        value={totalLockedAmount + " A-EUR"}
                    >
                        {lockCount > 0 && <p>in {lockCount} locks (incl. released)</p>}
                    </Statistic>

                    <Statistic
                        data-testid="reserveEthBalance"
                        style={{ padding: "1em" }}
                        label="Total loans"
                        value={totalLoanAmount + " A-EUR"}
                    >
                        {loanCount > 0 && <p>{loanCount} loans (incl. repaid&defaulted)</p>}
                    </Statistic>

                    <Statistic
                        data-testid="reserveTokenBalance"
                        style={{ padding: "1em" }}
                        label="Loan to Lock ratio"
                        value={totalLockedAmount === 0 ? "N/A " : `${(ltdPercent * 100).toFixed(2)} % `}
                    />
                </Statistic.Group>
            </Segment>
        );
    }
}
