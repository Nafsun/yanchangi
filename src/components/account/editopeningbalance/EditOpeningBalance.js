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
import Naira from '../../functions/naira';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//All totals for a customer
const TOTALOPENINGBALANCE = gql` 
    query totalopeningbalance($username: String, $jwtauth: String){
        totalopeningbalance(username: $username, jwtauth: $jwtauth){
            totalamount
        }
    }
`;

//All opening balance transactions
const OPENINGBALANCEGET = gql`
    query openingbalanceget($username: String, $search: String, $startc: Int, $endc: Int, $jwtauth: String){
        openingbalanceget(username: $username, search: $search, startc: $startc, endc: $endc, jwtauth: $jwtauth){
            id, username, amount, chooseclient, name, accountnumber, date
        }
    }
`;

//delete 
const OPENINGBALANCEDELETE = gql` 
    mutation openingbalancedelete($id: String, $username: String, $jwtauth: String){
        openingbalancedelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Updating 
const OPENINGBALANCEUPDATE = gql` 
    mutation openingbalanceupdate($id: String, $username: String, $amount: String, $chooseclient: String, $name: String, $accountnumber: String, $jwtauth: String){
        openingbalanceupdate(id: $id, username: $username, amount: $amount, chooseclient: $chooseclient, name: $name, accountnumber: $accountnumber, jwtauth: $jwtauth){
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
let searching = "";

function EditOpeningBalance(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [openingbalanceupdatemutation] = useMutation(OPENINGBALANCEUPDATE);
    const [deletepostmutation] = useMutation(OPENINGBALANCEDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [waitloadGet2, waitloadSet2] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [nextClickGet2, nextClickSet2] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);

    const [idGet, idSet] = useState(null);
    const [amountGet, amountSet] = useState(null);
    const [chooseclientGet, chooseclientSet] = useState(null);
    const [nameGet, nameSet] = useState(null);
    const [accountnumberGet, accountnumberSet] = useState(null);

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

    const total = useQuery(TOTALOPENINGBALANCE,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (total.data !== undefined) {
                    waitloadSet2(true);
                }
            }
        });

    const { error, data, refetch } = useQuery(OPENINGBALANCEGET,
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

    if (total.error) {
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
            if (data.openingbalancedelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.openingbalancedelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Record Successfully Deleted");
                refetch();
                total.refetch();
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

    const OpenEdit = (id, amount, chooseclient, name, accountnumber) => {
        idSet(id); amountSet(amount); chooseclientSet(chooseclient); nameSet(name); accountnumberSet(accountnumber);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

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
        editSet(false);

        openingbalanceupdatemutation({ variables: { id: idGet, username: u, amount, chooseclient: chooseclientGet, name, accountnumber, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.openingbalanceupdate.error === "no") {
                PopBoxerEnd(true); PopBox("Successfully Updated");
                refetch({ variables: { username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } });
                total.refetch();
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

    const BringOutDelete = (id) => {
        deleteidSet(id);
        deleteSetter(true);
    }

    const Searcher = async (event) => {
        let search = await event.target.value;
        nextClickSet2(true);
        starter2 = 0;
        ender2 = 50;
        refetch({ variables: { username: userinfo.loginAccount.username, search: search, startc: starter2, endc: ender2, jwtauth: userinfo.loginAccount.token } });
        searchSet(search);
        searching = search;
    }

    const chooseclientChanger = (event) => {
        chooseclientSet(event.target.value);
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

                        {data.openingbalanceget.length === 0 && starter2 > 0 ?
                            ""
                            :
                            (data.openingbalanceget.length === 0 && searchGet === "" ?
                                ""
                                :
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        label="Search a Supplier or Customer" fullWidth={true} defaultValue={searchGet}
                                        margin="normal" onChange={(e) => Searcher(e)} />
                                </ThemeProvider>
                            )
                        }

                        {waitloadGet2 === false ?
                            ""
                            :
                            (data.openingbalanceget.length === 0 && (starter2 > 0 || searchGet !== "") ? "" : <p className="totaleverything2">Total Opening Balance: <span>&#8358;{Naira(total.data.totalopeningbalance.totalamount)}</span></p>)
                        }

                        {data.openingbalanceget.length === 0 && starter2 === 0 && nextClickGet === false && nextClickGet2 === false && searchGet === "" ? <p align="center" className="datef">You have not put an opening balance for a customer or supplier yet</p> : ""}
                        {data.openingbalanceget.length === 0 && starter2 === 0 && nextClickGet === false && searchGet !== "" ? <p align="center" className="datef">No client with that name exist</p> : ""}
                        {data.openingbalanceget.length === 0 && starter2 > 0 ? <p align="center" className="datef">No More Opening Balance Available</p> : ""}
                        {starter2 === 0 ? "" : <p onClick={() => PreviousBroadcast()} className="leftNav"><ArrowBack /></p>}
                        {data.openingbalanceget.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
                        <div className="changefloat2"></div>

                        <div className="loginspace">
                            {data.openingbalanceget.map((t) => (
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
                                                        {accessv.data.accessverify.deleteopeningbalance === "yes" ?
                                                            <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                        : ""}
                                                        {accessv.data.accessverify.editopeningbalance === "yes" ?
                                                            <ListItem onClick={() => OpenEdit(t.id, t.amount, t.chooseclient, t.name, t.accountnumber)}>Edit</ListItem>
                                                        : ""}
                                                    </List>
                                                </IconMenu>
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <p className="describtionjobcontainer01"><span>Name:</span> {t.name}</p>
                                            <p className="describtionjobcontainer01"><span>Client:</span> {t.chooseclient}</p>
                                            <p className="describtionjobcontainer01"><span>Account No:</span> {t.accountnumber}</p>
                                            <p className="describtionjobcontainer01"><span>Amount:</span> {Naira(t.amount)}</p>
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
                        {data.openingbalanceget.length === 0 ? "" : <p onClick={() => NextBroadcast()} className="rightNav"><ArrowForward /></p>}
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
                                            id="amountid" label="Amount" fullWidth={true} defaultValue={amountGet}
                                            margin="normal" onChange={() => NumberCheck("amountid")} />
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="chooseclient" name="chooseclient" value={chooseclientGet} onChange={(e) => chooseclientChanger(e)}>
                                                <FormControlLabel value="supplier" control={<Radio />} label="Supplier" style={{ color: "rgb(107, 43, 8)" }} />
                                                <FormControlLabel value="customer" control={<Radio />} label="Customer" style={{ color: "rgb(107, 43, 8)" }} />
                                            </RadioGroup>
                                        </FormControl>
                                        <TextField
                                            id="nameid" placeholder="Name" fullWidth={true}
                                            margin="normal" defaultValue={nameGet} />
                                        <TextField
                                            id="accountnumberid" placeholder="Account No" fullWidth={true} defaultValue={accountnumberGet}
                                            margin="normal" onChange={() => NumberCheck("accountnumberid")} />
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

export default EditOpeningBalance;