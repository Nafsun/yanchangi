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
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import UsernameValidateCheck from '../../functions/usernamevalidatecheck';

//Add new user
const ADDNEWUSER = gql`
    mutation addnewuser($username: String, $newusername: String, $newpassword: String, $createbank: String, $editbank: String, $deletebank: String, $createtransaction: String, $edittransaction: String, $deletetransaction: String, $createrecieveorpay: String, $editrecieveorpay: String, $deleterecieveorpay: String, $createexpense: String, $editexpense: String, $deleteexpense: String, $createopeningbalance: String, $editopeningbalance: String, $deleteopeningbalance: String, $createreconcile: String, $editreconcile: String, $deletereconcile: String, $jwtauth: String){
        addnewuser(username: $username, newusername: $newusername, newpassword: $newpassword, createbank: $createbank, editbank: $editbank, deletebank: $deletebank, createtransaction: $createtransaction, edittransaction: $edittransaction, deletetransaction: $deletetransaction, createrecieveorpay: $createrecieveorpay, editrecieveorpay: $editrecieveorpay, deleterecieveorpay: $deleterecieveorpay, createexpense: $createexpense, editexpense: $editexpense, deleteexpense: $deleteexpense, createopeningbalance: $createopeningbalance, editopeningbalance: $editopeningbalance, deleteopeningbalance: $deleteopeningbalance, createreconcile: $createreconcile, editreconcile: $editreconcile, deletereconcile: $deletereconcile, jwtauth: $jwtauth){
            error
        }
    }
`;

