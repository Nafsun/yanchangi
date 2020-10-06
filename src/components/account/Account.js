import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import { profileImage } from '../../actions';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Cancel from '@material-ui/icons/Cancel';
import Edits from './edit/Edit';
import NoInternetConnection from '../nointernetconnection/NoInternetConnection';
import { Loading, JustLoading } from '../loading/Loading';
import { TabPanel, a11yProps } from '../functions/panel';
import loaderimage from '../images/textail-logo.png';
import { Helmet } from "react-helmet";
import DialogInfo from '../functions/dialoginfo';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../functions/theme';
import MutationError from '../functions/mutationerror';
import ValidateEmail from '../functions/validateemail';
import Transaction from './transaction/Transaction';
import EditTransaction from './edittransaction/EditTransaction';
import RecieveOrPay from './recieveorpay/RecieveOrPay';
import EditReceiveOrPay from './editreceiveorpay/EditReceiveOrPay';
import AddBanks from './addbanks/AddBanks';
import EditBanks from './editbanks/EditBanks';
import Naira from '../functions/naira';
import AccessControl from './accesscontrol/AccessControl';
import EditAccessControl from './editaccesscontrol/EditAccessControl';
import Expenses from './expenses/Expenses';
import EditExpenses from './editexpenses/EditExpenses';
import OpeningBalance from './openingbalance/OpeningBalance';
import EditOpeningBalance from './editopeningbalance/EditOpeningBalance';
import Reconcile from './reconcile/Reconcile';
import EditReconcile from './editreconcile/EditReconcile';

const ACCOUNTINFO = gql`
    query accountInfo($username: String, $jwtauth: String){
        accountInfo(username: $username, jwtauth: $jwtauth){
            fullname, email, username, businessname, picture, emailverify, error, 
            verifymembership
        }
    }
`;

const CHANGEEMAIL = gql`
    mutation changeemail($username: String, $email: String, $jwtauth: String){
        changeemail(username: $username, email: $email, jwtauth: $jwtauth){
            error
        }
    }
`;

const TOTALTRANSACTIONS = gql`
    query totaltransactions($username: String, $jwtauth: String){
        totaltransactions(username: $username, jwtauth: $jwtauth){
            totalbalance, totaldebt, totaloverdraft, net, totalprofit, totalexpense, netprofit
        }
    }
`;

const ACCESSVERIFY = gql`
    query accessverify($username: String, $jwtauth: String){
        accessverify(username: $username, jwtauth: $jwtauth){
            username, createdby, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, createreconcile, editreconcile, deletereconcile
        }
    }
`;

let tracker = 0;

