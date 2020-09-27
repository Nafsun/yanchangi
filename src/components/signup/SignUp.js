import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useMutation} from 'react-apollo';
import MutationError from '../functions/mutationerror';
import NumberCheck from '../functions/numbercheck';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Cancel from '@material-ui/icons/Cancel';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../functions/theme';
import { DialogLoader, JustLoading } from '../loading/Loading';
import DialogInfo from '../functions/dialoginfo';
import ValidateEmail from '../functions/validateemail';
import {Helmet} from "react-helmet";
import UsernameValidateCheck from '../functions/usernamevalidatecheck';
import { useDispatch } from 'react-redux';
import { RegisterComplete } from '../../actions';

const SIGNUPVERIFY = gql`
    mutation createAccount($fullname: String, $email: String, $phoneno: String, $gender: String, $username: String, $password: String){
        createAccount(fullname: $fullname, email: $email, phoneno: $phoneno, gender: $gender, username: $username, password: $password){
            error
        }
    }
`;

const USERNAMEAVAILABILITY = gql` 
    mutation usernameavailability($username: String){
        usernameavailability(username: $username){
            error
        }
    }
`;

function SignUp(){

    const [getGender, setGender] = useState("");
    const [getVisible, setVisible] = useState(false);
    const [getChangeEye, setChangeEye] = useState(<VisibilityOff/>);
    const [InvalidSignGet, InvalidSignChange] = useState(false); //validate if username exist
    const [signupmutation] = useMutation(SIGNUPVERIFY);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [WaitWhileUpdating, WaitWhileUpdatingSet] = useState(false);
    const [nextClickGet, nextClickSet] = useState(false);
    const [availableGet, availableSet] = useState(false);
    const [notavailableGet, notavailableSet] = useState(false);
    const [usernameavailabilitymutation] = useMutation(USERNAMEAVAILABILITY);
    const dispatch = useDispatch();

    const sizeoflogocomment2 = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em",
        paddingTop:"8px"
    }
    
    const SignUpFunc = () => {
        
        let user = document.getElementById("usernameid").value.replace(/(<([^>]+)>)/ig,"").toLowerCase();
        let pass = document.getElementById("passwordid").value;
        let full = document.getElementById("fullnameid").value.replace(/(<([^>]+)>)/ig,"");
        let email = document.getElementById("emailid").value;
        let phoneno = document.getElementById("phonenoid").value;
        
        if(full === ""){ PopBoxerEnd(true); PopBox("fullname not set"); return false; }
        if(email === ""){ PopBoxerEnd(true); PopBox("email not set"); return false; }
        if(ValidateEmail(email) === false){ PopBoxerEnd(true); PopBox("invalid email"); return false; }
        if(phoneno === ""){ PopBoxerEnd(true); PopBox("phoneno not set"); return false; }
        if(phoneno.length !== 11){ PopBoxerEnd(true); PopBox("phoneno must be 11 numbers"); return false; }
        if(getGender === ""){ PopBoxerEnd(true); PopBox("gender not set"); return false; }
        if(user === ""){ PopBoxerEnd(true); PopBox("username not set"); return false; }
        if(user.length < 3){ PopBoxerEnd(true); PopBox("username must be 3 characters or more"); return false; }
        if(pass === ""){ PopBoxerEnd(true); PopBox("password not set"); return false; }
        if(pass.length < 4){ PopBoxerEnd(true); PopBox("password must be 4 characters or more"); return false; }

        if(availableGet !== true){
            PopBoxerEnd(true);
            PopBox("Username Already Exist");
        }

        InvalidSignChange(false);
        WaitWhileUpdatingSet(true); //popup and starting loading on submit

        signupmutation({variables: {fullname: full, email: email, phoneno: phoneno, gender: getGender, username: user, password: pass}}).then(({data}) => {
            WaitWhileUpdatingSet(false); // cancel popup on finsihed upload
            if(data.createAccount.error === "exist"){
                InvalidSignChange(true);
                PopBoxerEnd(true);
                PopBox("Username Already Exist");
            }else{
                dispatch(RegisterComplete("yes"));
                document.getElementById("hidelogin").click();
            }
        }).catch((e) => {
            WaitWhileUpdatingSet(false);
            MutationError(e.toString());
        });
    }

    const genderChanger = (event) => {
        setGender(event.target.value);
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

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const UsernameAvailabilityCheck = () => {

        UsernameValidateCheck("usernameid");

        let user = document.getElementById("usernameid");
        let usern = user.value.toLowerCase().replace(/\s+/g, "_");

        if(usern.length < 3){
            availableSet(false);
            notavailableSet(false);
            return;
        }
        
        nextClickSet(true);
        usernameavailabilitymutation({ variables: { username: usern } }).then(({ data }) => {
            if(data.usernameavailability.error === "available"){
                availableSet(true);
                notavailableSet(false);
            }else if(data.usernameavailability.error === "notavailable"){
                availableSet(false);
                notavailableSet(true);
            }else if(data.usernameavailability.error === "noinput"){
                availableSet(false);
                notavailableSet(false);
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
    }

    const goback = () => {
        window.history.back();
    }

    return(
        <div>
        <div className="downsmall3">
        <p 
            className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
            <Cancel style={sizeoflogocomment2}/></span>
        </p>
        <p className="loginjobs7">Sign Up</p>
            <Helmet>
                <title>Sign Up</title>
                <meta name="description" content="Create an Account with TexTailng" />
            </Helmet>
            <div id="homeexpander2">
                <div className="signupspace">

                    {nextClickGet === true ? <JustLoading/> : ""}

                    {InvalidSignGet === true ? <p className="creden">Username Already Exist</p> : ""}
                    <ThemeProvider theme={theme}>
                    <TextField 
                    id="fullnameid" label="Fullname" fullWidth={true}
                    margin="normal" variant="outlined" />
                    <TextField 
                    id="emailid" label="Email" fullWidth={true}
                    margin="normal" variant="outlined" />
                    <TextField 
                    id="phonenoid" label="Phone Number" fullWidth={true} type="tel"
                    margin="normal" variant="outlined" onChange={() => NumberCheck("phonenoid")} />
                    <TextField 
                    name="gender" label="Gender" fullWidth={true}
                    margin="normal" variant="outlined" onChange={(e) => genderChanger(e)} value={getGender} select>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                    <TextField 
                    id="usernameid" label="Username" fullWidth={true} helperText="username cannot be changed later, choose wisely"
                    margin="normal" variant="outlined" onChange={() => UsernameAvailabilityCheck()} />
                    {availableGet === true ? <p className="available">available<br/><br/></p> : ""}
                    {notavailableGet === true ? <p className="notavailable">already exist<br/><br/></p> : ""}
                    <TextField 
                    type="password" id="passwordid" label="Password" fullWidth={true}
                    margin="normal" variant="outlined" onChange={(e) => VisibilityFunc(e)} />
                    <span onClick={() => seeText()} id="visibilityeyes">
                        {getVisible ? getChangeEye : ''}
                    </span>
                    <br/>
                    <br/>
                    <Button 
                        fullWidth={true}
                        onClick={() => SignUpFunc()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)", padding: "13px"}}
                    >Submit</Button>
                    <p className="donthaveaccount"><span onClick={() => document.getElementById("hidelogin").click()}>already have an account</span></p>
                    </ThemeProvider>
                    {WaitWhileUpdating ?
                        <DialogLoader PopBoxTitleGet={"Wait while Signing up"} />      
                    : ""}
                    {PopBoxerStart ? 
                        <DialogInfo PopBoxTitleGet={"Message"} PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} /> 
                    : ""}
                </div>
            </div>
            <br/>
            <br/>
            <br/>
        </div>
        </div>
    );
}

export default SignUp;