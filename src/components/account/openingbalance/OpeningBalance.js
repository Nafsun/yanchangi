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

//Upload opening balance
const OPENINGBALANCEINSERT = gql`
    mutation openingbalanceinsert($username: String, $amount: String, $chooseclient: String, $name: String, $accountnumber: String, $jwtauth: String){
        openingbalanceinsert(username: $username, amount: $amount, chooseclient: $chooseclient, name: $name, accountnumber: $accountnumber, jwtauth: $jwtauth){
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

function OpeningBalance(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [openingbalanceinsertmut] = useMutation(OPENINGBALANCEINSERT);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [chooseclientGet, chooseclientSet] = useState(props.chooseclient !== undefined ? props.chooseclient : null);
    const [waitloadGet, waitloadSet] = useState(false);
    const [getHistory, setHistory] = useState("");
    const [GetHistoryStore, SetHistoryStore] = useState([]);

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

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const onSubmitClientUpload = () => {

        if (chooseclientGet === null) { PopBoxerEnd(true); PopBox("Select one of Supplier or Customer"); return false; }

        let amount = document.getElementById("amountid").value.replace(/(<([^>]+)>)/ig, "");
        let name = document.getElementById("nameid").value.replace(/(<([^>]+)>)/ig, "");
        let accountnumber = document.getElementById("accountnumberid").value.replace(/(<([^>]+)>)/ig, "");

        if (amount === "") { PopBoxerEnd(true); PopBox("Amount cannot be empty"); return false; }
        if (name === "") { PopBoxerEnd(true); PopBox("Name cannot be empty"); return false; }
        if (accountnumber === "") { PopBoxerEnd(true); PopBox("Account Number cannot be empty"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        openingbalanceinsertmut({ variables: { username: u, amount, chooseclient: chooseclientGet, name, accountnumber, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.openingbalanceinsert.error === "no") {
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
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const chooseclientChanger = (event) => {
        chooseclientSet(event.target.value);
    }

    const HistoryChanger = (event) => {
        setHistory(event.target.value);
        for (let e of GetHistoryStore) {
            if (e.accountno === event.target.value) {
                if (e.type === "supplier") {
                    document.getElementById("nameid").value = e.name;
                    document.getElementById("accountnumberid").value = e.accountno;
                    chooseclientSet(e.type);
                } else if (e.type === "customer") {
                    document.getElementById("nameid").value = e.name;
                    document.getElementById("accountnumberid").value = e.accountno;
                    chooseclientSet(e.type);
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
                    <TextField
                        id="nameid" placeholder="Name" fullWidth={true}
                        margin="normal" defaultValue={props.name !== undefined ? props.name : ""} />
                    <TextField
                        id="accountnumberid" placeholder="Account No" fullWidth={true} defaultValue={props.accountno !== undefined ? props.accountno : ""}
                        margin="normal" onChange={() => NumberCheck("accountnumberid")} />
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

export default OpeningBalance;