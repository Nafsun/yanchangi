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
import MoreVert from '@material-ui/icons/MoreVert';
import { CurrentLoading, Loading, JustLoading } from '../../loading/Loading';
import DialogPopper from '../../functions/dialogpopper';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import MenuItem from '@material-ui/core/MenuItem';
import Naira from '../../functions/naira';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

//All banks
const ALLBANKS = gql`
    query allbanksget($username: String, $jwtauth: String){
        allbanksget(username: $username, jwtauth: $jwtauth){
            id, username, bankname, bankaccountnumber, bankaccountname, bankamount, bankbalance, date
        }
    }
`;

//delete 
const BANKDELETE = gql`
    mutation bankdelete($id: String, $username: String, $jwtauth: String){
        bankdelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Updating 
const BANKUPDATE = gql`
    mutation bankupdate($id: String, $username: String, $bankname: String, $bankaccountnumber: String, $bankaccountname: String, $bankamount: String, $jwtauth: String){
        bankupdate(id: $id, username: $username, bankname: $bankname, bankaccountnumber: $bankaccountnumber, bankaccountname: $bankaccountname, bankamount: $bankamount, jwtauth: $jwtauth){
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

function EditBanks(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [bankupdatemutation] = useMutation(BANKUPDATE);
    const [deletepostmutation] = useMutation(BANKDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [nextClickGet2, nextClickSet2] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);

    const [idGet, idSet] = useState(null);
    const [BankNameGet, BankNameSet] = useState(null);
    const [bankamountGet, bankamountSet] = useState(null);
    const [bankaccountnumberGet, bankaccountnumberSet] = useState(null);
    const [bankaccountnameGet, bankaccountnameSet] = useState(null);

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);

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

    const { error, data, refetch } = useQuery(ALLBANKS,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
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

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const DeletePost = () => {
        deleteSetter(false);
        nextClickSet(true);
        deletepostmutation({ variables: { id: deleteidGet, username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => { //updating a like 
            if (data.bankdelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.bankdelete.error === "no") {
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

    const OpenEdit = (id, bankname, bankaccountnumber, bankaccountname, bankbalance) => {
        idSet(id); bankamountSet(bankbalance); bankaccountnumberSet(bankaccountnumber);
        bankaccountnameSet(bankaccountname); BankNameSet(bankname);
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

        let bankamount = document.getElementById("bankamountid").value.replace(/(<([^>]+)>)/ig, "");
        let bankaccountnumber = document.getElementById("bankaccountnumberid").value.replace(/(<([^>]+)>)/ig, "");
        let bankaccountname = document.getElementById("bankaccountnameid").value.replace(/(<([^>]+)>)/ig, "");

        if (BankNameGet === "") { PopBoxerEnd(true); PopBox("Bank Name cannot be empty"); return false; }
        if (bankaccountnumber === "") { PopBoxerEnd(true); PopBox("Enter your bank account number"); return false; }
        if (bankaccountname === "") { PopBoxerEnd(true); PopBox("Enter your bank account name"); return false; }
        if (bankamount === "") { PopBoxerEnd(true); PopBox("Enter your bank balance"); return false; }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);
        editSet(false);

        bankupdatemutation({ variables: { id: idGet, username: u, bankname: BankNameGet, bankaccountnumber, bankaccountname, bankamount, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.bankupdate.error === "no") {
                PopBoxerEnd(true);
                PopBox("Successfully Edited");
                refetch();
                if (props.refetcher !== undefined) {
                    props.refetcher();
                }
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

    return (
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div id="scrolldown" className="scrollpost">
                    <div>

                        {nextClickGet === true ? <Loading /> : ""}
                        {nextClickGet2 === true ? <JustLoading /> : ""}

                        {data.allbanksget.length === 0 && nextClickGet === false && nextClickGet2 === false ? <p align="center" className="datef">You have not added any bank yet</p> : ""}
                        <div className="changefloat2"></div>

                        <div className="loginspace">
                            <br />
                            {data.allbanksget.map((t) => (
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
                                                        {accessv.data.accessverify.deletebank === "yes" ?
                                                            <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                            : ""}
                                                        {accessv.data.accessverify.editbank === "yes" ?
                                                            <ListItem onClick={() => OpenEdit(t.id, t.bankname, t.bankaccountnumber, t.bankaccountname, t.bankbalance)}>Edit</ListItem>
                                                            : ""}
                                                    </List>
                                                </IconMenu>
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <p className="describtionjobcontainer01"><span>Name:</span> {t.bankname}</p>
                                            <p className="describtionjobcontainer01"><span>Opening Balance:</span> {Naira(t.bankbalance)}</p>
                                            <p className="describtionjobcontainer01"><span>Account Number:</span> {t.bankaccountnumber}</p>
                                            <p className="describtionjobcontainer01"><span>Account Name:</span> {t.bankaccountname}</p>
                                            <p className="describtionjobcontainer01"><span>Actual Balance:</span> {Naira(t.bankamount)}</p>
                                            <div className="changefloat2"></div>
                                            <p className="timejobcontainer01">{t.date}</p>
                                        </CardContent>
                                    </Card>
                                    <br />
                                </div>
                            ))}
                        </div>
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
                                            name="bankname" label="Bank Name" fullWidth={true}
                                            margin="normal" variant="outlined" onChange={(e) => BankNameChanger(e)} value={BankNameGet} select disabled>
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
                                        </TextField>
                                        <TextField
                                            id="bankaccountnumberid" label="Bank Account Number" fullWidth={true} defaultValue={bankaccountnumberGet}
                                            margin="normal" variant="outlined" onChange={() => NumberCheck("bankaccountnumberid")} />
                                        <TextField
                                            id="bankaccountnameid" label="Bank Account Name" fullWidth={true}
                                            margin="normal" variant="outlined" defaultValue={bankaccountnameGet} />
                                        <TextField
                                            id="bankamountid" label="Bank Balance" fullWidth={true} defaultValue={bankamountGet}
                                            margin="normal" onChange={() => NumberCheck("bankamountid")} />
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

export default EditBanks;