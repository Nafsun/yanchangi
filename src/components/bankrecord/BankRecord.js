import React, { useEffect, useState } from 'react';
import Recieved from './recieved/Recieved';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel, a11yProps } from '../functions/panel';
import Cancel from '@material-ui/icons/Cancel';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Naira from '../functions/naira';
import NoInternetConnection from '../nointernetconnection/NoInternetConnection';

const TOTALSINGLEBANKBALANCE = gql`
    query totalsinglebankbalance($username: String, $bankname: String, $bankaccountnumber: String, $jwtauth: String){
        totalsinglebankbalance(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, jwtauth: $jwtauth){
            totalbalance
        }
    }
`;

function BankRecord() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const BankTransactions = useSelector(s => s.BankTransactions);
    const [waitloadGet, waitloadSet] = useState(false);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const sizeoflogoprofile = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    useEffect(() => {
        if (userinfo === null) { // verifying if a user login
            document.getElementById("hidelogin").click();
        } else if (BankTransactions.length === 0) {
            document.getElementById("hideaccount").click();
        }
    }, [userinfo, BankTransactions]);

    const goback = () => {
        window.history.back();
    }

    const { error, data, refetch } = useQuery(TOTALSINGLEBANKBALANCE,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, bankname: BankTransactions[0], bankaccountnumber: BankTransactions[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                }
            }
        });

    if (error) {
        return <div className="internetclass"><NoInternetConnection error={error.toString()} /></div>;
    }

    return (
        <div>
            <div className="downsmall3">
                <p
                    className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                        <Cancel style={sizeoflogoprofile}></Cancel></span>
                </p>
                <p className="loginjobs7">{`${BankTransactions[0]} (${BankTransactions[1]})`}</p>
                <Helmet>
                    <title>{`${BankTransactions[0]} (${BankTransactions[1]})`}</title>
                </Helmet>
                {waitloadGet === false ?
                    ""
                :
                    <p className="totaleverything">Total Balance: <span>{Naira(data.totalsinglebankbalance.totalbalance)}</span></p>
                }
                <div id="homeexpander4">
                    <AppBar position="static" style={{ backgroundColor: "rgb(107, 43, 8)", borderRadius: "2px" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                        >
                            <Tab label="Recieved/Pay" {...a11yProps(0)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <Recieved refetch={refetch} />
                    </TabPanel>
                </div>
                <br />
                <br />
                <br />
            </div>
        </div>
    );
}

export default BankRecord;