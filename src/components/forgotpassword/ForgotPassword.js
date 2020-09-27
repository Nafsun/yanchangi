import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useMutation} from 'react-apollo';
import MutationError from '../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../functions/theme';
import { Loading } from '../loading/Loading';
import DialogInfo from '../functions/dialoginfo';
import {Helmet} from "react-helmet";
import UsernameValidateCheck from '../functions/usernamevalidatecheck';

const VERIFYNEWPASSWORD = gql`
    mutation newpasswordverification($username: String, $verificationcode: String, $newpassword: String){
        newpasswordverification(username: $username, verificationcode: $verificationcode, newpassword: $newpassword){
            error
        }
    }
`;

function ForgotPassword(){

    const [newpasswordverifymutation] = useMutation(VERIFYNEWPASSWORD);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [getVisible, setVisible] = useState(false);
    const [getChangeEye, setChangeEye] = useState(<VisibilityOff/>);
    const [getUsername, setUsername] = useState("");
    const [getInfo, setInfo] = useState("");
    
    const sizeoflogocomment2 = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em",
        paddingTop:"8px"
    }

    const goback = () => {
        window.history.back();
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const VerifyEmail = () => {
        let code = document.getElementById("codeid");

        if(code.value === ""){ PopBoxerEnd(true); PopBox("Verification Code not set"); return false; }

        nextClickSet(true);

        newpasswordverifymutation({variables: {username: getUsername, verificationcode: code.value}}).then(({data}) => {
            if(data.newpasswordverification.error === "verified"){
                setInfo("verified");
                PopBoxerEnd(true); PopBox("Successfully Verified Email");
            }else if(data.newpasswordverification.error === "incorrect"){
                PopBoxerEnd(true); PopBox("Incorrect Verification Code");
            }else if(data.newpasswordverification.error === "usernamenotfound"){
                PopBoxerEnd(true); PopBox(`${getUsername} was not found on our system`);
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
    }

    const SendVerificationCode = () => {
        if(getUsername === ""){ PopBoxerEnd(true); PopBox("username not set"); return false; }

        nextClickSet(true);

        newpasswordverifymutation({variables: {username: getUsername}}).then(({data}) => {
            if(data.newpasswordverification.error === "send"){
                setInfo("codesent");
                PopBoxerEnd(true); PopBox("Successfully Sent Verification Code to your Email");
            }else if(data.newpasswordverification.error === "resend"){
                setInfo("codesent");
                PopBoxerEnd(true); PopBox("Successfully Resend Verification Code to your Email");
            }else if(data.newpasswordverification.error === "usernamenotfound"){
                PopBoxerEnd(true); PopBox(`${getUsername} was not found on our system`);
            }else if(data.newpasswordverification.error === "notadmin"){
                PopBoxerEnd(true); PopBox(`Your password can only be changed by your admin`);
            }else{
                PopBoxerEnd(true); PopBox(`${data.newpasswordverification.error}`);
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
    }
 
    const SetPassword = () => {
        let pass = document.getElementById("newpasswordid");
        if(pass.value === ""){ PopBoxerEnd(true); PopBox("password not set"); return false; }
        if(pass.value.length < 8){ PopBoxerEnd(true); PopBox("password must be 8 characters or numbers in length or more"); return false; }

        nextClickSet(true);

        newpasswordverifymutation({variables: {username: getUsername, verificationcode: "no", newpassword: pass.value}}).then(({data}) => {
            if(data.newpasswordverification.error === "set"){
                localStorage.removeItem("userinfo");
                document.getElementById("hidelogin").click();
            }else if(data.newpasswordverification.error === "usernamenotfound"){
                PopBoxerEnd(true); PopBox(`${getUsername} was not found on our system`);
            }else if(data.newpasswordverification.error === "hacker"){
                PopBoxerEnd(true); PopBox("Are you a Hacker, if you are, we have the most secured network and also an unhackable infrastructure in the universe");
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
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
        let st = document.getElementById("newpasswordid");
        let value = st.getAttribute("type")
        if(value === "password"){
            st.setAttribute("type", "text");
            setChangeEye(<Visibility/>);
        }else{
            st.setAttribute("type", "password");
            setChangeEye(<VisibilityOff/>);
        }
    }

    const userHere = (event) => {
        UsernameValidateCheck("usernameid");
        setUsername(event.target.value.replace(/(<([^>]+)>)/ig,"").toLowerCase());
    }

    return(
        <div className="downsmall3">
            <p 
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                <Cancel style={sizeoflogocomment2}/></span>
            </p>
            <p className="loginjobs7">Forgot Password</p>
            <Helmet>
                <title>Forgot Password</title>
            </Helmet>
            <div id="homeexpander2">

                {nextClickGet === true ? <Loading/> : ""}

                <ThemeProvider theme={theme}>
                {getInfo === "" ?
                    <div>
                    <p className="nocf">Click the button below to send verification code to your Email Address for password reset</p>
                    <TextField 
                        id="usernameid" label="Username" fullWidth={true} helperText="input your username for reset password"
                        margin="normal" variant="outlined" onChange={(e) => userHere(e)} />
                    <Button 
                        fullWidth={true}
                        onClick={() => SendVerificationCode()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Send Verification Code</Button>
                    </div>
                : ""}
                {getInfo === "codesent" ?
                    <div>
                    <TextField 
                        id="codeid" label="Verification Code" fullWidth={true} helperText="paste the verification code sent to your email here"
                        margin="normal" variant="outlined" />
                    <br/>
                    <Button 
                        fullWidth={true}
                        onClick={() => VerifyEmail()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Verify</Button>
                    <br/><br/>
                    <Button 
                        fullWidth={true}
                        onClick={() => SendVerificationCode()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Re-Send Verification Code</Button>
                    </div>
                : ""}
                {getInfo === "verified" ?
                    <div>
                    <TextField 
                        id="newpasswordid" label="New Password" fullWidth={true} helperText="Enter your new password here"
                        margin="normal" variant="outlined" type="password" onChange={(e) => VisibilityFunc(e)} />
                        <span onClick={() => seeText()} id="visibilityeyes">
                            {getVisible ? getChangeEye : ''}
                        </span>
                    <br/>
                    <Button 
                        fullWidth={true}
                        onClick={() => SetPassword()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Set Password</Button>
                    <br/>
                    </div>
                : ""}
                </ThemeProvider>
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
            : ""}
            <br/>
            <br/>
        </div>
    );
}

export default ForgotPassword;