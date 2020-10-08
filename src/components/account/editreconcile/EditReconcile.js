import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import NumberCheck from '../../functions/numbercheck';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Naira from '../../functions/naira';
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

//All reconcile
const RECONCILEGET = gql`
    query reconcileget($username: String, $search: String, $startc: Int, $endc: Int, $jwtauth: String){
        reconcileget(username: $username, search: $search, startc: $startc, endc: $endc, jwtauth: $jwtauth){
            id, username, description, amount, sendorrecieved, from, bankname, bankaccountnumber, bankaccountname, to, bankname2, bankaccountnumber2, bankaccountname2, date
        }
    }
`;

//delete 
const RECONCILEDELETE = gql`
    mutation reconciledelete($id: String, $username: String, $jwtauth: String){
        reconciledelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Updating 
const RECONCILEUPDATE = gql` 
    mutation reconcileupdate($id: String, $username: String, $amount: String, $description: String, $sendorrecieved: String, $from: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $to: String, $bankname2: String, $bankaccountnumber2: String, $bankaccountname2: String, $jwtauth: String){
        reconcileupdate(id: $id, username: $username, amount: $amount, description: $description, sendorrecieved: $sendorrecieved, from: $from, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, to: $to, bankname2: $bankname2, bankaccountnumber2: $bankaccountnumber2, bankaccountname2: $bankaccountname2, jwtauth: $jwtauth){
            error
        }
    }
`;

const ACCESSVERIFY = gql`
    query accessverify($username: String, $jwtauth: String){
        accessverify(username: $username, jwtauth: $jwtauth){
            username, createdby, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, createreconcile, editreconcile, deletereconcile
        }
    }
