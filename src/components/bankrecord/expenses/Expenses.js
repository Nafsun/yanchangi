import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import NumberCheck from '../../functions/numbercheck';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import MoreVert from '@material-ui/icons/MoreVert';
import { CurrentLoading, Loading, JustLoading } from '../../loading/Loading';
import DialogPopper from '../../functions/dialogpopper';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import Naira from '../../functions/naira';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';
import MenuItem from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';
import Expenses from '../../account/expenses/Expenses';

//All banks the user register with
const GETALLAVAILABLEBANKS = gql` 
    query getallavailablebanks($username: String, $jwtauth: String){
        getallavailablebanks(username: $username, jwtauth: $jwtauth){
            id, bankname, bankaccountnumber, bankaccountname
        }
    }
`;

//All totals expenses
const TOTALEXPENSES = gql` 
    query totalexpensessinglebank($username: String, $bankname: String, $bankaccountnumber: String, $jwtauth: String){
        totalexpensessinglebank(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, jwtauth: $jwtauth){
            totalamount
        }
    }
`;

//All expenses
const EXPENSESGET = gql` 
    query expensesgetsinglebank($username: String, $bankname: String, $bankaccountnumber: String, $startc: Int, $endc: Int, $jwtauth: String){
        expensesgetsinglebank(username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, startc: $startc, endc: $endc, jwtauth: $jwtauth){
            id, amount, description, bankname, bankaccountnumber, bankaccountname, date
        }
    }
`;

