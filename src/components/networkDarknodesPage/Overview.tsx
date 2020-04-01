import { CurrencyIcon, Loading } from "@renproject/react-components";
import React from "react";
import { connect } from "react-redux";

import { Token } from "../../lib/ethereum/tokens";
import { ApplicationState } from "../../store/applicationState";
import {
    ReactComponent as IconDarknodesOnline,
} from "../../styles/icons/icon-darknodes-online.svg";
import { ReactComponent as IconIncome } from "../../styles/icons/icon-income.svg";
import { Change } from "../common/Change";
import { Stat, Stats } from "../common/Stat";
import { TokenBalance } from "../common/TokenBalance";
import { DarknodeMap } from "./darknodeMap/DarknodeMap";
import { MapContainer } from "./mapContainer";

const mapStateToProps = (state: ApplicationState) => ({
    currentCycle: state.network.currentCycle,
    previousCycle: state.network.previousCycle,
    pendingTotalInEth: state.network.pendingTotalInEth,
    quoteCurrency: state.network.quoteCurrency,
    currentShareCount: state.network.currentShareCount,
    currentDarknodeCount: state.network.currentDarknodeCount,
    previousDarknodeCount: state.network.previousDarknodeCount,
    nextDarknodeCount: state.network.nextDarknodeCount,
});

export const Overview = connect(mapStateToProps)(({
    currentCycle, previousCycle, pendingTotalInEth, quoteCurrency,
    currentShareCount, currentDarknodeCount, previousDarknodeCount,
    nextDarknodeCount,
}: ReturnType<typeof mapStateToProps>) => {
    const container = MapContainer.useContainer();
    const current = pendingTotalInEth.get(currentCycle, undefined);
    const previous = pendingTotalInEth.get(previousCycle, undefined);
    const currentSummed = current ? current.times(currentShareCount) : undefined;
    const previousSummed = previous ? previous.times(currentShareCount) : undefined;

    return (
        <div className="overview container">
            <Stats>
                <Stat icon={<IconDarknodesOnline />} message="Darknodes online">
                    <Stats>
                        <Stat message="Registered" big>{currentDarknodeCount === null ? <Loading alt={true} /> : <>
                            {currentDarknodeCount}
                            {previousDarknodeCount !== null ? <Change className="stat--children--diff" change={currentDarknodeCount - previousDarknodeCount} /> : <></>}
                        </>}</Stat>
                        <Stat message="Online" big>
                            {container.darknodeCount === null ? <Loading alt /> : <>
                                {container.darknodeCount}

                            </>}
                        </Stat>
                        <Stat message="Change next epoch" big>{nextDarknodeCount === null || currentDarknodeCount === null ? <Loading alt={true} /> : <>
                            <Change change={nextDarknodeCount - currentDarknodeCount} />
                        </>}</Stat>
                        <Stat message="% Ren Registered" big>{currentDarknodeCount === null ? <Loading alt={true} /> : <>
                            {100 * currentDarknodeCount / 100000}%
                        </>}</Stat>
                    </Stats>
                </Stat>
                <Stat icon={<IconIncome />} message="Darknode rewards">
                    <Stats>
                        {/* <Stat message="All time total" big>$?</Stat> */}
                        <Stat message="Last cycle" highlight big>
                            {previousSummed ? <><CurrencyIcon currency={quoteCurrency} /><TokenBalance
                                token={Token.ETH}
                                convertTo={quoteCurrency}
                                amount={previousSummed}
                            /></> : <Loading alt />}
                        </Stat>
                        <Stat message="Current cycle" big>
                            {currentSummed ? <>
                                <CurrencyIcon currency={quoteCurrency} />
                                <TokenBalance
                                    token={Token.ETH}
                                    convertTo={quoteCurrency}
                                    amount={currentSummed}
                                /></> : <Loading alt />}</Stat>
                    </Stats>
                </Stat>
            </Stats>

            <div className="overview--bottom">
                <DarknodeMap />
                <Stats className="overview--bottom--right">
                    {/* <Stat message="All time total" big>$?</Stat> */}
                    <Stat message="Last cycle" highlight={true} nested={true}>
                        {previousSummed ? <><CurrencyIcon currency={quoteCurrency} /><TokenBalance
                            token={Token.ETH}
                            convertTo={quoteCurrency}
                            amount={previousSummed}
                        /></> : <Loading alt />}
                    </Stat>
                    <Stat message="Last cycle" className="darknode-cli" highlight={true} nested={true}>
                        <div className="darknode-cli--top">
                            <div>
                                Latest CLI Version <b>0.1.0</b>
                            </div>
                            <div>
                                Latest CLI Version <b>0.1.0</b>
                            </div>
                        </div>
                        <button className="darknode-cli--button button">Launch a Darknode</button>
                    </Stat>
                </Stats>
                {/* <RewardChart /> */}
            </div>
        </div>
    );
});