import * as React from "react";

import { Blocky, Loading } from "@renproject/react-components";

import { classNames } from "../../lib/react/className";
import { NetworkStateContainer } from "../../store/networkStateContainer";
import { Web3Container } from "../../store/web3Store";
import { ExternalLink } from "./ExternalLink";

export const AccountDropdown: React.FC<Props> = () => {
    const [shown, setShown] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const { address, web3BrowserName, renNetwork, promptLogin, logout } = Web3Container.useContainer();
    const { transactions, confirmations } = NetworkStateContainer.useContainer();

    const ref = React.useRef(null as HTMLDivElement | null);

    const handleLogin = async (): Promise<void> => {
        setShown(false);
        if (!address) {
            await promptLogin({ manual: true, redirect: false, showPopup: true, immediatePopup: true });
        }
    };

    const handleLogout = async (): Promise<void> => {
        setShown(false);
        logout();
    };

    const copyToClipboard = (e: React.MouseEvent<HTMLElement>): void => {
        const el = e.currentTarget.childNodes[0] as Element;
        const value = el.getAttribute("data-addr");
        if (value) {
            const fauxInput = document.createElement("input");
            document.body.appendChild(fauxInput);
            fauxInput.setAttribute("value", value);
            fauxInput.select();
            document.execCommand("copy");
            document.body.removeChild(fauxInput);
        }
        setCopied(true);
    };

    // tslint:disable-next-line: no-any
    const clickAway = (event: any) => {
        if (ref) {
            const current = ref.current;
            if ((current && !current.contains(event.target))) {
                setShown(false);
            }
        }
        document.removeEventListener("mousedown", clickAway);
    };

    const toggle = () => {
        const newShown = !shown;
        setShown(newShown);

        if (newShown) {
            document.addEventListener("mousedown", clickAway);
        } else {
            document.removeEventListener("mousedown", clickAway);
        }
    };


    // `pendingTXs` calculates whether or not the user has any ethereum
    // transactions that haven't been confirmed yet.
    const pendingTXs = transactions.reduce((reduction: boolean, _value, key: string) => {
        return reduction || confirmations.get(key, 0) === 0;
    }, false);

    return <div
        className="header--group header--group--account"
        ref={ref}
    >
        <div
            className={classNames("header--account", "header--selected", address ? "header--account--logged-in" : "header--account--logged-out")}
            role="menuitem"
            onClick={address ? toggle : handleLogin}
        >
            {address ?
                <>
                    <Blocky address={address} />
                    <div className="header--account--right header--account--connected">
                        <div className="header--account--type">
                            {web3BrowserName} {pendingTXs ? <Loading alt className="header--account--spinner" /> : <></>}
                        </div>
                        <div className="header--account--address">
                            {address.substring(0, 8)}...{address.slice(-5)}
                        </div>
                    </div>
                </> :
                <>
                    <div className="wallet-icon">
                        <div className="wallet-icon--inner" />
                    </div>
                    <div className="header--account--right header--account--disconnected">
                        <div className="header--account--type">
                            Connect {web3BrowserName}
                        </div>
                        <div className="header--account--address">Manage your Darknode</div>
                    </div>
                </>
            }
        </div>

        {address && shown ?
            <div className="header--dropdown--spacing header--dropdown--options header--dropdown--accounts">
                <ul className={["header--dropdown", !address ? "header--dropdown--login" : ""].join(" ")}>
                    <li role="button" onClick={copyToClipboard} className="header--dropdown--option">
                        <span data-addr={address}>
                            {copied ?
                                <span>Copied</span>
                                :
                                <span>Copy to clipboard</span>
                            }
                        </span>
                    </li>
                    <li
                        role="button"
                        onClick={handleLogout}
                        className="header--dropdown--option"
                    >
                        Log out
                    </li>
                    {transactions.size > 0 ?
                        <>
                            {transactions.map((_tx, txHash) => {
                                const txConfirmations = confirmations.get(txHash, 0);
                                return <li key={txHash} className="transaction">
                                    {txConfirmations === 0 ? <Loading /> : <></>}
                                    {txConfirmations === -1 ? <span className="red">(ERR) {" "}</span> : <></>}
                                    <ExternalLink className="transaction--hash" href={`${renNetwork.etherscan}/tx/${txHash}`}>{txHash.substring(0, 12)}...</ExternalLink>
                                    {txConfirmations > 0 ? <>{" "}({txConfirmations} conf.)</> : ""}
                                </li>;
                            }).valueSeq().toArray()}
                        </> : <></>
                    }
                </ul>
            </div> : <></>
        }
    </div>;
};

interface Props {
}
