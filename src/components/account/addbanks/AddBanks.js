import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import { Loading } from '../../loading/Loading';
import NumberCheck from '../../functions/numbercheck';
import MenuItem from '@material-ui/core/MenuItem';

//Upload bank information
const ADDBANKS = gql`
    mutation addbanks($username: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $bankamount: String, $jwtauth: String){
        addbanks(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, bankamount: $bankamount, jwtauth: $jwtauth){
            error
        }
    }
`;

function AddBanks(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [addbanksmut] = useMutation(ADDBANKS);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [BankNameGet, BankNameSet] = useState("");
    
    const onSubmitClientUpload = () => {

        let balance = document.getElementById("balanceid").value.replace(/(<([^>]+)>)/ig, "");
        let bankaccountnumber = document.getElementById("bankaccountnumberid").value.replace(/(<([^>]+)>)/ig, "");
        let bankaccountname = document.getElementById("bankaccountnameid").value.replace(/(<([^>]+)>)/ig, "");

        if (BankNameGet === "") { PopBoxerEnd(true); PopBox("Bank Name cannot be empty"); return false; }
        if (bankaccountnumber === "") { PopBoxerEnd(true); PopBox("Enter your bank account number"); return false; }
        if (bankaccountname === "") { PopBoxerEnd(true); PopBox("Enter your bank account name"); return false; }
        if (balance === "") { PopBoxerEnd(true); PopBox("Enter your bank balance"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        addbanksmut({ variables: { username: u, bankname: BankNameGet, bankaccountnumber, bankaccountname, bankamount: balance, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.addbanks.error === "no") {
                PopBoxerEnd(true); PopBox(`Successfully Added ${BankNameGet}`);
                if(props.refetcher !== undefined){
                    props.refetcher();
                }
            }else if (data.addbanks.error === "exist") {
                PopBoxerEnd(true); PopBox("This bank already exist");
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

    return (
        <div id="scrolldown" className="scrollpost">
            {nextClickGet === true ? <Loading /> : ""}
            <div className="loginspace">
                <ThemeProvider theme={theme}>
                    <TextField 
                    name="bankname" label="Bank Name" fullWidth={true}
                    margin="normal" variant="outlined" onChange={(e) => BankNameChanger(e)} value={BankNameGet} select>
                        <MenuItem value="FCMB">FCMB</MenuItem>
                        <MenuItem value="UBA">UBA</MenuItem>
                        <MenuItem value="Union Bank">Union Bank</MenuItem>
                        <MenuItem value="Access Bank">Access Bank</MenuItem>
                        <MenuItem value="Citi Bank">Citi Bank</MenuItem>
                        <MenuItem value="Ecobank">Ecobank</MenuItem>
                        <MenuItem value="Fidelity">Fidelity Bank</MenuItem>
                        <MenuItem value="First Bank">First Bank</MenuItem>
                        <MenuItem value="GTbank">GTbank</MenuItem>
                        <MenuItem value="Heritage">Heritage</MenuItem>
                        <MenuItem value="Keystone">Keystone</MenuItem>
                        <MenuItem value="Polaris">Polaris Bank</MenuItem>
                        <MenuItem value="Stanbic IBTC">Stanbic IBTC</MenuItem>
                        <MenuItem value="Sterling Bank">Sterling Bank</MenuItem>
                        <MenuItem value="Wema Bank">Wema Bank</MenuItem>
                        <MenuItem value="Zenith Bank">Zenith Bank</MenuItem>
                        <MenuItem value="Taj Bank">Taj Bank</MenuItem>
                        <MenuItem value="SunTrust Bank">SunTrust Bank</MenuItem>
                        <MenuItem value="Providus Bank">Providus Bank</MenuItem>
                        <MenuItem value="Jaiz Bank">Jaiz Bank</MenuItem>
                        <MenuItem value="Standard Chartered Bank">Standard Chartered Bank</MenuItem>
                        <MenuItem value="Titan Trust Bank">Titan Trust Bank</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                    </TextField>
                    <TextField
                        id="bankaccountnumberid" label="Bank Account Number" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => NumberCheck("bankaccountnumberid")} />
                    <TextField
                        id="bankaccountnameid" label="Bank Account Name" fullWidth={true}
                        margin="normal" variant="outlined" />
                    <TextField
                        id="balanceid" label="Bank Balance" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => NumberCheck("balanceid")} />
                    <br />
                    <Button
                        fullWidth={true}
                        onClick={() => onSubmitClientUpload()}
                        style={{ color: "white", backgroundColor: "rgb(107, 43, 8)" }}
                    >Add Bank</Button>
                </ThemeProvider>
                <br />
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                : ""}
        </div>
    );
}

export default AddBanks;