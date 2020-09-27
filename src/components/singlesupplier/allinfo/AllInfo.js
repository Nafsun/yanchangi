import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import { Loading, CurrentLoading, JustLoading } from '../../loading/Loading';
import { useSelector } from 'react-redux';
import NumberCheck from '../../functions/numbercheck';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import MoreVert from '@material-ui/icons/MoreVert';
import DialogPopper from '../../functions/dialogpopper';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import Naira from '../../functions/naira';
import Transaction from '../../account/transaction/Transaction';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

const TOTALITYFORSUPPLIER = gql`
    query totalityforsupplier($username: String, $supplier: String, $supplieraccountno: String, $jwtauth: String){
        totalityforsupplier(username: $username, supplier: $supplier, supplieraccountno: $supplieraccountno, jwtauth: $jwtauth){
            amount, customerrate, customerngn, supplierrate, supplierngn, profit
        }
    }
`;

//All buy and sell customer
const BUYANDSELLGETSUPPLIER = gql` 
    query buyandsellgetsupplier($username: String, $supplier: String, $supplieraccountno: String, $startc: Int, $endc: Int, $jwtauth: String){
        buyandsellgetsupplier(username: $username, supplier: $supplier, supplieraccountno: $supplieraccountno, startc: $startc, endc: $endc, jwtauth: $jwtauth){
            id, username, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit, date
        }
    }
`;

//delete 
const BUYANDSELLDELETE = gql`
    mutation buyandselldelete($id: String, $username: String, $jwtauth: String){
        buyandselldelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Updating 
const BUYANDSELLUPDATE = gql` 
    mutation buyandsellupdate($id: String, $username: String, $amount1: String, $rate1: String, $ngn1: String, $supplier: String, $supplieraccountno: String, $customer: String, $customeraccountno: String, $rate2: String, $ngn2: String, $profit: String, $jwtauth: String){
        buyandsellupdate(id: $id, username: $username, amount1: $amount1, rate1: $rate1, ngn1: $ngn1, supplier: $supplier, supplieraccountno: $supplieraccountno, customer: $customer, customeraccountno: $customeraccountno, rate2: $rate2, ngn2: $ngn2, profit: $profit, jwtauth: $jwtauth){
            error
        }
    }
`;

const ACCESSVERIFY = gql`
    query accessverify($username: String, $jwtauth: String){
        accessverify(username: $username, jwtauth: $jwtauth){
            username, createdby, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance
        }
    }
