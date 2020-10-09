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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import RecieveOrPay from '../../account/recieveorpay/RecieveOrPay';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//All banks the user register with
const GETALLAVAILABLEBANKS = gql` 
    query getallavailablebanks($username: String, $jwtauth: String){
        getallavailablebanks(username: $username, jwtauth: $jwtauth){
            id, bankname, bankaccountnumber, bankaccountname
        }
    }
`;

const TOTALITYFORPAYORRECIEVEDSINGLEBANK = gql`
    query totalityforpayorrecievedsinglebank($username: String, $bankname: String, $bankaccountnumber: String, $jwtauth: String){
        totalityforpayorrecievedsinglebank(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, jwtauth: $jwtauth){
            amountpay, amountrecieved
        }
    }
`;

//All transfers and received transactions
const RECEIVEORPAYGETSINGLEBANK = gql`
    query recieveorpaygetsinglebank($username: String, $bankname: String, $bankaccountnumber: String, $startc: Int, $endc: Int, $jwtauth: String){
        recieveorpaygetsinglebank(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, startc: $startc, endc: $endc, jwtauth: $jwtauth){
            id, username, amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber, date
        }
    }
`;

//delete 
const RECEIVEORPAYDELETE = gql`
    mutation recieveorpaydelete($id: String, $username: String, $jwtauth: String){
        recieveorpaydelete(id: $id, username: $username, jwtauth: $jwtauth){
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

//Updating 
const RECEIVEORPAYUPDATE = gql` 
    mutation recieveorpayupdate($id: String, $username: String, $amount: String, $chooseclient: String, $recievedorpay: String, $fromorto: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $accountnumber: String, $jwtauth: String){
        recieveorpayupdate(id: $id, username: $username, amount: $amount, chooseclient: $chooseclient, recievedorpay: $recievedorpay, fromorto: $fromorto, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, accountnumber: $accountnumber, jwtauth: $jwtauth){
            error
        }
    }