`;

let starter2 = 0;
let ender2 = parseInt(process.env.REACT_APP_COUNT);
let searching = "";

function EditReconcile(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [reconcileupdatemutation] = useMutation(RECONCILEUPDATE);
    const [deletepostmutation] = useMutation(RECONCILEDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [nextClickGet2, nextClickSet2] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);

    const [idGet, idSet] = useState(null);
    const [amountGet, amountSet] = useState(null);
    const [descriptionGet, descriptionSet] = useState(null);
    const [tobankGet, tobankSet] = useState("");
    const [frombankGet, frombankSet] = useState("");
    const [BankNameGet, BankNameSet] = useState("");
    const [BankAccountNumberGet, BankAccountNumberSet] = useState("");
    const [BankAccountNameGet, BankAccountNameSet] = useState("");
    const [BankNameGet2, BankNameSet2] = useState("");
    const [BankAccountNumberGet2, BankAccountNumberSet2] = useState("");
    const [BankAccountNameGet2, BankAccountNameSet2] = useState("");
    const [getTransactionType, setTransactionType] = useState("");

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);
    const [searchGet, searchSet] = useState(searching);

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

    const { error, data, refetch } = useQuery(RECONCILEGET,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, search: searchGet, startc: starter2, endc: ender2, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
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
        return <div className="internetclass"><NoInternetConnection error={accessv.error.toString()} /></div>;
    }

    if (banki.error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const NextBroadcast = () => {
        waitloadSet(false);
        starter2 = starter2 + parseInt(process.env.REACT_APP_COUNT);
        refetch({ variables: { startc: starter2, endc: ender2 } });
    }

    const PreviousBroadcast = () => {
        waitloadSet(false);
        starter2 = starter2 - parseInt(process.env.REACT_APP_COUNT);
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
            if (data.reconciledelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.reconciledelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Record Successfully Deleted");
                refetch();
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
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

    const OpenEdit = (id, description, amount, sendorrecieved, from, bankname, bankaccountnumber, bankaccountname, to, bankname2, bankaccountnumber2, bankaccountname2) => {
        idSet(id); amountSet(amount); descriptionSet(description); tobankSet(to);
        frombankSet(from); BankNameSet(bankname); BankAccountNumberSet(bankaccountnumber); BankAccountNameSet(bankaccountname);
        BankNameSet2(bankname2); BankAccountNumberSet2(bankaccountnumber2); BankAccountNameSet2(bankaccountname2); setTransactionType(sendorrecieved);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

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
        editSet(false);

        reconcileupdatemutation({ variables: { id: idGet, username: u, amount, description, sendorrecieved: getTransactionType, from: frombankGet, bankname, bankaccountnumber, bankaccountname, to: tobankGet, bankname2, bankaccountnumber2, bankaccountname2, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.reconcileupdate.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Edited");
                refetch();
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

    const BringOutDelete = (id) => {
        deleteidSet(id);
        deleteSetter(true);
    }

    const Searcher = async (event) => {
        let search = await event.target.value;
        nextClickSet2(true);
        starter2 = 0;
        ender2 = parseInt(process.env.REACT_APP_COUNT);
        refetch({ variables: { username: userinfo.loginAccount.username, search: search, startc: starter2, endc: ender2, jwtauth: userinfo.loginAccount.token } });
        searchSet(search);
        searching = search;
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
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div id="scrolldown" className="scrollpost">
                    <div>

                        {nextClickGet === true ? <Loading /> : ""}
                        {nextClickGet2 === true ? <JustLoading /> : ""}

                        {data.reconcileget.length === 0 && starter2 > 0 ?
                            ""
                            :
                            (data.reconcileget.length === 0 && searchGet === "" ?
                                ""
                                :
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        label="Search Description" fullWidth={true} defaultValue={searchGet}
                                        margin="normal" onChange={(e) => Searcher(e)} />
                                </ThemeProvider>
                            )
                        }

                        {data.reconcileget.length === 0 && starter2 === 0 && nextClickGet === false && nextClickGet2 === false && searchGet === "" ? <p align="center" className="datef">You have not make any reconcile transaction yet</p> : ""}
                        {data.reconcileget.length === 0 && starter2 === 0 && nextClickGet === false && searchGet !== "" ? <p align="center" className="datef">Description was not found on the reconcile list</p> : ""}
                        {data.reconcileget.length === 0 && starter2 > 0 ? <p align="center" className="datef">No More Reconcile Transaction</p> : ""}
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.reconcileget.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>

                        <div className="loginspace">
                            {data.reconcileget.map((t) => (
                                <div key={t.id}>
                                    <Card>
                                        <CardContent>
                                            <div className="menuright">
                                                <IconMenu
                                                    iconButtonElement={<IconButton><MoreVert style={{ color: "rgb(107, 43, 8)" }}></MoreVert></IconButton>}
                                                    useLayerForClickAway={true}
                                                    targetOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                >
                                                    <List>
                                                        {accessv.data.accessverify.deletereconcile === "yes" ?
                                                            <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                            : ""}
                                                        {accessv.data.accessverify.editreconcile === "yes" ?
                                                            <ListItem onClick={() => OpenEdit(t.id, t.description, t.amount, t.sendorrecieved, t.from, t.bankname, t.bankaccountnumber, t.bankaccountname, t.to, t.bankname2, t.bankaccountnumber2, t.bankaccountname2)}>Edit</ListItem>
                                                            : ""}
                                                    </List>
                                                </IconMenu>
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <p className="describtionjobcontainer01"><span>Amount:</span> {Naira(t.amount)}</p>
                                            <p className="describtionjobcontainer01"><span>Description:</span> {t.description}</p>
                                            <p className="describtionjobcontainer01"><span>Type:</span> {t.sendorrecieved}</p>
                                            <p className="describtionjobcontainer01"><span>From:</span> {t.from}</p>
                                            {t.bankname !== "" ? <p className="describtionjobcontainer01"><span>Bank Name:</span> {t.bankname}</p> : ""}
                                            {t.bankaccountnumber !== "" ? <p className="describtionjobcontainer01"><span>Bank Account Number:</span> {t.bankaccountnumber}</p> : ""}
                                            {t.bankaccountname !== "" || t.bankaccountname !== "no" ? <p className="describtionjobcontainer01"><span>Bank Account Name:</span> {t.bankaccountname}</p> : ""}
                                            <p className="describtionjobcontainer01"><span>To:</span> {t.to}</p>
                                            {t.bankname2 !== "" ? <p className="describtionjobcontainer01"><span>Bank Name:</span> {t.bankname2}</p> : ""}
                                            {t.bankaccountnumber2 !== "" ? <p className="describtionjobcontainer01"><span>Bank Account Number:</span> {t.bankaccountnumber2}</p> : ""}
                                            {t.bankaccountname2 !== "" || t.bankaccountname2 !== "no" ? <p className="describtionjobcontainer01"><span>Bank Account Name:</span> {t.bankaccountname2}</p> : ""}
                                            <div className="changefloat2"></div>
                                            <p className="timejobcontainer01">{t.date}</p>
                                        </CardContent>
                                    </Card>
                                    <br />
                                </div>
                            ))}
                        </div>
                        <div className="changefloat2"></div>
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.reconcileget.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>
                    </div>

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
                                            id="descriptionid" label="Description" fullWidth={true}
                                            margin="normal" variant="outlined" multiline={true} rowsMax={4} defaultValue={descriptionGet} />
                                        <TextField
                                            id="amountid" label="Amount" fullWidth={true} defaultValue={amountGet}
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
                                                    name="bankname" label="Bank Name" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankname" defaultValue={BankNameGet} />
                                                <TextField
                                                    name="bankaccountnumber" label="Bank Account Number" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankaccountnumber" defaultValue={BankAccountNumberGet} />
                                                <TextField
                                                    name="bankaccountname" label="Bank Account Name" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankaccountname" defaultValue={BankAccountNameGet !== "no" ? BankAccountNameGet : ""} />
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
                                                    name="bankname" label="Bank Name" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankname2" defaultValue={BankNameGet2} />
                                                <TextField
                                                    name="bankaccountnumber" label="Bank Account Number" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankaccountnumber2" defaultValue={BankAccountNumberGet2} />
                                                <TextField
                                                    name="bankaccountname" label="Bank Account Name" fullWidth={true} helperText="optional"
                                                    margin="normal" variant="outlined" id="bankaccountname2" defaultValue={BankAccountNameGet2 !== "no" ? BankAccountNameGet2 : ""} />
                                            </div>)
                                            : ""}
                                        <br />
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
        </div>
    );
}

export default EditReconcile;