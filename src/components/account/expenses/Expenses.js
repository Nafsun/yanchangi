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
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//All banks the user register with
const GETALLAVAILABLEBANKS = gql` 
    query getallavailablebanks($username: String, $jwtauth: String){
        getallavailablebanks(username: $username, jwtauth: $jwtauth){
            id, bankname, bankaccountnumber, bankaccountname
        }
    }
`;

//Upload expenses information
const EXPENSES = gql` 
    mutation expenses($username: String, $amount: String, $description: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $jwtauth: String){
        expenses(username: $username, amount: $amount, description: $description, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, jwtauth: $jwtauth){
            error
        }
    }
`;

function Expenses() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [expensesmut] = useMutation(EXPENSES);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [BankNameGet, BankNameSet] = useState("");
    const [BankAccountNameGet, BankAccountNameSet] = useState("");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState("");

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

        let amount = document.getElementById("amountid").value.replace(/(<([^>]+)>)/ig, "");
        let description = document.getElementById("descriptionid").value.replace(/(<([^>]+)>)/ig, "");

        if (amount === "") { PopBoxerEnd(true); PopBox("Amount cannot be empty"); return false; }
        if (description === "") { PopBoxerEnd(true); PopBox("Description cannot be empty"); return false; }
        if (BankNameGet === "") { PopBoxerEnd(true); PopBox("Bank Name cannot be empty"); return false; }
        if (BankAccountNumberGet === "") { PopBoxerEnd(true); PopBox("Bank Account Number cannot be empty"); return false; }
        if (BankAccountNameGet === "") { PopBoxerEnd(true); PopBox("Bank Account Name cannot be empty"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        expensesmut({ variables: { username: u, amount, description, bankname: BankNameGet, bankaccountnumber: BankAccountNumberGet, bankaccountname: BankAccountNameGet, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.expenses.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Saved");
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
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

export default Expenses;