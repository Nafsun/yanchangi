import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import { Loading } from '../../loading/Loading';
import NumberCheck from '../../functions/numbercheck';
import MenuItem from '@material-ui/core/MenuItem';
import imageloading from "../../images/loading.gif";
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//Upload a buy and sell information
const BUYANDSELLINSERT = gql`
    mutation buyandsellinsert($username: String, $amount1: String, $rate1: String, $ngn1: String, $supplier: String, $supplieraccountno: String, $customer: String, $customeraccountno: String, $rate2: String, $ngn2: String, $profit: String, $jwtauth: String){
        buyandsellinsert(username: $username, amount1: $amount1, rate1: $rate1, ngn1: $ngn1, supplier: $supplier, supplieraccountno: $supplieraccountno, customer: $customer, customeraccountno: $customeraccountno, rate2: $rate2, ngn2: $ngn2, profit: $profit, jwtauth: $jwtauth){
            error
        }
    }
`;

//Get Previous Users INfo History Information
const GETPREVIOUSUSERSINFO = gql` 
    query getprevioususersinfo($username: String, $jwtauth: String){
        getprevioususersinfo(username: $username, jwtauth: $jwtauth){
            id, type, name, accountno
        }
    }
`;

const GENERATEACCOUNTNUMBER = gql`
    mutation generateaccountnumber($username: String, $jwtauth: String){
        generateaccountnumber(username: $username, jwtauth: $jwtauth){
            newaccountnumber, error
        }
    }
`;

function Transaction(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [buyandsellinsertmut] = useMutation(BUYANDSELLINSERT);
    const [generateaccountnumbermut] = useMutation(GENERATEACCOUNTNUMBER);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [waitloadGet, waitloadSet] = useState(false);
    const [getHistory, setHistory] = useState("");
    const [GetHistoryStore, SetHistoryStore] = useState([]);

    const { error, data, refetch } = useQuery(GETPREVIOUSUSERSINFO,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token }, 
            fetchPolicy: 'no-cache',
            onCompleted(){
                if(data !== undefined){
                    waitloadSet(true);
                    SetHistoryStore(data.getprevioususersinfo);
                }
            }
        });

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const onSubmitClientUpload = () => {

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

        buyandsellinsertmut({ variables: { username: u, amount1, rate1, ngn1, supplier, supplieraccountno, customer, customeraccountno, rate2, ngn2, profit, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.buyandsellinsert.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Saved");
                refetch({variables: { username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token }});
                if(props.refetch !== undefined){
                    props.refetch();
                }
                if(props.refetcher !== undefined){
                    props.refetcher();
                }
                if(props.totalityrefetch !== undefined){
                    props.totalityrefetch();
                }
                if(props.refetchtotal !== undefined){
                    props.refetchtotal();
                }
            }else if (data.buyandsellinsert.error === "supplieraccountnotaken") {
                PopBoxerEnd(true); PopBox("This Account number is already assign to another supplier, please choose another one");
            }else if (data.buyandsellinsert.error === "customeraccountnotaken") {
                PopBoxerEnd(true); PopBox("This Account number is already assign to another customer, please choose another one");
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const GenerateSupplierAccountNumber = () => {

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        generateaccountnumbermut({ variables: { username: u, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            document.getElementById("supplieraccountnoid").value = data.generateaccountnumber.newaccountnumber;
        }).catch((e) => MutationError(e.toString()));
    }

    const GenerateCustomerAccountNumber = () => {

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        generateaccountnumbermut({ variables: { username: u, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            document.getElementById("customeraccountnoid").value = data.generateaccountnumber.newaccountnumber;
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
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

    const BothNGNFunc = () => {
        NGN1Func();
        NGN2Func();
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

    const HistoryChanger = (event) => {
        setHistory(event.target.value);
        for(let e of GetHistoryStore){
            if(e.accountno === event.target.value){
                if(e.type === "supplier"){
                    document.getElementById("supplierid").value = e.name;
                    document.getElementById("supplieraccountnoid").value = e.accountno;
                }else if(e.type === "customer"){
                    document.getElementById("customerid").value = e.name;
                    document.getElementById("customeraccountnoid").value = e.accountno;
                }
            }
        }
    }

    return (
        <div id="scrolldown" className="scrollpost">
            {nextClickGet === true ? <Loading /> : ""}
            <div className="loginspace">
                <ThemeProvider theme={theme}>
                    {waitloadGet === false ? <p align="center"><img className="imageloadingsize6" src={imageloading} alt="Loading.." /></p> :
                        <TextField
                            name="history" label="Auto Fill" fullWidth={true} helperText="you can auto fill previous clients info"
                            margin="normal" variant="outlined" onChange={(e) => HistoryChanger(e)} value={getHistory} select>
                            {data.getprevioususersinfo.map((e) => {
                                return (<MenuItem key={e.accountno} value={e.accountno}>{e.type}: {e.name} - {e.accountno}</MenuItem>)
                            })}
                        </TextField>
                    }
                    <TextField
                        id="amount1id" label="Supplied Amount" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => BothNGNFunc()} />
                    <TextField
                        id="rate1id" label="Supplier Rate" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => NGN1Func()} />
                    <TextField
                        id="ngn1id" placeholder="Supplier NGN" fullWidth={true}
                        margin="normal" variant="outlined" disabled />
                    <TextField
                        id="supplierid" placeholder="Supplier Name" fullWidth={true}
                        margin="normal" variant="outlined" defaultValue={props.suppliername !== undefined ? props.suppliername : ""} />
                    <TextField
                        id="supplieraccountnoid" placeholder="Supplier Account No" fullWidth={true}
                        margin="normal" variant="outlined" defaultValue={props.supplieraccountno !== undefined ? props.supplieraccountno : ""} />
                    <p className="accountnumbergenerator" onClick={() => GenerateSupplierAccountNumber()}>Generate A.N</p>
                    <TextField
                        id="customerid" placeholder="Customer Name" fullWidth={true}
                        margin="normal" variant="outlined" defaultValue={props.customername !== undefined ? props.customername : ""} />
                    <TextField
                        id="customeraccountnoid" placeholder="Customer Account No" fullWidth={true}
                        margin="normal" variant="outlined" defaultValue={props.customeraccountno !== undefined ? props.customeraccountno : ""} />
                    <p className="accountnumbergenerator" onClick={() => GenerateCustomerAccountNumber()}>Generate A.N</p>
                    <TextField
                        id="rate2id" label="Customer Rate" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => NGN2Func()} />
                    <TextField
                        id="ngn2id" placeholder="Customer NGN" fullWidth={true}
                        margin="normal" variant="outlined" disabled />
                    <TextField
                        id="profitid" placeholder="Profit or Loss" fullWidth={true}
                        margin="normal" variant="outlined" disabled />
                    <br />
                    <Button
                        fullWidth={true}
                        onClick={() => onSubmitClientUpload()}
                        style={{ color: "white", backgroundColor: "rgb(107, 43, 8)" }}
                    >Save</Button>
                </ThemeProvider>
                <br />
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                : ""}
        </div>
    );
}

export default Transaction;