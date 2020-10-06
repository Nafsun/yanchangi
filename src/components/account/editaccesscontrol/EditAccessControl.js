import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import MutationError from '../../functions/mutationerror';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import { CurrentLoading, Loading } from '../../loading/Loading';
import DialogPopper from '../../functions/dialogpopper';
import DialogInfo from '../../functions/dialoginfo';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';
import UsernameValidateCheck from '../../functions/usernamevalidatecheck';

//Existing users
const EXISTINGUSERS = gql`
    query existingusers($username: String, $jwtauth: String){
        existingusers(username: $username, jwtauth: $jwtauth){
            id, username, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, createreconcile, editreconcile, deletereconcile
        }
    }
`;

//Existing users delete
const EXISTINGUSERSDELETE = gql`
    mutation existingusersdelete($id: String, $username: String, $jwtauth: String){
        existingusersdelete(id: $id, username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

//Existing users update
const EXISTINGUSERSUPDATE = gql`
    mutation existingusersupdate($id: String, $username: String, $newusername: String, $newpassword: String, $createbank: String, $editbank: String, $deletebank: String, $createtransaction: String, $edittransaction: String, $deletetransaction: String, $createrecieveorpay: String, $editrecieveorpay: String, $deleterecieveorpay: String, $createexpense: String, $editexpense: String, $deleteexpense: String, $createopeningbalance: String, $editopeningbalance: String, $deleteopeningbalance: String, $createreconcile: String, $editreconcile: String, $deletereconcile: String, $jwtauth: String){
        existingusersupdate(id: $id, username: $username, newusername: $newusername, newpassword: $newpassword, createbank: $createbank, editbank: $editbank, deletebank: $deletebank, createtransaction: $createtransaction, edittransaction: $edittransaction, deletetransaction: $deletetransaction, createrecieveorpay: $createrecieveorpay, editrecieveorpay: $editrecieveorpay, deleterecieveorpay: $deleterecieveorpay, createexpense: $createexpense, editexpense: $editexpense, deleteexpense: $deleteexpense, createopeningbalance: $createopeningbalance, editopeningbalance: $editopeningbalance, deleteopeningbalance: $deleteopeningbalance, createreconcile: $createreconcile, editreconcile: $editreconcile, deletereconcile: $deletereconcile, jwtauth: $jwtauth){
            error
        }
    }