function AccessControl() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [addnewusermut] = useMutation(ADDNEWUSER);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    //username, newusername, newpassword, createbank, editbank, deletebank, createtransaction, edittransaction, deletetransaction, createrecieveorpay, editrecieveorpay, deleterecieveorpay, createexpense, editexpense, deleteexpense, createopeningbalance, editopeningbalance, deleteopeningbalance, createreconcile, editreconcile, deletereconcile, jwtauth
    //CreateBankGet, EditBankGet, DeleteBankGet, CreateTransactionGet, EditTransactionGet, DeleteTransactionGet, CreateRecieveorpayGet, EditRecieveorpayGet, DeleteRecieveorpayGet
    //CreateBankSet, EditBankSet, DeleteBankSet, CreateTransactionSet, EditTransactionSet, DeleteTransactionSet, CreateRecieveorpaySet, EditRecieveorpaySet, DeleteRecieveorpaySet
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

    const [getVisible, setVisible] = useState(false);
    const [getChangeEye, setChangeEye] = useState(<VisibilityOff/>);

    const onSubmitClientUpload = () => {

        let newusername = document.getElementById("usernameid").value.replace(/(<([^>]+)>)/ig, "");
        let newpassword = document.getElementById("passwordid").value.replace(/(<([^>]+)>)/ig, "");

        if(newusername === ""){
            PopBoxerEnd(true); PopBox("Username cannot be empty"); return false;
        }

        if(newpassword === ""){
            PopBoxerEnd(true); PopBox("Password cannot be empty"); return false;
        }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        nextClickSet(true);

        addnewusermut({ variables: { username: u, newusername, newpassword, createbank: CreateBankGet, editbank: EditBankGet, deletebank: DeleteBankGet, createtransaction: CreateTransactionGet, edittransaction: EditTransactionGet, deletetransaction: DeleteTransactionGet, createrecieveorpay: CreateRecieveorpayGet, editrecieveorpay: EditRecieveorpayGet, deleterecieveorpay: DeleteRecieveorpayGet, createexpense: CreateExpenseGet, editexpense: EditExpenseGet, deleteexpense: DeleteExpenseGet, createopeningbalance: CreateOpeningBalanceGet, editopeningbalance: EditOpeningBalanceGet, deleteopeningbalance: DeleteOpeningBalanceGet, createreconcile: CreateReconcileGet, editreconcile: EditReconcileGet, deletereconcile: DeleteReconcileGet, jwtauth: j } }).then(({ data }) => {
            nextClickSet(false);
            if (data.addnewuser.error === "no") {
                PopBoxerEnd(true); PopBox(`Successfully Added ${newusername} to your user base`);
            } else if (data.addnewuser.error === "exist") {
                PopBoxerEnd(true); PopBox(`${newusername} already exist in your user base`);
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
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
        if(event.target.value === ""){
            setVisible(false);
        }else{
            setVisible(true);
        }   
    }

    //Changing the eyes visibility
    const seeText = () => {
        let st = document.getElementById("passwordid");
        let value = st.getAttribute("type")
        if(value === "password"){
            st.setAttribute("type", "text");
            setChangeEye(<Visibility/>);
        }else{
            st.setAttribute("type", "password");
            setChangeEye(<VisibilityOff/>);
        }
    }

    return (
        <div id="scrolldown" className="scrollpost">
            {nextClickGet === true ? <Loading /> : ""}
            <div className="loginspace">
                <ThemeProvider theme={theme}>
                    <TextField
                        id="usernameid" label="Username" fullWidth={true}
                        margin="normal" variant="outlined" onChange={() => UsernameValidateCheck("usernameid")} />
                    <TextField
                        id="passwordid" label="Password" fullWidth={true}
                        margin="normal" variant="outlined" type="password" onChange={(e) => VisibilityFunc(e)} />
                    <span onClick={() => seeText()} id="visibilityeyes">
                        {getVisible ? getChangeEye : ''}
                    </span>
                    <div>
                    <span className="accesscontroldesign">Create Bank<Checkbox onChange={(e) => CreateBankFunc(e)} /></span>
                    <span className="accesscontroldesign">Edit Bank<Checkbox onChange={(e) => EditBankFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Bank<Checkbox onChange={(e) => DeleteBankFunc(e)} /></span> 
                    <span className="accesscontroldesign">Create Transaction<Checkbox onChange={(e) => CreateTransactionFunc(e)} /></span> 
                    <span className="accesscontroldesign">Edit Transaction<Checkbox onChange={(e) => EditTransactionFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Transaction<Checkbox onChange={(e) => DeleteTransactionFunc(e)} /></span> 
                    <span className="accesscontroldesign">Create Recieve or Pay<Checkbox onChange={(e) => CreateRecieveorpayFunc(e)} /></span> 
                    <span className="accesscontroldesign">Edit Recieve or Pay<Checkbox onChange={(e) => EditRecieveorpayFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Recieve or Pay<Checkbox onChange={(e) => DeleteRecieveorpayFunc(e)} /></span> 
                    <span className="accesscontroldesign">Create Expense<Checkbox onChange={(e) => CreateExpenseFunc(e)} /></span> 
                    <span className="accesscontroldesign">Edit Expense<Checkbox onChange={(e) => EditExpenseFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Expense<Checkbox onChange={(e) => DeleteExpenseFunc(e)} /></span> 
                    <span className="accesscontroldesign">Create Opening Balance<Checkbox onChange={(e) => CreateOpeningBalanceFunc(e)} /></span> 
                    <span className="accesscontroldesign">Edit Opening Balance<Checkbox onChange={(e) => EditOpeningBalanceFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Opening Balance<Checkbox onChange={(e) => DeleteOpeningBalanceFunc(e)} /></span>
                    <span className="accesscontroldesign">Create Reconcile<Checkbox onChange={(e) => CreateReconcileFunc(e)} /></span> 
                    <span className="accesscontroldesign">Edit Reconcile<Checkbox onChange={(e) => EditReconcileFunc(e)} /></span> 
                    <span className="accesscontroldesign">Delete Reconcile<Checkbox onChange={(e) => DeleteReconcileFunc(e)} /></span> 
                    </div>
                    <Button
                        fullWidth={true}
                        onClick={() => onSubmitClientUpload()}
                        style={{ color: "white", backgroundColor: "rgb(107, 43, 8)" }}
                    >Add User</Button>
                </ThemeProvider>
                <br />
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
            : ""}
        </div>
    );
}

export default AccessControl;