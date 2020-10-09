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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import imageloading from "../../images/loading.gif";
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//All banks the user register with
const GETALLAVAILABLEBANKS = gql` 
    query getallavailablebanks($username: String, $jwtauth: String){
        getallavailablebanks(username: $username, jwtauth: $jwtauth){
            id, bankname, bankaccountnumber, bankaccountname
        }
    }
`;

//Upload receive or pay information
const RECIEVEORPAYINSERT = gql`
    mutation recieveorpayinsert($username: String, $amount: String, $chooseclient: String, $recievedorpay: String, $fromorto: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $accountnumber: String, $jwtauth: String){
        recieveorpayinsert(username: $username, amount: $amount, chooseclient: $chooseclient, recievedorpay: $recievedorpay, fromorto: $fromorto, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, accountnumber: $accountnumber, jwtauth: $jwtauth){
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

function RecieveOrPay(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [recieveorpayinsertmut] = useMutation(RECIEVEORPAYINSERT);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [recievedorpayGet, recievedorpaySet] = useState(props.recieved !== undefined ? props.recieved : null);
    const [chooseclientGet, chooseclientSet] = useState(props.chooseclient !== undefined ? props.chooseclient : null);
    const [BankNameGet, BankNameSet] = useState(props.bankname !== undefined ? props.bankname : "");
    const [BankAccountNameGet, BankAccountNameSet] = useState(props.bankaccountname !== undefined ? props.bankaccountname : "");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState(props.bankaccountnumber !== undefined ? props.bankaccountnumber : "");
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [getHistory, setHistory] = useState("");
    const [GetHistoryStore, SetHistoryStore] = useState([]);

    const banki = useQuery(GETALLAVAILABLEBANKS,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (banki.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(GETPREVIOUSUSERSINFO,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                    SetHistoryStore(data.getprevioususersinfo);
                }
            }
        });

    if (banki.error) {
        return <NoInternetConnection error={banki.error.toString()} />;
    }

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const onSubmitClientUpload = () => {

        if (recievedorpayGet === null) { PopBoxerEnd(true); PopBox("Select one of Recieved or Pay"); return false; }
        if (chooseclientGet === null) { PopBoxerEnd(true); PopBox("Select one of Supplier or Customer"); return false; }

        let amount = document.getElementById("amountid").value.replace(/(<([^>]+)>)/ig, "");
        let fromorto = document.getElementById("fromortoid").value.replace(/(<([^>]+)>)/ig, "");
        let accountnumber = document.getElementById("accountnumberid").value.replace(/(<([^>]+)>)/ig, "");

        if (amount === "") { PopBoxerEnd(true); PopBox("Amount cannot be empty"); return false; }
        if (fromorto === "") { PopBoxerEnd(true); PopBox("From or To cannot be empty"); return false; }
        if (BankNameGet === "") { PopBoxerEnd(true); PopBox("Bank Name cannot be empty"); return false; }
        if (BankAccountNumberGet === "") { PopBoxerEnd(true); PopBox("Bank Account Number cannot be empty"); return false; }
        if (BankAccountNameGet === "") { PopBoxerEnd(true); PopBox("Bank Account Name cannot be empty"); return false; }
        if (accountnumber === "") { PopBoxerEnd(true); PopBox("Account Number cannot be empty"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        recieveorpayinsertmut({ variables: { username: u, amount, chooseclient: chooseclientGet, recievedorpay: recievedorpayGet, fromorto, bankname: BankNameGet, bankaccountnumber: BankAccountNumberGet, bankaccountname: BankAccountNameGet, accountnumber, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.recieveorpayinsert.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Saved");
                refetch({ variables: { username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } });
                if (props.refetch !== undefined) {
                    props.refetch();
                }
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
                if (props.totalityrefetch !== undefined) {
                    props.totalityrefetch();
                }
                if(props.refetchtotal !== undefined){
                    props.refetchtotal();
                }
            }else if (data.recieveorpayinsert.error === "supplieraccountnodoesmatch") {
                PopBoxerEnd(true); PopBox("The supplier account number does not match the name");
            }else if (data.recieveorpayinsert.error === "customeraccountnodoesmatch") {
                PopBoxerEnd(true); PopBox("The customer account number does not match the name");
            }else if (data.recieveorpayinsert.error === "supplieraccountnodontexist") {
                PopBoxerEnd(true); PopBox("Supplier Account number does not exist, please add the supplier to the 'ADD SUPPLIER/CUSTOMER' section");
            }else if (data.recieveorpayinsert.error === "customeraccountnodontexist") {
                PopBoxerEnd(true); PopBox("Customer Account number does not exist, please add the customer to the 'ADD SUPPLIER/CUSTOMER' section");
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const recievedorpayChanger = (event) => {
        recievedorpaySet(event.target.value);
    }

    const chooseclientChanger = (event) => {
        chooseclientSet(event.target.value);
    }

    const BankNameChanger = (event) => {
        BankNameSet(event.target.value);
    }

    const BankAccountNumberChanger = (event) => {
        BankAccountNumberSet(event.target.value);
    }

    const BankAccountNameChanger = (event) => {
        BankAccountNameSet(event.target.value);
    }

    const HistoryChanger = (event) => {
        setHistory(event.target.value);
        for (let e of GetHistoryStore) {
            if (e.accountno === event.target.value) {
                if (e.type === "supplier") {
                    document.getElementById("fromortoid").value = e.name;
                    document.getElementById("accountnumberid").value = e.accountno;
                    chooseclientSet(e.type);
                    recievedorpaySet("pay");
                } else if (e.type === "customer") {
                    document.getElementById("fromortoid").value = e.name;
                    document.getElementById("accountnumberid").value = e.accountno;
                    chooseclientSet(e.type);
                    recievedorpaySet("recieved");
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
                        id="amountid" label="Amount" fullWidth={true}
                        margin="normal" onChange={() => NumberCheck("amountid")} />
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="chooseclient" name="chooseclient" value={chooseclientGet} onChange={(e) => chooseclientChanger(e)}>
                            <FormControlLabel value="supplier" control={<Radio />} label="Supplier" style={{ color: "rgb(107, 43, 8)" }} />
                            <FormControlLabel value="customer" control={<Radio />} label="Customer" style={{ color: "rgb(107, 43, 8)" }} />
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="recievedorpay" name="recievedorpay" value={recievedorpayGet} onChange={(e) => recievedorpayChanger(e)}>
                            <FormControlLabel value="recieved" control={<Radio />} label="Recieved" style={{ color: "rgb(107, 43, 8)" }} />
                            <FormControlLabel value="pay" control={<Radio />} label="Pay" style={{ color: "rgb(107, 43, 8)" }} />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        id="fromortoid" placeholder="From or To" fullWidth={true}
                        margin="normal" defaultValue={props.name !== undefined ? props.name : ""} />
                    <TextField
                        id="accountnumberid" placeholder="Account No" fullWidth={true} defaultValue={props.accountno !== undefined ? props.accountno : ""}
                        margin="normal" onChange={() => NumberCheck("accountnumberid")} />
                    {waitloadGet2 === false ? "" :
                        <div>
                            {banki.data.getallavailablebanks.length === 0 ? <p className="addbankinfo">Please add your bank balance and information in the 'ADD BANK' section to be able to choose the bank a customer or supplier send money to or recieved money from.</p> : "" }
                            <TextField
                                name="bankname" label="Bank Name" fullWidth={true} 
                                margin="normal" variant="outlined" onChange={(e) => BankNameChanger(e)} value={BankNameGet} select>
                                {banki.data.getallavailablebanks.map((e) => (
                                    <MenuItem key={e.id} value={e.bankname}>{e.bankname}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="bankaccountnumber" label="Bank Account Number" fullWidth={true}
                                margin="normal" variant="outlined" onChange={(e) => BankAccountNumberChanger(e)} value={BankAccountNumberGet} select>
                                {banki.data.getallavailablebanks.map((e) => (
                                    <MenuItem key={e.id} value={e.bankaccountnumber}>{e.bankaccountnumber}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                name="bankaccountname" label="Bank Account Name" fullWidth={true}
                                margin="normal" variant="outlined" onChange={(e) => BankAccountNameChanger(e)} value={BankAccountNameGet} select>
                                {banki.data.getallavailablebanks.map((e) => (
                                    <MenuItem key={e.id} value={e.bankaccountname}>{e.bankaccountname}</MenuItem>
                                ))}
                            </TextField>
                        </div>
                    }
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

export default RecieveOrPay;