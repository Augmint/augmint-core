import React from "react";

import { Tsegment } from "components/TextContent";
import { DiscordButton } from "components/LinkButtons";
import Video from "components/augmint-ui/video";
import Header from "components/augmint-ui/header";

import { MobileView, DesktopView, StoreBadge } from "./styles";
import { StyledP } from "components/augmint-ui/paragraph/styles";

import appStoreSVG from "assets/images/App_Store_Badge.svg";
import googlePlayPNG from "assets/images/google-play-badge.png";

export function HowToConnect(props) {
    return (
        <div>
            <MobileView>
                <Tsegment>
                    <Tsegment.Row columns={1}>
                        <Tsegment.Column>
                            <StyledP className={"primaryColor"}>
                                To use A-EUR on mobile you need a web3 capable browser such as Trust Wallet.
                            </StyledP>
                            <a
                                href="https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <StoreBadge src={appStoreSVG} />
                            </a>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <StoreBadge src={googlePlayPNG} />
                            </a>
                        </Tsegment.Column>
                    </Tsegment.Row>
                </Tsegment>
            </MobileView>
            <DesktopView>
                <Tsegment>
                    <Tsegment.Row columns={1}>
                        <Tsegment.Column>
                            <StyledP className={"primaryColor"}>
                                To use Augmint you need an Ethereum capable browser.
                            </StyledP>
                            <Header as="h4" className={"tertiaryColor"}>
                                1. Install{" "}
                                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                                    <strong>MetaMask Chrome plugin</strong>
                                </a>
                            </Header>
                            <Header as="h4" className={"tertiaryColor"}>
                                2. Connect to Rinkeby test network
                            </Header>
                            <Video
                                title="connect to rinkeby"
                                src="https://www.youtube.com/embed/0APcMesrZ_U"
                                host="https://www.youtube.com"
                            />
                        </Tsegment.Column>
                    </Tsegment.Row>
                    <Tsegment.Row columns={1}>
                        <Tsegment.Column>
                            <DiscordButton />
                        </Tsegment.Column>
                    </Tsegment.Row>
                </Tsegment>
            </DesktopView>
        </div>
    );
}
