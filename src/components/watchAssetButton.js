import React from "react";
import { connect } from "react-redux";
import { watchAsset } from "modules/watchAsset";
import Button from "components/augmint-ui/button";
import store from "modules/store";
import { watchAssetChange } from "modules/reducers/web3Connect";

export class WatchAssetButton extends React.Component {
    constructor(props) {
        super(props);
        this.addAsset = this.addAsset.bind(this);

        this.cookies = null;
        this.newCookie = null;
        this.value = null;

        this.isAssetAdded = true;
        this.isMetamask = false;
        this.hasAugmint = false;
    }

    addAsset() {
        const address = this.props.contracts.latest.augmintToken.address;
        const provider = this.props.web3.web3Instance.currentProvider;
        watchAsset(address, this.props.augmint, provider, this.newCookie).then(res => {
            if (res) {
                store.dispatch(watchAssetChange(this.newCookie));
            }
        });
    }

    isAssetAlreadyAdded() {
        let isAssetAdded;
        if (this.cookies && this.cookies.length) {
            let contains = this.cookies.filter(c => {
                let equal = true;
                Object.keys(c).forEach(key => {
                    if (c[key] !== this.value[key]) {
                        equal = false;
                    }
                });
                return equal;
            });

            if (!contains || !contains.length) {
                this.newCookie = [...this.cookies];
                this.newCookie.push(this.value);
                isAssetAdded = false;
            } else {
                isAssetAdded = true;
            }
        } else {
            this.newCookie = [this.value];
            isAssetAdded = false;
        }
        return isAssetAdded;
    }

    render() {
        const { web3, contracts, augmint, user, className, btn, style, circleicon, labelposition } = this.props;
        let showButton = false;

        let _className = className + " primary watchAssetBtn";
        const icon = "wallet";

        if (web3.isConnected && contracts.isConnected && augmint.isLoaded && !user.isLoading) {
            this.cookies = web3.watchAsset;

            this.value = {
                tokenAddress: contracts.latest.augmintToken.address,
                network: web3.network.name,
                account: web3.userAccount
            };

            this.isMetamask = window.ethereum?.isMetamask || null;
            this.hasAugmint = user.account.tokenBalance > 0;

            this.isAssetAdded = this.isAssetAlreadyAdded();
            showButton = this.isMetamask && !this.isAssetAdded && this.hasAugmint;
        }

        const Centered = () => {
            return (
                <div style={{ ...style, textAlign: "center" }}>
                    {showButton && (
                        <Button
                            className={_className}
                            onClick={() => {
                                this.addAsset();
                            }}
                        >
                            Watch A-EUR in your wallet
                        </Button>
                    )}
                </div>
            );
        };

        const Btn = () => {
            return (
                <>
                    {showButton && (
                        <Button
                            className={className}
                            icon={icon}
                            circleicon={circleicon}
                            onClick={() => {
                                this.addAsset();
                            }}
                            style={style}
                            labelposition={labelposition}
                        >
                            Watch
                            <br />
                            in wallet
                        </Button>
                    )}
                </>
            );
        };

        return !btn ? <Centered /> : <Btn />;
    }
}

const mapStateToProps = state => ({
    augmint: state.augmintToken,
    web3: state.web3Connect,
    contracts: state.contracts,
    user: state.userBalances
});

export default connect(mapStateToProps)(WatchAssetButton);