`;

let starter2 = 0;
let ender2 = 50;
let accountno_save = "";

function Recieved(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [recieveorpayupdatemutation] = useMutation(RECEIVEORPAYUPDATE);
    const [deletepostmutation] = useMutation(RECEIVEORPAYDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [waitloadGet3, waitloadSet3] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);
    const BankTransactions = useSelector(s => s.BankTransactions);

    const [idGet, idSet] = useState(null);
    const [amountGet, amountSet] = useState(null);
    const [chooseclientGet, chooseclientSet] = useState(null);
    const [recievedorpayGet, recievedorpaySet] = useState(null);
    const [fromortoGet, fromortoSet] = useState(null);
    const [BankNameGet, BankNameSet] = useState(null);
    const [BankAccountNameGet, BankAccountNameSet] = useState("");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState("");
    const [accountnumberGet, accountnumberSet] = useState(null);

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);

    const sizeoflogo = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    useEffect(() => { //convert then to initial values when you change page
        if (BankTransactions[1] !== accountno_save) {
            starter2 = 0;
            ender2 = 50;
            accountno_save = BankTransactions[1];
        }
    }, [BankTransactions]);

    const accessv = useQuery(ACCESSVERIFY,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache'
        });

    const banki = useQuery(GETALLAVAILABLEBANKS,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (banki.data !== undefined) {
                    waitloadSet3(true);
                }
            }
        });

    const totality = useQuery(TOTALITYFORPAYORRECIEVEDSINGLEBANK,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, bankname: BankTransactions[0], bankaccountnumber: BankTransactions[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (totality.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(RECEIVEORPAYGETSINGLEBANK,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, bankname: BankTransactions[0], bankaccountnumber: BankTransactions[1], startc: starter2, endc: ender2, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
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
            if (data.recieveorpaydelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.recieveorpaydelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Record Successfully Deleted");
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

    const OpenEdit = (id, amount, chooseclient, recievedorpay, fromorto, bankname, bankaccountnumber, bankaccountname, accountnumber) => {
        idSet(id); amountSet(amount); chooseclientSet(chooseclient); recievedorpaySet(recievedorpay); fromortoSet(fromorto);
        BankNameSet(bankname); BankAccountNumberSet(bankaccountnumber); BankAccountNameSet(bankaccountname); accountnumberSet(accountnumber);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

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
        editSet(false);

        recieveorpayupdatemutation({ variables: { id: idGet, username: u, amount, chooseclient: chooseclientGet, recievedorpay: recievedorpayGet, fromorto, bankname: BankNameGet, bankaccountnumber: BankAccountNumberGet, bankaccountname: BankAccountNameGet, accountnumber, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.recieveorpayupdate.error === "no") {
                PopBoxerEnd(true);
                PopBox("Successfully Edited");
                refetch();
                totality.refetch();
                props.refetch();
            }
        }).catch((e) => {
            MutationError(e.toString())
        });
    }

    const BringOutDelete = (id) => {
        deleteidSet(id);
        deleteSetter(true);
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

    const recievedorpayChanger = (event) => {
        recievedorpaySet(event.target.value);
    }

    const chooseclientChanger = (event) => {
        chooseclientSet(event.target.value);
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

                            {data.recieveorpaygetsinglebank.length === 0 && starter2 === 0 && nextClickGet === false ? <p align="center" className="datef">{BankTransactions[0]} have not recieved or send money yet</p> : ""}
                            {data.recieveorpaygetsinglebank.length === 0 && starter2 > 0 ? <p align="center" className="datef">No More Send/Recieved Transactions from/to {BankTransactions[0]}</p> : ""}
                            {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                            {data.recieveorpaygetsinglebank.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                            <div className="changefloat2"></div>

                            <table cellSpacing={10} align="center">
                                {data.recieveorpaygetsinglebank.length === 0 && (starter2 > 0 || starter2 === 0) ? <thead></thead> :
                                    <thead>
                                        <tr className="tablecolumdesign">
                                            <td>Amount</td>
                                            <td>Type</td>
                                            <td>Date and Time</td>
                                            {accessv.data.accessverify.editrecieveorpay === "yes" || accessv.data.accessverify.deleterecieveorpay === "yes" ?
                                                <td>Edit</td>
                                                : ""}
                                        </tr>
                                    </thead>
                                }
                                <tbody>
                                    {data.recieveorpaygetsinglebank.map((t) => (
                                        <tr className="tablecolumdesign2" key={t.id}>
                                            <td>{Naira(t.amount)}</td>
                                            <td>{t.recievedorpay}</td>
                                            <td>{t.date}</td>
                                            {accessv.data.accessverify.editrecieveorpay === "yes" || accessv.data.accessverify.deleterecieveorpay === "yes" ?
                                                <td><IconMenu
                                                    iconButtonElement={<IconButton><MoreVert style={{ color: "rgb(107, 43, 8)" }}></MoreVert></IconButton>}
                                                    useLayerForClickAway={true}
                                                    targetOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                >
                                                    <List>
                                                        {accessv.data.accessverify.deleterecieveorpay === "yes" ?
                                                            <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                            : ""}
                                                        {accessv.data.accessverify.editrecieveorpay === "yes" ?
                                                            <ListItem onClick={() => OpenEdit(t.id, t.amount, t.chooseclient, t.recievedorpay, t.fromorto, t.bankname, t.bankaccountnumber, t.bankaccountname, t.accountnumber)}>Edit</ListItem>
                                                            : ""}
                                                    </List>
                                                </IconMenu></td>
                                                : ""}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="changefloat2"></div>
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.recieveorpaygetsinglebank.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>
                    </div>

                    {data.recieveorpaygetsinglebank.length === 0 && (starter2 > 0 || starter2 === 0) ? "" :
                        <div>
                            <p className="tablecolumdesign">Total Amount Recieved: {waitloadGet2 === false ? "" : <span className="tablecolumdesign3">{Naira(totality.data.totalityforpayorrecievedsinglebank.amountrecieved)}</span>}</p>
                            <p className="tablecolumdesign">Total Amount Pay: {waitloadGet2 === false ? "" : <span className="tablecolumdesign3">{Naira(totality.data.totalityforpayorrecievedsinglebank.amountpay)}</span>}</p>
                        </div>
                    }

                    {PopBoxerStart ?
                        <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                        : ""}
                    {deleteGetter === true ?
                        <DialogPopper Title="Delete Record"
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
                                            id="amountid" label="Amount" fullWidth={true} defaultValue={amountGet}
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
                                        {recievedorpayGet === "recieved" ?
                                            <TextField
                                                id="fromortoid" label="From" fullWidth={true}
                                                margin="normal" defaultValue={fromortoGet} />
                                            : ""}
                                        {recievedorpayGet === "pay" ?
                                            <TextField
                                                id="fromortoid" label="To" fullWidth={true}
                                                margin="normal" defaultValue={fromortoGet} />
                                            : ""}
                                        <TextField
                                            id="accountnumberid" label="Account No" fullWidth={true} defaultValue={accountnumberGet}
                                            margin="normal" onChange={() => NumberCheck("accountnumberid")} />
                                        {waitloadGet3 === false ? "" :
                                            <div>
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
            {accessv.data.accessverify.createrecieveorpay === "yes" ?
                <RecieveOrPay refetchtotal={props.refetch} refetch={refetch} bankname={BankTransactions[0]} bankaccountnumber={BankTransactions[1]} bankaccountname={BankTransactions[2]} totalityrefetch={totality.refetch} />
                : ""}
        </div>
    );
}

export default Recieved;