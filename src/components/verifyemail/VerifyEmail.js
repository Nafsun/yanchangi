import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag';
import {useQuery, useMutation} from 'react-apollo';
import MutationError from '../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../functions/theme';
import { Loading } from '../loading/Loading';
import DialogInfo from '../functions/dialoginfo';
import NoInternetConnection from '../nointernetconnection/NoInternetConnection';
import {Helmet} from "react-helmet";

const VERIFYEMAIL = gql`
    mutation emailverification($username: String, $verificationcode: String, $jwtauth: String){
        emailverification(username: $username, verificationcode: $verificationcode, jwtauth: $jwtauth){
            error
        }
    }
`;

const EMAILVERIFIED = gql`
    query emailverified($username: String, $jwtauth: String){
        emailverified(username: $username, jwtauth: $jwtauth){
            error
        }
    }
`;

function VerifyEmail(){

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [emailverifymutation] = useMutation(VERIFYEMAIL);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);

    useEffect(() => {
        if(userinfo == null){
            document.getElementById("hidelogin").click();
        }
    }, [userinfo]);

    const { error, data, loading, refetch } = useQuery(EMAILVERIFIED,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                        jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache'
        });

    if(loading){
        return <Loading/>;
    }

    if (error) {
        return <div className="internetclass"><NoInternetConnection error={error.toString()} /></div>;
    }
    
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

        emailverifymutation({variables: {username: userinfo.loginAccount.username, verificationcode: code.value, jwtauth: userinfo.loginAccount.token}}).then(({data}) => {
            if(data.emailverification.error === "verified"){
                refetch();
                PopBoxerEnd(true); PopBox("Successfully Verified Email");
            }else if(data.emailverification.error === "incorrect"){
                refetch();
                PopBoxerEnd(true); PopBox("Incorrect Verification Code");
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
    }

    const SendVerificationCode = () => {
        nextClickSet(true);

        emailverifymutation({variables: {username: userinfo.loginAccount.username, jwtauth: userinfo.loginAccount.token}}).then(({data}) => {
            if(data.emailverification.error === "send"){
                refetch();
                PopBoxerEnd(true); PopBox("Successfully Sent Verification Code to your Email");
            }else if(data.emailverification.error === "resend"){
                refetch();
                PopBoxerEnd(true); PopBox("Successfully Resend Verification Code to your Email");
            }else{
                PopBoxerEnd(true); PopBox(`${data.emailverification.error}`);
            }
            nextClickSet(false);
        }).catch((e) => MutationError(e.toString()));
    }

    return(
        <div className="downsmall3">
            <p 
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                <Cancel style={sizeoflogocomment2}/></span>
            </p>
            <p className="loginjobs7">Verify Email</p>
            <Helmet>
                <title>Verify Email</title>
            </Helmet>
            <div id="homeexpander2">

                {nextClickGet === true ? <Loading/> : ""}

                {data.emailverified.error === "verified" ?
                    <p align="center" className="nocf">You have Successfully verified your Email Address</p>
                : 
                <ThemeProvider theme={theme}>
                {data.emailverified.error === "codenotsent" ?
                    <div>
                    <p className="nocf">Click the button below to send verification code to your Email Address</p>
                    <Button 
                        fullWidth={true}
                        onClick={() => SendVerificationCode()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Send Verification Code</Button>
                    </div>
                :
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
                }
                </ThemeProvider>
                }
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
            : ""}
            <br/>
            <br/>
        </div>
    );
}

export default VerifyEmail;