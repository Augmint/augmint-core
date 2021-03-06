/*
    TODO: add RATES_REFRESH_ERROR
    */
import store from "modules/store";
import BigNumber from "bignumber.js";

import { ONE_ETH_IN_WEI, DECIMALS_DIV } from "utils/constants";

export const RATES_REFRESH_REQUESTED = "rates/RATES_REFRESH_REQUESTED";
export const RATES_REFRESHED = "rates/RATES_REFRESHED";
export const RATES_REFRESH_ERROR = "rates/RATES_REFRESH_ERROR";

const initialState = {
    isLoading: false,
    isLoaded: false,
    loadError: null,
    info: {
        bn_weiBalance: null,
        ethBalance: null,
        bn_tokenBalance: null,
        tokenBalance: "?",

        bn_ethFiatRate: null,
        ethFiatRate: null,
        fiatEthRate: null,
        lastUpdated: null
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case RATES_REFRESH_ERROR:
            return {
                ...state,
                isLoading: false,
                loadError: action.error
            };

        case RATES_REFRESH_REQUESTED:
            return {
                ...state,
                isLoading: true
            };

        case RATES_REFRESHED:
            return {
                ...state,
                isLoaded: true,
                isLoading: false,
                info: action.result
            };

        default:
            return state;
    }
};

export const refreshRates = () => {
    return async dispatch => {
        dispatch({
            type: RATES_REFRESH_REQUESTED
        });
        try {
            const web3 = store.getState().web3Connect.web3Instance;
            const augmintTokenInstance = store.getState().contracts.latest.augmintToken.web3ContractInstance;
            const bytes32_peggedSymbol = await augmintTokenInstance.methods.peggedSymbol().call();
            const augmintRates = store.getState().web3Connect.augmint.rates;

            const ratesInstance = store.getState().contracts.latest.rates.web3ContractInstance;

            const [rates, bn_ethFiatRate, bn_tokenBalance, bn_weiBalance] = await Promise.all([
                augmintRates.getAugmintRate("EUR"),
                ratesInstance.methods.convertFromWei(bytes32_peggedSymbol, ONE_ETH_IN_WEI.toString()).call(),
                augmintTokenInstance.methods.balanceOf(ratesInstance._address).call(),
                web3.eth.getBalance(ratesInstance._address)
            ]);

            return dispatch({
                type: RATES_REFRESHED,
                result: {
                    bn_weiBalance,
                    ethBalance: bn_weiBalance / ONE_ETH_IN_WEI,
                    bn_tokenBalance,
                    tokenBalance: bn_tokenBalance / DECIMALS_DIV,
                    bn_ethFiatRate: new BigNumber(bn_ethFiatRate / DECIMALS_DIV),
                    ethFiatRate: bn_ethFiatRate / DECIMALS_DIV,
                    fiatEthRate: (1 / bn_ethFiatRate) * DECIMALS_DIV,
                    lastUpdated: rates.lastUpdated
                }
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                throw new Error(error);
            }
            return dispatch({
                type: RATES_REFRESH_ERROR,
                error: error
            });
        }
    };
};