//delete 
const EXPENSESDELETE = gql`
    mutation expensesdelete($id: String, $username: String, $jwtauth: String){
        expensesdelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Updating 
const EXPENSESUPDATE = gql` 
    mutation expensesupdate($id: String, $username: String, $amount: String, $description: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $jwtauth: String){
        expensesupdate(id: $id, username: $username, amount: $amount, description: $description, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, jwtauth: $jwtauth){
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

function EditExpenses(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [expensesupdatemutation] = useMutation(EXPENSESUPDATE);
    const [deletepostmutation] = useMutation(EXPENSESDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [waitloadGet3, waitloadSet3] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [nextClickGet2, nextClickSet2] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);
    const BankTransactions = useSelector(s => s.BankTransactions);

    const [idGet, idSet] = useState(null);
    const [amountGet, amountSet] = useState(null);
    const [descriptionGet, descriptionSet] = useState(null);
    const [BankNameGet, BankNameSet] = useState("");
    const [BankAccountNameGet, BankAccountNameSet] = useState("");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState("");

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);

    const sizeoflogo = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

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

    const accessv = useQuery(ACCESSVERIFY,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache'
        });

    const total = useQuery(TOTALEXPENSES,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, bankname: BankTransactions[0], bankaccountnumber: BankTransactions[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (total.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(EXPENSESGET,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, bankname: BankTransactions[0], bankaccountnumber: BankTransactions[1], startc: starter2, endc: ender2, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                    nextClickSet(false);
                    nextClickSet2(false);
                }
            }
        });

    if (accessv.loading) {
        return <CurrentLoading />;
    }

    if (accessv.error) {
        return <NoInternetConnection error={accessv.error.toString()} />;
    }

    if (total.error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    if (banki.error) {
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
            if (data.expensesdelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.expensesdelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Record Successfully Deleted");
                refetch();
                props.refetch();
                total.refetch();
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
            }
            nextClickSet(false);
        }).catch((e) => {
            MutationError(e.toString());
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

    const OpenEdit = (id, amount, description, bankname, bankaccountnumber, bankaccountname) => {
        idSet(id); amountSet(amount); descriptionSet(description);
        BankNameSet(bankname); BankAccountNumberSet(bankaccountnumber); BankAccountNameSet(bankaccountname);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

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
        editSet(false);

        expensesupdatemutation({ variables: { id: idGet, username: u, amount, description, bankname: BankNameGet, bankaccountnumber: BankAccountNumberGet, bankaccountname: BankAccountNameGet, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.expensesupdate.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Saved");
                refetch();
                props.refetch();
                total.refetch();
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
            }
        }).catch((e) => MutationError(e.toString()));
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

    return (
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div className="workspace2">
                    {accessv.data.accessverify.editexpense === "yes" || accessv.data.accessverify.deleteexpense === "yes" ?
                    <div className="jobcontainer2">

                        {nextClickGet === true ? <Loading /> : ""}
                        {nextClickGet2 === true ? <JustLoading /> : ""}

                        {waitloadGet2 === false ?
                            ""
                            :
                            (data.expensesgetsinglebank.length === 0 && (starter2 > 0) ? "" : <p className="totaleverything2">Total Expenses: <span>{Naira(total.data.totalexpensessinglebank.totalamount)}</span></p>)
                        }

                        {data.expensesgetsinglebank.length === 0 && starter2 === 0 && nextClickGet === false && nextClickGet2 === false ? <p align="center" className="datef">{BankTransactions[0]} have not make any expenses yet</p> : ""}
                        {data.expensesgetsinglebank.length === 0 && starter2 > 0 ? <p align="center" className="datef">No More Expenses</p> : ""}
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.expensesgetsinglebank.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>

                        <div className="loginspace">
                            <table cellSpacing={10} align="center">
                                {data.expensesgetsinglebank.length === 0 && (starter2 > 0 || starter2 === 0) ? <thead></thead> :
                                    <thead>
                                        <tr className="tablecolumdesign">
                                            <td>Amount</td>
                                            <td>Description</td>
                                            <td>Date and Time</td>
                                            {accessv.data.accessverify.editexpense === "yes" || accessv.data.accessverify.deleteexpense === "yes" ?
                                                <td>Edit</td>
                                                : ""}
                                        </tr>
                                    </thead>
                                }
                                <tbody>
                                    {data.expensesgetsinglebank.map((t) => (
                                        <tr className="tablecolumdesign2" key={t.id}>
                                            <td>{Naira(t.amount)}</td>
                                            <td>{t.description}</td>
                                            <td>{t.date}</td>
                                            {accessv.data.accessverify.editexpense === "yes" || accessv.data.accessverify.deleteexpense === "yes" ?
                                                <td><IconMenu
                                                    iconButtonElement={<IconButton><MoreVert style={{ color: "rgb(107, 43, 8)" }}></MoreVert></IconButton>}
                                                    useLayerForClickAway={true}
                                                    targetOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                >
                                                    <List>
                                                        {accessv.data.accessverify.deleteexpense === "yes" ?
                                                            <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                            : ""}
                                                        {accessv.data.accessverify.editexpense === "yes" ?
                                                            <ListItem onClick={() => OpenEdit(t.id, t.amount, t.description, t.bankname, t.bankaccountnumber, t.bankaccountname)}>Edit</ListItem>
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
                        {data.expensesgetsinglebank.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>
                    </div>
                    : 
                        <p className="donthaveaccess">You don't have access to this section</p>
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
                                            id="descriptionid" label="Description" fullWidth={true} defaultValue={descriptionGet}
                                            margin="normal" variant="outlined" multiline={true} rowsMax={4} />
                                        <TextField
                                            id="amountid" label="Amount" fullWidth={true} defaultValue={amountGet}
                                            margin="normal" variant="outlined" onChange={() => NumberCheck("amountid")} />
                                        {waitloadGet3 === false ? "" :
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
            {accessv.data.accessverify.createexpense === "yes" ?
                <Expenses refetchtotal={props.refetch} refetch={refetch} bankname={BankTransactions[0]} bankaccountnumber={BankTransactions[1]} bankaccountname={BankTransactions[2]} totalityrefetch={total.refetch} />
                : ""}
        </div>
    );
}

export default EditExpenses;