`;

let starter2 = 0;
let ender2 = 50;
let accountno_save = "";

function AllInfo(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [buyandsellupdatemutation] = useMutation(BUYANDSELLUPDATE);
    const [deletepostmutation] = useMutation(BUYANDSELLDELETE);
    const SupplierChangi = useSelector(s => s.SupplierChangi);
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);

    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);

    const [idGet, idSet] = useState(null);
    const [amount1Get, amount1Set] = useState(null);
    const [rate1Get, rate1Set] = useState(null);
    const [ngn1Get, ngn1Set] = useState(null);
    const [supplierGet, supplierSet] = useState(null);
    const [supplieraccountnoGet, supplieraccountnoSet] = useState(null);
    const [customerGet, customerSet] = useState(null);
    const [customeraccountnoGet, customeraccountnoSet] = useState(null);
    const [rate2Get, rate2Set] = useState(null);
    const [ngn2Get, ngn2Set] = useState(null);
    const [profitGet, profitSet] = useState(null);

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);

    useEffect(() => { //convert then to initial values when you change page
        if (SupplierChangi[1] !== accountno_save) {
            starter2 = 0;
            ender2 = 50;
            accountno_save = SupplierChangi[1];
        }
    }, [SupplierChangi]);

    const sizeoflogo = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    const accessv = useQuery(ACCESSVERIFY,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache'
        });

    const totality = useQuery(TOTALITYFORSUPPLIER,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, supplier: SupplierChangi[0], supplieraccountno: SupplierChangi[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (totality.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(BUYANDSELLGETSUPPLIER,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, supplier: SupplierChangi[0], supplieraccountno: SupplierChangi[1], startc: starter2, endc: ender2, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                    nextClickSet(false);
                }
            }
        });

    if (accessv.loading) {
        return <JustLoading />;
    }

    if (accessv.error) {
        return <div className="internetclass"><NoInternetConnection error={accessv.error.toString()} /></div>;
    }

    if (totality.error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const NextBroadcast = () => {
        waitloadSet(false);
        starter2 = starter2 + 50;
        refetch({ variables: { startc: starter2, endc: ender2 } });
    }

    const PreviousBroadcast = () => {
        waitloadSet(false);
        starter2 = starter2 - 50;
        if (starter2 < 0) {
            starter2 = 0;
            refetch({ variables: { startc: starter2, endc: ender2 } });
        } else {
            refetch({ variables: { startc: starter2, endc: ender2 } });
        }
    }

    const DeletePost = () => {
        deleteSetter(false);
        nextClickSet(true);
        deletepostmutation({ variables: { id: deleteidGet, username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => { //updating a like 
            if (data.buyandselldelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.buyandselldelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Client Successfully Deleted");
                refetch();
                totality.refetch();
                props.refetch();
            }
            nextClickSet(false);
        }).catch((e) => {
            MutationError(e.toString())
        });
    }

    const DontDeletePost = () => {
        deleteSetter(false);
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const OpenEdit = (id, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit) => {
        idSet(id); amount1Set(amount1); rate1Set(rate1); ngn1Set(ngn1);
        supplierSet(supplier); customerSet(customer);
        rate2Set(rate2);
        ngn2Set(ngn2); profitSet(profit);
        supplieraccountnoSet(supplieraccountno);
        customeraccountnoSet(customeraccountno);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

        let amount1 = document.getElementById("amount1id").value.replace(/(<([^>]+)>)/ig, "");
        let rate1 = document.getElementById("rate1id").value.replace(/(<([^>]+)>)/ig, "");
        let ngn1 = document.getElementById("ngn1id").value.replace(/(<([^>]+)>)/ig, "");
        let supplier = document.getElementById("supplierid").value.replace(/(<([^>]+)>)/ig, "");
        let supplieraccountno = document.getElementById("supplieraccountnoid").value.replace(/(<([^>]+)>)/ig, "");
        let customer = document.getElementById("customerid").value.replace(/(<([^>]+)>)/ig, "");
        let customeraccountno = document.getElementById("customeraccountnoid").value.replace(/(<([^>]+)>)/ig, "");
        let rate2 = document.getElementById("rate2id").value.replace(/(<([^>]+)>)/ig, "");
        let ngn2 = document.getElementById("ngn2id").value.replace(/(<([^>]+)>)/ig, "");
        let profit = document.getElementById("profitid").value.replace(/(<([^>]+)>)/ig, "");

        if (amount1 === "") { PopBoxerEnd(true); PopBox("Supplier Amount cannot be empty"); return false; }
        if (rate1 === "") { PopBoxerEnd(true); PopBox("Supplier Rate cannot be empty"); return false; }
        if (ngn1 === "") { PopBoxerEnd(true); PopBox("Supplier NGN cannot be empty"); return false; }
        if (supplier === "") { PopBoxerEnd(true); PopBox("Supplier Name cannot be empty"); return false; }
        if (supplieraccountno === "") { PopBoxerEnd(true); PopBox("Supplier Account Number cannot be empty"); return false; }
        if (customer === "") { PopBoxerEnd(true); PopBox("Customer Name cannot be empty"); return false; }
        if (customeraccountno === "") { PopBoxerEnd(true); PopBox("Customer Account Number cannot be empty"); return false; }
        if (rate2 === "") { PopBoxerEnd(true); PopBox("Customer Rate cannot be empty"); return false; }
        if (ngn2 === "") { PopBoxerEnd(true); PopBox("Customer NGN cannot be empty"); return false; }
        if (profit === "") { PopBoxerEnd(true); PopBox("Profit cannot be empty"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);
        editSet(false);

        buyandsellupdatemutation({ variables: { id: idGet, username: u, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.buyandsellupdate.error === "no") {
                PopBoxerEnd(true);
                PopBox("Successfully Edited");
                refetch();
                totality.refetch();
                props.refetch();
            } else if (data.buyandsellupdate.error === "supplieraccountnotaken") {
                PopBoxerEnd(true); PopBox("This Account number is already assign to another supplier, please choose another one");
            } else if (data.buyandsellupdate.error === "customeraccountnotaken") {
                PopBoxerEnd(true); PopBox("This Account number is already assign to another customer, please choose another one");
            }
        }).catch((e) => {
            MutationError(e.toString())
        });
    }

    const BringOutDelete = (id) => {
        deleteidSet(id);
        deleteSetter(true);
    }

    const NGN1Func = () => {
        NumberCheck("amount1id");
        NumberCheck("rate1id");
        let amount1 = document.getElementById("amount1id").value.replace(/(<([^>]+)>)/ig, "");
        let rate1 = document.getElementById("rate1id").value.replace(/(<([^>]+)>)/ig, "");
        let ngn1 = document.getElementById("ngn1id");
        let profit = document.getElementById("profitid");
        let total = parseFloat(amount1) * parseFloat(rate1);
        if (!isNaN(total)) {
            ngn1.value = Math.round(total);
            ProfitFunc();
        } else {
            ngn1.value = "";
            profit.value = "";
        }
    }

    const NGN2Func = () => {
        NumberCheck("amount1id");
        NumberCheck("rate2id");
        let amount1 = document.getElementById("amount1id").value.replace(/(<([^>]+)>)/ig, "");
        let rate2 = document.getElementById("rate2id").value.replace(/(<([^>]+)>)/ig, "");
        let ngn2 = document.getElementById("ngn2id");
        let profit = document.getElementById("profitid");
        let total = parseFloat(amount1) * parseFloat(rate2);
        if (!isNaN(total)) {
            ngn2.value = Math.round(total);
            ProfitFunc();
        } else {
            ngn2.value = "";
            profit.value = "";
        }
    }

    const ProfitFunc = () => {
        let ngn1 = document.getElementById("ngn1id").value.replace(/(<([^>]+)>)/ig, "");
        let ngn2 = document.getElementById("ngn2id").value.replace(/(<([^>]+)>)/ig, "");
        let profit = document.getElementById("profitid");
        let total = parseFloat(ngn2) - parseFloat(ngn1);
        if (!isNaN(total)) {
            profit.value = Math.round(total);
        } else {
            profit.value = "";
        }
    }

    const BothNGNFunc = () => {
        NGN1Func();
        NGN2Func();
    }

    return (
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div>
                    <div className="workspace2">
                        <div className="jobcontainer2">

                            {nextClickGet === true ? <Loading /> : ""}

                            {data.buyandsellgetsupplier.length === 0 && starter2 === 0 && nextClickGet === false ? <p align="center" className="datef">You have not bought any currency from {SupplierChangi[0]} yet</p> : ""}
                            {data.buyandsellgetsupplier.length === 0 && starter2 > 0 ? <p align="center" className="datef">No More Transactions</p> : ""}
                            {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                            {data.buyandsellgetsupplier.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                            <div className="changefloat2"></div>

                            <table align="center">
                                {data.buyandsellgetsupplier.length === 0 && (starter2 > 0 || starter2 === 0) ? <thead></thead> :
                                    <thead>
                                        <tr className="tablecolumdesign">
                                            <td>Supplied Amount</td>
                                            <td>Supplier Rate</td>
                                            <td>Supplier NGN</td>
                                            <td>Customer Rate</td>
                                            <td>Customer NGN</td>
                                            <td>Customer Name</td>
                                            <td>Customer Account No</td>
                                            <td>Profit/Loss</td>
                                            <td>Date and Time</td>
                                            {accessv.data.accessverify.edittransaction === "yes" || accessv.data.accessverify.deletetransaction === "yes" ?
                                                <td>Edit</td>
                                            : ""}
                                        </tr>
                                    </thead>
                                }
                                <tbody>
                                    {data.buyandsellgetsupplier.map((t) => (
                                        <tr className="tablecolumdesign2" key={t.id}>
                                            <td>{Naira(t.amount1)}</td>
                                            <td>{t.rate1}</td>
                                            <td>{Naira(t.ngn1)}</td>
                                            <td>{t.rate2}</td>
                                            <td>{Naira(t.ngn2)}</td>
                                            <td>{t.customer}</td>
                                            <td>{t.customeraccountno}</td>
                                            <td>{Naira(t.profit)}</td>
                                            <td>{t.date}</td>
                                            {accessv.data.accessverify.edittransaction === "yes" || accessv.data.accessverify.deletetransaction === "yes" ?
                                            <td><IconMenu
                                                iconButtonElement={<IconButton><MoreVert style={{ color: "rgb(107, 43, 8)" }}></MoreVert></IconButton>}
                                                useLayerForClickAway={true}
                                                targetOrigin={{ vertical: "bottom", horizontal: "left" }}
                                            >
                                                <List>
                                                {accessv.data.accessverify.deletetransaction === "yes" ?
                                                    <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                : ""}
                                                {accessv.data.accessverify.edittransaction === "yes" ?
                                                    <ListItem onClick={() => OpenEdit(t.id, t.amount1, t.rate1, t.ngn1, t.supplier, t.supplieraccountno, t.customer, t.customeraccountno, t.rate2, t.ngn2, t.profit)}>Edit</ListItem>
                                                : ""}
                                                </List>
                                            </IconMenu></td>
                                            : ""}
                                        </tr>
                                    ))}
                                    {data.buyandsellgetsupplier.length === 0 && (starter2 > 0 || starter2 === 0) ? <tr className="tablecolumdesign3"></tr> :
                                        <tr className="tablecolumdesign3">
                                            <td>{waitloadGet2 === false ? "" : Naira(totality.data.totalityforsupplier.amount)}</td>
                                            <td>{waitloadGet2 === false ? "" : totality.data.totalityforsupplier.supplierrate}</td>
                                            <td>{waitloadGet2 === false ? "" : Naira(totality.data.totalityforsupplier.supplierngn)}</td>
                                            <td>{waitloadGet2 === false ? "" : totality.data.totalityforsupplier.customerrate}</td>
                                            <td>{waitloadGet2 === false ? "" : Naira(totality.data.totalityforsupplier.customerngn)}</td>
                                            <td></td>
                                            <td></td>
                                            <td>{waitloadGet2 === false ? "" : Naira(totality.data.totalityforsupplier.profit)}</td>
                                            <td></td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="changefloat2"></div>
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.buyandsellgetsupplier.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>
                    </div>

                    {PopBoxerStart ?
                        <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                        : ""}
                    {deleteGetter === true ?
                        <DialogPopper Title="Delete Client"
                            Describtion="Are you Sure?"
                            Yes={DeletePost} No={DontDeletePost} />
                        : ""}
                    {editGet === true ?
                        <div className="hiddenedit">
                            <p className="abovelinkmenu">
                                <span onClick={() => BackEdit()} id="navarrback"><ArrowBack style={sizeoflogo}></ArrowBack></span>
                            </p>
                            <div id="scrolldown" className="menufloat">
                                <div className="menudesign4">
                                    <ThemeProvider theme={theme}>
                                        <TextField
                                            id="amount1id" label="Supplier Amount" fullWidth={true} defaultValue={amount1Get}
                                            margin="normal" onChange={() => BothNGNFunc()} />
                                        <TextField
                                            id="rate1id" label="Supplier Rate" fullWidth={true} defaultValue={rate1Get}
                                            margin="normal" onChange={() => NGN1Func()} />
                                        <TextField
                                            id="ngn1id" label="Supplier NGN" fullWidth={true} defaultValue={ngn1Get}
                                            margin="normal" disabled />
                                        <TextField
                                            id="supplierid" label="Supplier Name" fullWidth={true} defaultValue={supplierGet}
                                            margin="normal" />
                                        <TextField
                                            id="supplieraccountnoid" label="Supplier Account No" fullWidth={true} defaultValue={supplieraccountnoGet}
                                            margin="normal" />
                                        <TextField
                                            id="customerid" label="Customer Name" fullWidth={true} defaultValue={customerGet}
                                            margin="normal" />
                                        <TextField
                                            id="customeraccountnoid" label="Customer Account No" fullWidth={true} defaultValue={customeraccountnoGet}
                                            margin="normal" />
                                        <TextField
                                            id="rate2id" label="Customer Rate" fullWidth={true} defaultValue={rate2Get}
                                            margin="normal" onChange={() => NGN2Func()} />
                                        <TextField
                                            id="ngn2id" label="Customer NGN" fullWidth={true} defaultValue={ngn2Get}
                                            margin="normal" disabled />
                                        <TextField
                                            id="profitid" label="Profit" fullWidth={true} defaultValue={profitGet}
                                            margin="normal" disabled />
                                        <Button
                                            fullWidth={true}
                                            onClick={() => EditingClientUpdate()}
                                            style={{ color: "white", backgroundColor: "rgb(107, 43, 8)" }}
                                        >Edit</Button>
                                    </ThemeProvider>
                                </div>
                                <br />
                            </div>
                        </div>
                        : ""}
                </div>
            }
            {accessv.data.accessverify.createtransaction === "yes" ?
                <Transaction refetchtotal={props.refetch} refetch={refetch} suppliername={SupplierChangi[0]} supplieraccountno={SupplierChangi[1]} totalityrefetch={totality.refetch} />
                : ""}
        </div>
    );
}

export default AllInfo;