function Account() {

    const [changeemailmutation] = useMutation(CHANGEEMAIL);
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const dispatch = useDispatch();
    const getImager = useSelector(ad => ad.pimage); //profile image getter
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editEmailGet, editEmailSet] = useState(false);

    const sizeoflogoprofile = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    const [value, setValue] = useState(tracker);

    const handleChange = (event, newValue) => {
        tracker = newValue;
        setValue(newValue);
    };

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    useEffect(() => {
        if (userinfo === null) { // verifying if a user login
            document.getElementById("hidelogin").click();
        }
    }, [userinfo]);

    const accessv = useQuery(ACCESSVERIFY,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache'
        });

    const totals = useQuery(TOTALTRANSACTIONS,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (totals.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(ACCOUNTINFO,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    dispatch(profileImage(data.accountInfo.picture)); //emailverify, picture
                    if (data.accountInfo.emailverify === "no") {
                        PopBoxerEnd(true);
                        PopBox("Please verify your email");
                    }
                    waitloadSet(true);
                }
            }
        });

    if (accessv.loading) {
        return <JustLoading />;
    }

    if (accessv.error) {
        return <div className="internetclass"><NoInternetConnection error={accessv.error.toString()} /></div>;
    }

    if (error) {
        return <div className="internetclass"><NoInternetConnection error={error.toString()} /></div>;
    }

    if (totals.error) {
        return <div className="internetclass"><NoInternetConnection error={totals.error.toString()} /></div>;
    }

    const goback = () => {
        window.history.back();
    }

    const UnhideEmailEdit = () => {
        editEmailSet(!editEmailGet);
    }

    const EmailChanger = () => {

        let email = document.getElementById("emailchange").value;

        if (email === "") { PopBoxerEnd(true); PopBox("New Email not set"); return false; }
        if (ValidateEmail(email) === false) { PopBoxerEnd(true); PopBox("invalid email"); return false; }

        changeemailmutation({ variables: { username: userinfo.loginAccount.username, email: email, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => {
            if (data.changeemail.error === "no") {
                PopBoxerEnd(true);
                PopBox("Email Successfully Changed");
                editEmailSet(!editEmailGet);
                refetch({ variables: { username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } });
            } else if (data.changeemail.error === "verified") {
                PopBoxerEnd(true);
                PopBox("Email is already verified and cannot be changed");
                editEmailSet(!editEmailGet);
            }
        }).catch((e) => {
            MutationError(e.toString());
        });
    }

    return (
        <div>
            {waitloadGet === false ?
                <Loading />
                :
                <div className="downsmall3">
                    <p
                        className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                            <Cancel style={sizeoflogoprofile}></Cancel></span>
                    </p>
                    <p className="loginjobs6">Account</p>
                    <Helmet>
                        <title>Account</title>
                    </Helmet>
                    <Grid container direction="row" alignItems="flex-start" justify="flex-start" spacing={1}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div>
                                <br />
                                <div id="homeexpander5">
                                    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                            <div className="avatarpics">
                                                {getImager !== null ?
                                                    <img className="imagejobcontainer6" src={getImager} alt="profile" />
                                                    :
                                                    <img className="imagejobcontainer6" src={loaderimage} alt="profile" />
                                                }
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <div className="accountspace">
                                        {data.accountInfo.emailverify === "yes" ? "" : <p className="accountinfo">{data.accountInfo.email} {data.accountInfo.emailverify !== "yes" ? <Edit onClick={() => UnhideEmailEdit()} style={{ width: "1em", height: "1em", cursor: "pointer" }} /> : ""}</p>}
                                        <p className="accountinfo">{data.accountInfo.businessname === null || data.accountInfo.businessname === "" ? "" : data.accountInfo.businessname}</p>
                                        <p className="accountinfo">Total Balance: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.totalbalance)}</span></p>
                                        <p className="accountinfo">Total Debt: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.totaldebt)}</span></p>
                                        <p className="accountinfo">Total Overdraft: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.totaloverdraft)}</span></p>
                                        <p className="accountinfo">Total Expenses: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.totalexpense)}</span></p>
                                        <p className="accountinfo">Net: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.net)}</span></p>
                                        <p className="accountinfo">Total Profit: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.totalprofit)}</span></p>
                                        <p className="accountinfo">Net Profit: <span className="totality">{waitloadGet2 === false ? "" : Naira(totals.data.totaltransactions.netprofit)}</span></p>
                                        {editEmailGet === true ?
                                            <div>
                                                <ThemeProvider theme={theme}>
                                                    <TextField
                                                        type="text" id="emailchange" label="New Email" fullWidth={true}
                                                        margin="normal" variant="outlined" />
                                                    <Button
                                                        fullWidth={true}
                                                        onClick={() => EmailChanger()}
                                                        style={{ color: "white", backgroundColor: "rgb(107, 43, 8)", padding: "13px" }}
                                                    >Change</Button>
                                                </ThemeProvider>
                                            </div>
                                            : ""}
                                    </div>
                                    <br />
                                    <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                                        {data.accountInfo.emailverify === "no" ? <Grid item xs={4} sm={4} md={4} lg={4} xl={4}><p className="centerdivider" onClick={() => document.getElementById("hideverifyemail").click()}>Verify Email</p></Grid> : ""}
                                    </Grid>
                                    <Divider />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div id="homeexpander5">
                                <AppBar position="static" style={{ backgroundColor: "rgb(107, 43, 8)", borderRadius: "2px" }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        scrollButtons="auto"
                                        variant="scrollable"
                                    >
                                        <Tab label="Transaction" {...a11yProps(0)} />
                                        <Tab label="Transaction List" {...a11yProps(1)} />
                                        <Tab label="Recieved/Pay" {...a11yProps(2)} />
                                        <Tab label="Recieved/Pay List" {...a11yProps(3)} />
                                        <Tab label="Expenses" {...a11yProps(4)} />
                                        <Tab label="Expenses List" {...a11yProps(5)} />
                                        <Tab label="Add Bank" {...a11yProps(6)} />
                                        <Tab label="Bank List" {...a11yProps(7)} />
                                        <Tab label="Add Supplier/Customer" {...a11yProps(8)} />
                                        <Tab label="Supplier/Customer List" {...a11yProps(9)} />
                                        <Tab label="Reconcile" {...a11yProps(10)} />
                                        <Tab label="Reconcile List" {...a11yProps(11)} />
                                        {accessv.data.accessverify.createdby === "no" ?
                                        <Tab label="Access Control" {...a11yProps(12)} />
                                        : ""}
                                        {accessv.data.accessverify.createdby === "no" ?
                                        <Tab label="Edit Access Control" {...a11yProps(13)} />
                                        : ""}
                                        {accessv.data.accessverify.createdby === "no" ?
                                        <Tab label="Edit Profile" {...a11yProps(14)} />
                                        : ""}
                                    </Tabs>
                                </AppBar>
                                {accessv.data.accessverify.createtransaction === "yes" ?
                                    <TabPanel value={value} index={0}>
                                        <Transaction refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={0}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.edittransaction === "yes" || accessv.data.accessverify.deletetransaction === "yes" ?
                                    <TabPanel value={value} index={1}>
                                        <EditTransaction refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={1}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createrecieveorpay === "yes" ?
                                    <TabPanel value={value} index={2}>
                                        <RecieveOrPay refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={2}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.editrecieveorpay === "yes" || accessv.data.accessverify.deleterecieveorpay === "yes" ?
                                    <TabPanel value={value} index={3}>
                                        <EditReceiveOrPay refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={3}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createexpense === "yes" ?
                                    <TabPanel value={value} index={4}>
                                        <Expenses refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={4}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.editexpense === "yes" || accessv.data.accessverify.deleteexpense === "yes" ?
                                    <TabPanel value={value} index={5}>
                                        <EditExpenses refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={5}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createbank === "yes" ?
                                    <TabPanel value={value} index={6}>
                                        <AddBanks refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={6}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.editbank === "yes" || accessv.data.accessverify.deletebank === "yes" ?
                                    <TabPanel value={value} index={7}>
                                        <EditBanks refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={7}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createopeningbalance === "yes" ?
                                    <TabPanel value={value} index={8}>
                                        <OpeningBalance refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={8}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.editopeningbalance === "yes" || accessv.data.accessverify.deleteopeningbalance === "yes" ?
                                    <TabPanel value={value} index={9}>
                                        <EditOpeningBalance refetcher={totals.refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={9}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createreconcile === "yes" ?
                                    <TabPanel value={value} index={10}> 
                                        <Reconcile refetcher={totals.refetch} refetch={refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={10}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.editreconcile === "yes" || accessv.data.accessverify.deletereconcile === "yes" ?
                                    <TabPanel value={value} index={11}>
                                        <EditReconcile refetcher={totals.refetch} refetch={refetch} />
                                    </TabPanel>
                                    :
                                    <TabPanel value={value} index={11}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createdby === "no" ?
                                    <TabPanel value={value} index={12}>
                                        <AccessControl />
                                    </TabPanel>
                                :
                                    <TabPanel value={value} index={12}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createdby === "no" ?
                                    <TabPanel value={value} index={13}>
                                        <EditAccessControl />
                                    </TabPanel>
                                :
                                    <TabPanel value={value} index={13}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                                {accessv.data.accessverify.createdby === "no" ?
                                    <TabPanel value={value} index={14}>
                                        <Edits refetch={refetch} />
                                    </TabPanel>
                                :
                                    <TabPanel value={value} index={14}>
                                        <p className="donthaveaccess">You don't have access to this section</p>
                                    </TabPanel>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            }
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                : ""}
            <br />
            <br />
            <br />
        </div>
    );
}

export default Account;