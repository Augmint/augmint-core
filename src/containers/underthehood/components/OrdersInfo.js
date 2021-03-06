import React from "react";
import store from "modules/store";
import { refreshOrders } from "modules/reducers/orders";
import { Pblock } from "components/PageLayout";
import Button from "components/augmint-ui/button";
import { ArrayDump } from "./ArrayDump";

export function OrdersInfo(props) {
    const handleRefreshClick = e => {
        e.preventDefault();
        store.dispatch(refreshOrders());
    };

    return (
        <Pblock header="Orders">
            {props.orders ? (
                <div>
                    <h3>Sell</h3>
                    <ArrayDump key="sellOrdersDump" items={props.orders.sellOrders} />
                    <h3>Buy</h3>
                    <ArrayDump key="buyOrdersDump" items={props.orders.buyOrders} />
                </div>
            ) : (
                "No orders loaded"
            )}
            <Button
                size="small"
                type="submit"
                onClick={handleRefreshClick}
                disabled={!props.orders || props.orders.isLoading}
            >
                Refresh orders
            </Button>
        </Pblock>
    );
}
