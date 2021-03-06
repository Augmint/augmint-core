/*
    TODO: use selectors. eg: https://github.com/reactjs/reselect
*/

import store from "modules/store";

// import { ONE_ETH_IN_WEI, DECIMALS_DIV } from "utils/constants";

export const LOANMANAGER_REFRESH_REQUESTED = "loanManager/LOANMANAGER_REFRESH_REQUESTED";
export const LOANMANAGER_REFRESHED = "loanManager/LOANMANAGER_REFRESHED";
export const LOANMANAGER_REFRESH_ERROR = "loanManager/LOANMANAGER_REFRESH_ERROR";

export const LOANMANAGER_PRODUCTLIST_REQUESTED = "loanManager/LOANMANAGER_PRODUCTLIST_REQUESTED";
export const LOANMANAGER_PRODUCTLIST_RECEIVED = "loanManager/LOANMANAGER_PRODUCTLIST_RECEIVED";
export const LOANMANAGER_PRODUCTLIST_ERROR = "loanManager/LOANMANAGER_PRODUCTLIST_ERROR";

export const LOANMANAGER_FETCH_LOANS_TO_COLLECT_REQUESTED = "loanManager/LOANMANAGER_FETCH_LOANS_TO_COLLECT_REQUESTED";
export const LOANMANAGER_FETCH_LOANS_TO_COLLECT_RECEIVED = "loanManager/LOANMANAGER_FETCH_LOANS_TO_COLLECT_RECEIVED";
export const LOANMANAGER_FETCH_LOANS_TO_COLLECT_ERROR = "loanManager/LOANMANAGER_FETCH_LOANS_TO_COLLECT_ERROR";

const initialState = {
    isLoaded: false,
    isLoading: false,
    loadError: null,
    result: null,
    error: null,
    products: null,
    loansToCollect: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOANMANAGER_REFRESH_REQUESTED:
            return {
                ...state,
                isLoading: true
            };

        case LOANMANAGER_REFRESHED:
            return {
                ...state,
                isLoading: false,
                isLoaded: true
            };

        case LOANMANAGER_PRODUCTLIST_REQUESTED:
            return {
                ...state,
                isLoading: true
            };

        case LOANMANAGER_PRODUCTLIST_RECEIVED:
            return {
                ...state,
                isLoading: false,
                products: action.products
            };

        case LOANMANAGER_FETCH_LOANS_TO_COLLECT_REQUESTED:
            return {
                ...state,
                error: null,
                isLoading: true
            };

        case LOANMANAGER_FETCH_LOANS_TO_COLLECT_RECEIVED:
            return {
                ...state,
                loansToCollect: action.result,
                isLoading: false
            };

        case LOANMANAGER_FETCH_LOANS_TO_COLLECT_ERROR:
        case LOANMANAGER_REFRESH_ERROR:
        case LOANMANAGER_PRODUCTLIST_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        default:
            return state;
    }
};

export const refreshLoanManager = () => {
    return async dispatch => {
        dispatch({
            type: LOANMANAGER_REFRESH_REQUESTED
        });
        try {
            return dispatch({
                type: LOANMANAGER_REFRESHED,
                info: {}
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                return Promise.reject(error);
            }
            return dispatch({
                type: LOANMANAGER_REFRESH_ERROR,
                error: error
            });
        }
    };
};

export function fetchLoanProducts() {
    return async dispatch => {
        dispatch({
            type: LOANMANAGER_PRODUCTLIST_REQUESTED
        });

        try {
            const result = await store.getState().web3Connect.augmint.getLoanProducts(false);
            return dispatch({
                type: LOANMANAGER_PRODUCTLIST_RECEIVED,
                products: result
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                return Promise.reject(error);
            }
            return dispatch({
                type: LOANMANAGER_PRODUCTLIST_ERROR,
                error: error
            });
        }
    };
}

export function fetchLoansToCollect() {
    return async dispatch => {
        dispatch({
            type: LOANMANAGER_FETCH_LOANS_TO_COLLECT_REQUESTED
        });

        try {
            const result = await store.getState().web3Connect.augmint.getLoansToCollect();

            return dispatch({
                type: LOANMANAGER_FETCH_LOANS_TO_COLLECT_RECEIVED,
                result: result
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                return Promise.reject(error);
            }
            return dispatch({
                type: LOANMANAGER_FETCH_LOANS_TO_COLLECT_ERROR,
                error: error
            });
        }
    };
}
