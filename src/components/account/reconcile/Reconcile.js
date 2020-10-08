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
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';
import FormLabel from '@material-ui/core/FormLabel';

//All banks the user register with
const GETALLAVAILABLEBANKS = gql` 
    query getallavailablebanks($username: String, $jwtauth: String){
        getallavailablebanks(username: $username, jwtauth: $jwtauth){
            id, bankname, bankaccountnumber, bankaccountname
        }
    }
`;

//Upload receive or pay information
const RECONCILEINSERT = gql`
    mutation reconcileinsert($username: String, $amount: String, $description: String, $sendorrecieved: String, $from: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $to: String, $bankname2: String, $bankaccountnumber2: String, $bankaccountname2: String, $jwtauth: String){
        reconcileinsert(username: $username, amount: $amount, description: $description, sendorrecieved: $sendorrecieved, from: $from, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, to: $to, bankname2: $bankname2, bankaccountnumber2: $bankaccountnumber2, bankaccountname2: $bankaccountname2, jwtauth: $jwtauth){
            error
        }
    }
`;

function Reconcile(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [reconcileinsertmut] = useMutation(RECONCILEINSERT);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [tobankGet, tobankSet] = useState("");
    const [frombankGet, frombankSet] = useState("");
    const [BankNameGet, BankNameSet] = useState("");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState("");
    const [BankNameGet2, BankNameSet2] = useState("");
    const [BankAccountNumberGet2, BankAccountNumberSet2] = useState("");
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [getTransactionType, setTransactionType] = useState("");

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

    if (banki.error) {
        return <NoInternetConnection error={banki.error.toString()} />;
    }

    const onSubmitClientUpload = () => {

        let description = document.getElementById("descriptionid").value.replace(/(<([^>]+)>)/ig, "");
        let amount = document.getElementById("amountid").value.replace(/(<([^>]+)>)/ig, "");
        let bankname = document.getElementById("bankname");
        let bankaccountnumber = document.getElementById("bankaccountnumber");
        let bankaccountname = document.getElementById("bankaccountname");
        let bankname2 = document.getElementById("bankname2");
        let bankaccountnumber2 = document.getElementById("bankaccountnumber2");
        let bankaccountname2 = document.getElementById("bankaccountname2");

        if (description === "") { PopBoxerEnd(true); PopBox("Description cannot be empty"); return false; }
        if (amount === "") { PopBoxerEnd(true); PopBox("Amount cannot be empty"); return false; }
        if (getTransactionType === '') { PopBoxerEnd(true); PopBox("Choose a Transaction Type"); return false; }
        if (frombankGet === '') { PopBoxerEnd(true); PopBox("Select the bank to send the money from"); return false; }
        if (tobankGet === '') { PopBoxerEnd(true); PopBox("Select the bank to send the money to"); return false; }

        if (BankNameGet === "") {
            if (bankname !== null) {
                bankname = bankname.value.replace(/(<([^>]+)>)/ig, "");
            } else {
                bankname = "no";
                //PopBoxerEnd(true); PopBox("From: Bank Name cannot be empty"); return false;
            }
            if(bankname === "no"){
                PopBoxerEnd(true); PopBox("From: Bank Name cannot be empty"); return false;
            }
        } else {
            bankname = BankNameGet;
        }

        if (BankAccountNumberGet === "") {
            if (bankaccountnumber !== null) {
                bankaccountnumber = bankaccountnumber.value.replace(/(<([^>]+)>)/ig, "");
            } else {
                bankaccountnumber = "no";
            }
            if(bankaccountnumber === "no"){
                PopBoxerEnd(true); PopBox("From: Bank Account Number cannot be empty"); return false;
            }
        } else {
            bankaccountnumber = BankAccountNumberGet;
        }

        if (bankaccountname !== null) {
            bankaccountname = bankaccountname.value.replace(/(<([^>]+)>)/ig, "");
        } else {
            bankaccountname = "no";
        }

        if (BankNameGet2 === "") {
            if (bankname2 !== null) {
                bankname2 = bankname2.value.replace(/(<([^>]+)>)/ig, "");
            } else {
                bankname2 = "no";
                //PopBoxerEnd(true); PopBox("To: Bank Name cannot be empty"); return false;
            }
            if(bankname2 === "no"){
                PopBoxerEnd(true); PopBox("To: Bank Name cannot be empty"); return false;
            }
        } else {
            bankname2 = BankNameGet2;
        }

        if (BankAccountNumberGet2 === "") {
            if (bankaccountnumber2 !== null) {
                bankaccountnumber2 = bankaccountnumber2.value.replace(/(<([^>]+)>)/ig, "");
            } else {
                bankaccountnumber2 = "no";
            }
            if(bankaccountnumber2 === "no"){
                PopBoxerEnd(true); PopBox("To: Bank Account Number cannot be empty"); return false;
            }
        } else {
            bankaccountnumber2 = BankAccountNumberGet2;
        }

        if (bankaccountname2 !== null) {
            bankaccountname2 = bankaccountname2.value.replace(/(<([^>]+)>)/ig, "");
        } else {
            bankaccountname2 = "no";
        }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        reconcileinsertmut({ variables: { username: u, amount, description, sendorrecieved: getTransactionType, from: frombankGet, bankname, bankaccountnumber, bankaccountname, to: tobankGet, bankname2, bankaccountnumber2, bankaccountname2, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.reconcileinsert.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Saved");
                if (props.refetch !== undefined) {
                    props.refetch();
                }
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
                if (props.totalityrefetch !== undefined) {
                    props.totalityrefetch();
                }
                if (props.refetchtotal !== undefined) {
                    props.refetchtotal();
                }
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const frombankChanger = (event) => {
        frombankSet(event.target.value);
        BankNameSet('');
        BankAccountNumberSet('');
    }

    const tobankChanger = (event) => {
        tobankSet(event.target.value);
        BankNameSet2('');
        BankAccountNumberSet2('');
    }

    const BankNameChanger = (event) => {
        BankNameSet(event.target.value);
    }

    const BankAccountNumberChanger = (event) => {
        BankAccountNumberSet(event.target.value);
    }

    const BankNameChanger2 = (event) => {
        BankNameSet2(event.target.value);
    }

    const BankAccountNumberChanger2 = (event) => {
        BankAccountNumberSet2(event.target.value);
    }

    const transactiontypeChanger = (event) => {
        setTransactionType(event.target.value);
    }

    return (
        <div id="scrolldown" className="scrollpost">
            {nextClickGet === true ? <Loading /> : ""}
            <div className="loginspace">
                <ThemeProvider theme={theme}>
                    <TextField
                        id="descriptionid" label="Description" fullWidth={true}
                        margin="normal" variant="outlined" multiline={true} rowsMax={4} />
                    <TextField
                        id="amountid" label="Amount" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => NumberCheck("amountid")} />
                    <TextField
                        name="transactiontype" label="Choose Transaction Type" fullWidth={true}
                        margin="normal" variant="outlined" onChange={(e) => transactiontypeChanger(e)} value={getTransactionType} select>
                        <MenuItem value="send">Send</MenuItem>
                        <MenuItem value="recieved">Recieved</MenuItem>
                    </TextField>
                    <FormControl component="fieldset">
                        <FormLabel>From Bank</FormLabel>
                        <RadioGroup aria-label="frombank" name="frombank" value={frombankGet} onChange={(e) => frombankChanger(e)}>
                            <FormControlLabel value="internal" control={<Radio />} label="Internal" style={{ color: "rgb(107, 43, 8)" }} />
                            <FormControlLabel value="external" control={<Radio />} label="External" style={{ color: "rgb(107, 43, 8)" }} />
                        </RadioGroup>
                    </FormControl>
                    {frombankGet === "internal" ?
                        (waitloadGet2 === false ? "" :
                            <div>
                                {banki.data.getallavailablebanks.length === 0 ? <p className="addbankinfo">Please add your bank balance and information in the 'ADD BANK' section to be able to choose the bank a customer or supplier send money to or recieved money from.</p> : ""}
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
                            </div>)
                        : ""}
                    {frombankGet === "external" ?
                        (<div>
                            <TextField
                                name="bankname" label="Bank Name" fullWidth={true}
                                margin="normal" variant="outlined" id="bankname" helperText="optional" />
                            <TextField
                                name="bankaccountnumber" label="Bank Account Number" fullWidth={true}
                                margin="normal" variant="outlined" id="bankaccountnumber" helperText="optional" />
                            <TextField
                                name="bankaccountname" label="Bank Account Name" fullWidth={true}
                                margin="normal" variant="outlined" id="bankaccountname" helperText="optional" />
                        </div>)
                        : ""}
                    <FormControl component="fieldset">
                        <FormLabel>To Bank</FormLabel>
                        <RadioGroup aria-label="tobank" name="tobank" value={tobankGet} onChange={(e) => tobankChanger(e)}>
                            <FormControlLabel value="internal" control={<Radio />} label="Internal" style={{ color: "rgb(107, 43, 8)" }} />
                            <FormControlLabel value="external" control={<Radio />} label="External" style={{ color: "rgb(107, 43, 8)" }} />
                        </RadioGroup>
                    </FormControl>
                    {tobankGet === "internal" ?
                        (waitloadGet2 === false ? "" :
                            <div>
                                {banki.data.getallavailablebanks.length === 0 ? <p className="addbankinfo">Please add your bank balance and information in the 'ADD BANK' section to be able to choose the bank a customer or supplier send money to or recieved money from.</p> : ""}
                                <TextField
                                    name="bankname" label="Bank Name" fullWidth={true}
                                    margin="normal" variant="outlined" onChange={(e) => BankNameChanger2(e)} value={BankNameGet2} select>
                                    {banki.data.getallavailablebanks.map((e) => (
                                        <MenuItem key={e.id} value={e.bankname}>{e.bankname}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    name="bankaccountnumber" label="Bank Account Number" fullWidth={true}
                                    margin="normal" variant="outlined" onChange={(e) => BankAccountNumberChanger2(e)} value={BankAccountNumberGet2} select>
                                    {banki.data.getallavailablebanks.map((e) => (
                                        <MenuItem key={e.id} value={e.bankaccountnumber}>{e.bankaccountnumber}</MenuItem>
                                    ))}
                                </TextField>
                            </div>)
                        : ""}
                    {tobankGet === "external" ?
                        (<div>
                            <TextField
                                name="bankname" label="Bank Name" fullWidth={true}
                                margin="normal" variant="outlined" id="bankname2" helperText="optional" />
                            <TextField
                                name="bankaccountnumber" label="Bank Account Number" fullWidth={true}
                                margin="normal" variant="outlined" id="bankaccountnumber2" helperText="optional" />
                            <TextField
                                name="bankaccountname" label="Bank Account Name" fullWidth={true}
                                margin="normal" variant="outlined" id="bankaccountname2" helperText="optional" />
                        </div>)
                        : ""}
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

export default Reconcile;