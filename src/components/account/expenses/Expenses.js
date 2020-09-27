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

//Upload expenses information
const EXPENSES = gql` 
    mutation expenses($username: String, $amount: String, $description: String, $jwtauth: String){
        expenses(username: $username, amount: $amount, description: $description, jwtauth: $jwtauth){
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

    const onSubmitClientUpload = () => {

        let amount = document.getElementById("amountid").value.replace(/(<([^>]+)>)/ig, "");
        let description = document.getElementById("descriptionid").value.replace(/(<([^>]+)>)/ig, "");

        if (amount === "") { PopBoxerEnd(true); PopBox("Amount cannot be empty"); return false; }
        if (description === "") { PopBoxerEnd(true); PopBox("Description cannot be empty"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        expensesmut({ variables: { username: u, amount, description, jwtauth: j } }).then(({ data }) => {
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