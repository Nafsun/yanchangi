import React, { useEffect, useState } from 'react';
import AllInfo from './allinfo/AllInfo';
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

//All totals for a supplier 
const TOTALFORSUPPLIER = gql` 
    query totalforsupplier($username: String, $supplier: String, $supplieraccountno: String, $jwtauth: String){
        totalforsupplier(username: $username, supplier: $supplier, supplieraccountno: $supplieraccountno, jwtauth: $jwtauth){
            totalbalance
        }
    }
`;

function SingleSupplier() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [waitloadGet, waitloadSet] = useState(false);
    const SupplierChangi = useSelector(s => s.SupplierChangi);

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
        } else if (SupplierChangi.length === 0) {
            document.getElementById("hideaccount").click();
        }
    }, [userinfo, SupplierChangi]);

    const goback = () => {
        window.history.back();
    }

    const { error, data, refetch } = useQuery(TOTALFORSUPPLIER,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, supplier: SupplierChangi[0], supplieraccountno: SupplierChangi[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
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
                <p className="loginjobs7">{`${SupplierChangi[0]} (${SupplierChangi[1]})`}</p>
                <Helmet>
                    <title>{`${SupplierChangi[0]} (${SupplierChangi[1]})`}</title>
                </Helmet>
                {waitloadGet === false ?
                    ""
                    :
                    <p className="totaleverything">Total Balance: <span>{Naira(data.totalforsupplier.totalbalance)}</span></p>
                }
                <div id="homeexpander4">
                    <AppBar position="static" style={{ backgroundColor: "rgb(107, 43, 8)", borderRadius: "2px" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            centered
                        >
                            <Tab label="INFO" {...a11yProps(0)} /> {/* icon={<PhoneIcon />} */}
                            <Tab label="Recieved/Pay" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <AllInfo refetch={refetch} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
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

export default SingleSupplier;