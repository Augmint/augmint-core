import store from "modules/store";
import { callbackAfterTransfer } from "../../containers/transfer/request/TransferRequestHelper";

export const UPDATE_TX_SUCCESS = "submittedTransactions/UPDATE_TX_SUCCESS";
export const UPDATE_TX_ERROR = "submittedTransactions/UPDATE_TX_ERROR";

export const DISMISS_TX_SUCCESS = "submittedTransactions/DISMISS_TX_SUCCESS";
export const DISMISS_TX_ERROR = "submittedTransactions/DISMISS_TX_ERROR";
export const ADD_NONCE = "submittedTransactions/ADD_NONCE";

const initialState = {
    transactions: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_NONCE:
            return {
                ...state,
                transactions: action.result
            };
        case UPDATE_TX_SUCCESS:
        case DISMISS_TX_SUCCESS:
            return {
                ...state,
                transactions: action.result
            };

        case UPDATE_TX_ERROR:
        case DISMISS_TX_ERROR:
            return {
                ...state,
                error: action.error
            };

        default:
            return state;
    }
};

export const updateTxNonce = ({ nonce, transactionHash }) => {
    const transactions = Object.assign({}, store.getState().submittedTransactions.transactions);
    const updatedTx = Object.assign({}, store.getState().submittedTransactions.transactions[transactionHash], {
        nonce: nonce
    });
    transactions[transactionHash] = updatedTx;

    return {
        type: ADD_NONCE,
        result: transactions
    };
};

export const updateTx = tx => {
    return async dispatch => {
        try {
            const transactions = Object.assign({}, store.getState().submittedTransactions.transactions);
            const updatedTx = Object.assign({}, transactions[tx.transactionHash], tx);
            transactions[tx.transactionHash] = updatedTx;

            if (
                transactions[tx.transactionHash].confirmationNumber <= 1 &&
                transactions[tx.transactionHash].event === "confirmation"
            ) {
                transactions[tx.transactionHash].isDismissed = undefined;
            }

            if (transactions[tx.transactionHash].confirmationNumber >= 5) {
                callbackAfterTransfer(transactions[tx.transactionHash]);
            }

            return dispatch({
                type: UPDATE_TX_SUCCESS,
                result: transactions
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                return Promise.reject(error);
            }
            return dispatch({
                type: UPDATE_TX_ERROR,
                error
            });
        }
    };
};

export const dismissTx = (txHash, dismissState) => {
    return async dispatch => {
        try {
            const transactions = Object.assign({}, store.getState().submittedTransactions.transactions);
            if (txHash === undefined) {
                Object.keys(transactions).forEach(key => {
                    if (transactions[key].isDismissed !== "archive") {
                        transactions[key].isDismissed = dismissState;
                    }
                });
            } else {
                if (transactions[txHash].isDismissed !== "archive") {
                    transactions[txHash].isDismissed = dismissState;
                }
            }

            return dispatch({
                type: DISMISS_TX_SUCCESS,
                result: transactions
            });
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                return Promise.reject(error);
            }
            return dispatch({
                type: DISMISS_TX_ERROR,
                error
            });
        }
    };
};
