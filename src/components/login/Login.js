import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag';
import {useMutation} from 'react-apollo';
import MutationError from '../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import { JustLoading } from '../loading/Loading';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../functions/theme';
import {Helmet} from "react-helmet";
import UsernameValidateCheck from '../functions/usernamevalidatecheck';
import DialogInfo from '../functions/dialoginfo';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterComplete } from '../../actions';

const LOGINVERIFY = gql`
    mutation loginAccount($username: String, $password: String){
        loginAccount(username: $username, password: $password){
            error,
            username,
            token
        }
    }
`;

function Login(){

    const [loginmutation] = useMutation(LOGINVERIFY);
    const [userGet, userSet] = useState("");
    const [passGet, passSet] = useState("");
    const [loadingStart, loadingEnd] = useState(false);
    const [InvalidGet, InvalidChange] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const rcomplete = useSelector(r => r.rcomplete);
    const dispatch = useDispatch();

    useEffect(() => {
        if(rcomplete === "yes"){
            PopBoxerEnd(true);
            PopBox("Signup Successful, Please login to your account");
            dispatch(RegisterComplete("no"));
        }
    }, [rcomplete, dispatch]);

    const sizeoflogocomment2 = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em",
        paddingTop:"8px"
    }

    const userHere = (event) => {
        UsernameValidateCheck("usernameid2");
        userSet(event.target.value.replace(/(<([^>]+)>)/ig,"").toLowerCase());
    }

    const passHere = (event) => {
        passSet(event.target.value);
    }

    const LoginFunc = () => {
        
        if(userGet === ""){
            return false;
        }
        if(passGet === ""){
            return false;
        }

        InvalidChange(false);
        loadingEnd(true);

        loginmutation({variables: {username: userGet, password: passGet}}).then(({data}) => {
            if(data.loginAccount.error === "yes"){
                InvalidChange(true);
                loadingEnd(false);
            }else{
                localStorage.setItem("userinfo", JSON.stringify(data));
                loadingEnd(false);
                document.getElementById("hideaccount").click();
            }
        }).catch((e) => {
            loadingEnd(false);
            MutationError(e.toString());
        });
    }

    const SignUp = () => {
        document.getElementById("hidesignup").click();
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

    return(
        <div className="downsmall3">
            <p 
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                <Cancel style={sizeoflogocomment2}/></span>
            </p>
            <p className="loginjobs7">Login</p>
            <Helmet>
                <title>Login</title>
                <meta name="description" content="Login to your TexTailng account" />
            </Helmet>
            <div id="homeexpander2">
                {InvalidGet ? <p className="creden">Invalid credentials</p> : ""}
                
                {loadingStart ? <JustLoading/> : ""}

                <ThemeProvider theme={theme}>
                <TextField 
                    id="usernameid2" label="Username" fullWidth={true}
                    margin="normal" onChange={(e) => userHere(e)} variant="outlined" />
                <TextField 
                    type="password" id="passwordid2" label="Password" fullWidth={true}
                    margin="normal" onChange={(e) => passHere(e)} variant="outlined" />
                <p onClick={() => document.getElementById("hideforgotpassword").click()} className="forgotpassword">Forgot Password</p>
                <Button 
                    fullWidth={true}
                    onClick={() => LoginFunc()}
                    style={{color: "white", backgroundColor: "rgb(107, 43, 8)", padding: "13px"}}
                >Login</Button>
                </ThemeProvider>
                <br/>
                <p className="donthaveaccount"><span onClick={() => SignUp()}>create an account</span></p>
                <br/>
            </div>
            <br/>
            <br/>
            {PopBoxerStart ? 
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} /> 
            : ""}
        </div>
    );
}

export default Login;