`;

function EditAccessControl(props) {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [existingusersupdatemutation] = useMutation(EXISTINGUSERSUPDATE);
    const [deletepostmutation] = useMutation(EXISTINGUSERSDELETE);
    const [waitloadGet, waitloadSet] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [editGet, editSet] = useState(false);

    const [idGet, idSet] = useState("no");
    const [usernameGet, usernameSet] = useState("no");
    const [CreateBankGet, CreateBankSet] = useState("no");
    const [EditBankGet, EditBankSet] = useState("no");
    const [DeleteBankGet, DeleteBankSet] = useState("no");
    const [CreateTransactionGet, CreateTransactionSet] = useState("no");
    const [EditTransactionGet, EditTransactionSet] = useState("no");
    const [DeleteTransactionGet, DeleteTransactionSet] = useState("no");
    const [CreateRecieveorpayGet, CreateRecieveorpaySet] = useState("no");
    const [EditRecieveorpayGet, EditRecieveorpaySet] = useState("no");
    const [DeleteRecieveorpayGet, DeleteRecieveorpaySet] = useState("no");
    const [CreateExpenseGet, CreateExpenseSet] = useState("no");
    const [EditExpenseGet, EditExpenseSet] = useState("no");
    const [DeleteExpenseGet, DeleteExpenseSet] = useState("no");
    const [CreateOpeningBalanceGet, CreateOpeningBalanceSet] = useState("no");
    const [EditOpeningBalanceGet, EditOpeningBalanceSet] = useState("no");
    const [DeleteOpeningBalanceGet, DeleteOpeningBalanceSet] = useState("no");
    const [CreateReconcileGet, CreateReconcileSet] = useState("no");
    const [EditReconcileGet, EditReconcileSet] = useState("no");
    const [DeleteReconcileGet, DeleteReconcileSet] = useState("no");

    const [deleteidGet, deleteidSet] = useState(null);
    const [deleteGetter, deleteSetter] = useState(false);

    const [getVisible, setVisible] = useState(false);
    const [getChangeEye, setChangeEye] = useState(<VisibilityOff />);

    const sizeoflogo = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    const { error, data, refetch } = useQuery(EXISTINGUSERS,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                    nextClickSet(false);
                }
            }
        });

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const DeletePost = () => {
        deleteSetter(false);
        nextClickSet(true);
        deletepostmutation({ variables: { id: deleteidGet, username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => { //updating a like 
            if (data.existingusersdelete.error === "errortoken") { //if token expires
                document.getElementById("hidelogin").click();
            } else if (data.existingusersdelete.error === "no") {
                PopBoxerEnd(true);
                PopBox("Access Control Successfully Deleted");
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

    const OpenEdit = (id, username, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, createreconcile, editreconcile, deletereconcile) => {
        idSet(id); usernameSet(username); CreateBankSet(createbank); EditBankSet(editbank); DeleteBankSet(deletebank); CreateTransactionSet(createtransaction);
        EditTransactionSet(edittransaction); DeleteTransactionSet(deletetransaction); CreateRecieveorpaySet(createrecieveorpay); EditRecieveorpaySet(editrecieveorpay);
        DeleteRecieveorpaySet(deleterecieveorpay); CreateExpenseSet(createexpense); EditExpenseSet(editexpense);
        DeleteExpenseSet(deleteexpense); CreateOpeningBalanceSet(createopeningbalance); EditOpeningBalanceSet(editopeningbalance);
        DeleteOpeningBalanceSet(deleteopeningbalance); CreateReconcileSet(createreconcile); EditReconcileSet(editreconcile);
        DeleteReconcileSet(deletereconcile); 
        editSet(true);
    }

    const BackEdit = () => {
        editSet(false);
    }

    const EditingClientUpdate = () => {

        let newusername = document.getElementById("usernameid").value.replace(/(<([^>]+)>)/ig, "");
        let newpassword = document.getElementById("passwordid").value.replace(/(<([^>]+)>)/ig, "");

        if (newusername === "") {
            PopBoxerEnd(true); PopBox("Username cannot be empty"); return false;
        }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        existingusersupdatemutation({ variables: { id: idGet, username: u, newusername, newpassword, createbank: CreateBankGet, editbank: EditBankGet, deletebank: DeleteBankGet, createtransaction: CreateTransactionGet, edittransaction: EditTransactionGet, deletetransaction: DeleteTransactionGet, createrecieveorpay: CreateRecieveorpayGet, editrecieveorpay: EditRecieveorpayGet, deleterecieveorpay: DeleteRecieveorpayGet, createexpense: CreateExpenseGet, editexpense: EditExpenseGet, deleteexpense: DeleteExpenseGet, createopeningbalance: CreateOpeningBalanceGet, editopeningbalance: EditOpeningBalanceGet, deleteopeningbalance: DeleteOpeningBalanceGet, createreconcile: CreateReconcileGet, editreconcile: EditReconcileGet, deletereconcile: DeleteReconcileGet, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            editSet(false);
            if (data.existingusersupdate.error === "no") {
                PopBoxerEnd(true); PopBox(`Successfully Updated ${newusername} access control in your user base`);
                refetch();
            } else if (data.existingusersupdate.error === "passwordchange") {
                PopBoxerEnd(true); PopBox(`Successfully Updated ${newusername} password and access control in your user base`);
                refetch();
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const BringOutDelete = (id) => {
        deleteidSet(id);
        deleteSetter(true);
    }

    const CreateBankFunc = (event) => {
        if (event.target.checked === true) {
            CreateBankSet("yes");
        } else {
            CreateBankSet("no");
        }
    }

    const EditBankFunc = (event) => {
        if (event.target.checked === true) {
            EditBankSet("yes");
        } else {
            EditBankSet("no");
        }
    }

    const DeleteBankFunc = (event) => {
        if (event.target.checked === true) {
            DeleteBankSet("yes");
        } else {
            DeleteBankSet("no");
        }
    }

    const CreateTransactionFunc = (event) => {
        if (event.target.checked === true) {
            CreateTransactionSet("yes");
        } else {
            CreateTransactionSet("no");
        }
    }

    const EditTransactionFunc = (event) => {
        if (event.target.checked === true) {
            EditTransactionSet("yes");
        } else {
            EditTransactionSet("no");
        }
    }

    const DeleteTransactionFunc = (event) => {
        if (event.target.checked === true) {
            DeleteTransactionSet("yes");
        } else {
            DeleteTransactionSet("no");
        }
    }

    const CreateRecieveorpayFunc = (event) => {
        if (event.target.checked === true) {
            CreateRecieveorpaySet("yes");
        } else {
            CreateRecieveorpaySet("no");
        }
    }

    const EditRecieveorpayFunc = (event) => {
        if (event.target.checked === true) {
            EditRecieveorpaySet("yes");
        } else {
            EditRecieveorpaySet("no");
        }
    }

    const DeleteRecieveorpayFunc = (event) => {
        if (event.target.checked === true) {
            DeleteRecieveorpaySet("yes");
        } else {
            DeleteRecieveorpaySet("no");
        }
    }

    const CreateExpenseFunc = (event) => {
        if (event.target.checked === true) {
            CreateExpenseSet("yes");
        } else {
            CreateExpenseSet("no");
        }
    }

    const EditExpenseFunc = (event) => {
        if (event.target.checked === true) {
            EditExpenseSet("yes");
        } else {
            EditExpenseSet("no");
        }
    }

    const DeleteExpenseFunc = (event) => {
        if (event.target.checked === true) {
            DeleteExpenseSet("yes");
        } else {
            DeleteExpenseSet("no");
        }
    }

    const CreateOpeningBalanceFunc = (event) => {
        if (event.target.checked === true) {
            CreateOpeningBalanceSet("yes");
        } else {
            CreateOpeningBalanceSet("no");
        }
    }

    const EditOpeningBalanceFunc = (event) => {
        if (event.target.checked === true) {
            EditOpeningBalanceSet("yes");
        } else {
            EditOpeningBalanceSet("no");
        }
    }

    const DeleteOpeningBalanceFunc = (event) => {
        if (event.target.checked === true) {
            DeleteOpeningBalanceSet("yes");
        } else {
            DeleteOpeningBalanceSet("no");
        }
    }

    const CreateReconcileFunc = (event) => {
        if (event.target.checked === true) {
            CreateReconcileSet("yes");
        } else {
            CreateReconcileSet("no");
        }
    }

    const EditReconcileFunc = (event) => {
        if (event.target.checked === true) {
            EditReconcileSet("yes");
        } else {
            EditReconcileSet("no");
        }
    }

    const DeleteReconcileFunc = (event) => {
        if (event.target.checked === true) {
            DeleteReconcileSet("yes");
        } else {
            DeleteReconcileSet("no");
        }
    }

    const VisibilityFunc = (event) => {
        if (event.target.value === "") {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }

    //Changing the eyes visibility
    const seeText = () => {
        let st = document.getElementById("passwordid");
        let value = st.getAttribute("type")
        if (value === "password") {
            st.setAttribute("type", "text");
            setChangeEye(<Visibility />);
        } else {
            st.setAttribute("type", "password");
            setChangeEye(<VisibilityOff />);
        }
    }

    return (
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div id="scrolldown" className="scrollpost">
                    <div>

                        {nextClickGet === true ? <Loading /> : ""}

                        {data.existingusers.length === 0 && nextClickGet === false ? <p align="center" className="datef">You have not created any user yet</p> : ""}
                        <div className="changefloat2"></div>

                        <br/>

                        <div className="loginspace">
                            {data.existingusers.map((t) => (
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
                                                        <ListItem onClick={() => BringOutDelete(t.id)}>Delete</ListItem>
                                                        <ListItem onClick={() => OpenEdit(t.id, t.username, t.createbank, t.editbank, t.deletebank, t.createtransaction, t.edittransaction, t.deletetransaction, t.createrecieveorpay, t.editrecieveorpay, t.deleterecieveorpay, t.createexpense, t.editexpense, t.deleteexpense, t.createopeningbalance, t.editopeningbalance, t.deleteopeningbalance, t.createreconcile, t.editreconcile, t.deletereconcile)}>Edit</ListItem>
                                                    </List>
                                                </IconMenu>
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <p className="describtionjobcontainer01"><span>Username:</span> {t.username}</p>
                                            <p className="describtionjobcontainer01"><span>Create Bank:</span> {t.createbank}</p>
                                            <p className="describtionjobcontainer01"><span>Edit bank:</span> {t.editbank}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Bank:</span> {t.deletebank}</p>
                                            <p className="describtionjobcontainer01"><span>Create Transaction:</span> {t.createtransaction}</p>
                                            <p className="describtionjobcontainer01"><span>Edit Transaction:</span> {t.edittransaction}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Transaction:</span> {t.deletetransaction}</p>
                                            <p className="describtionjobcontainer01"><span>Create Recieved or Pay:</span> {t.createrecieveorpay}</p>
                                            <p className="describtionjobcontainer01"><span>Edit Recieved or Pay:</span> {t.editrecieveorpay}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Recieved or Pay:</span> {t.deleterecieveorpay}</p>
                                            <p className="describtionjobcontainer01"><span>Create Expense:</span> {t.createexpense}</p>
                                            <p className="describtionjobcontainer01"><span>Edit Expense:</span> {t.editexpense}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Expense:</span> {t.deleteexpense}</p>
                                            <p className="describtionjobcontainer01"><span>Create Opening Balance:</span> {t.createopeningbalance}</p>
                                            <p className="describtionjobcontainer01"><span>Edit Opening Balance:</span> {t.editopeningbalance}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Opening Balance:</span> {t.deleteopeningbalance}</p>
                                            <p className="describtionjobcontainer01"><span>Create Reconcile:</span> {t.createreconcile}</p>
                                            <p className="describtionjobcontainer01"><span>Edit Reconcile:</span> {t.editreconcile}</p>
                                            <p className="describtionjobcontainer01"><span>Delete Reconcile:</span> {t.deletereconcile}</p>
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
                                            id="usernameid" label="Username" fullWidth={true} onChange={() => UsernameValidateCheck("usernameid")}
                                            margin="normal" variant="outlined" defaultValue={usernameGet} />
                                        <TextField
                                            id="passwordid" label="Password" fullWidth={true} helperText="leave it empty if you want to keep the existing password"
                                            margin="normal" variant="outlined" type="password" onChange={(e) => VisibilityFunc(e)} />
                                        <span onClick={() => seeText()} id="visibilityeyes">
                                            {getVisible ? getChangeEye : ''}
                                        </span>
                                        <div>
                                            <span className="accesscontroldesign">Create Bank {CreateBankGet === "no" ? <Checkbox onChange={(e) => CreateBankFunc(e)} /> : <Checkbox onChange={(e) => CreateBankFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Bank{EditBankGet === "no" ? <Checkbox onChange={(e) => EditBankFunc(e)} /> : <Checkbox onChange={(e) => EditBankFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Bank{DeleteBankGet === "no" ? <Checkbox onChange={(e) => DeleteBankFunc(e)} /> : <Checkbox onChange={(e) => DeleteBankFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Create Transaction{CreateTransactionGet === "no" ? <Checkbox onChange={(e) => CreateTransactionFunc(e)} /> : <Checkbox onChange={(e) => CreateTransactionFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Transaction{EditTransactionGet === "no" ? <Checkbox onChange={(e) => EditTransactionFunc(e)} /> : <Checkbox onChange={(e) => EditTransactionFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Transaction{DeleteTransactionGet === "no" ? <Checkbox onChange={(e) => DeleteTransactionFunc(e)} /> : <Checkbox onChange={(e) => DeleteTransactionFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Create Recieve or Pay{CreateRecieveorpayGet === "no" ? <Checkbox onChange={(e) => CreateRecieveorpayFunc(e)} /> : <Checkbox onChange={(e) => CreateRecieveorpayFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Recieve or Pay{EditRecieveorpayGet === "no" ? <Checkbox onChange={(e) => EditRecieveorpayFunc(e)} /> : <Checkbox onChange={(e) => EditRecieveorpayFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Recieve or Pay{DeleteRecieveorpayGet === "no" ? <Checkbox onChange={(e) => DeleteRecieveorpayFunc(e)} /> : <Checkbox onChange={(e) => DeleteRecieveorpayFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Create Expense{CreateExpenseGet === "no" ? <Checkbox onChange={(e) => CreateExpenseFunc(e)} /> : <Checkbox onChange={(e) => CreateExpenseFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Expense{EditExpenseGet === "no" ? <Checkbox onChange={(e) => EditExpenseFunc(e)} /> : <Checkbox onChange={(e) => EditExpenseFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Expense{DeleteExpenseGet === "no" ? <Checkbox onChange={(e) => DeleteExpenseFunc(e)} /> : <Checkbox onChange={(e) => DeleteExpenseFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Create Opening Balance{CreateOpeningBalanceGet === "no" ? <Checkbox onChange={(e) => CreateOpeningBalanceFunc(e)} /> : <Checkbox onChange={(e) => CreateOpeningBalanceFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Opening Balance{EditOpeningBalanceGet === "no" ? <Checkbox onChange={(e) => EditOpeningBalanceFunc(e)} /> : <Checkbox onChange={(e) => EditOpeningBalanceFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Opening Balance{DeleteOpeningBalanceGet === "no" ? <Checkbox onChange={(e) => DeleteOpeningBalanceFunc(e)} /> : <Checkbox onChange={(e) => DeleteOpeningBalanceFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Create Reconcile{CreateReconcileGet === "no" ? <Checkbox onChange={(e) => CreateReconcileFunc(e)} /> : <Checkbox onChange={(e) => CreateReconcileFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Edit Reconcile{EditReconcileGet === "no" ? <Checkbox onChange={(e) => EditReconcileFunc(e)} /> : <Checkbox onChange={(e) => EditReconcileFunc(e)} checked />}</span>
                                            <span className="accesscontroldesign">Delete Reconcile{DeleteReconcileGet === "no" ? <Checkbox onChange={(e) => DeleteReconcileFunc(e)} /> : <Checkbox onChange={(e) => DeleteReconcileFunc(e)} checked />}</span>
                                        </div>
                                        <Button
                                            fullWidth={true}
                                            onClick={() => EditingClientUpdate()}
                                            style={{ color: "white", backgroundColor: "rgb(107, 43, 8)" }}
                                        >Edit User</Button>
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

export default EditAccessControl;