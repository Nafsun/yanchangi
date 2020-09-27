import React, {useState} from 'react';
import Cancel from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../functions/theme';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { Loading } from '../loading/Loading';
import MutationError from '../functions/mutationerror';
import DialogInfo from '../functions/dialoginfo';
import {Helmet} from "react-helmet";

const HELPMUT = gql`
    mutation usershelp($username: String, $sentmessage: String, $jwtauth: String){
        usershelp(username: $username, sentmessage: $sentmessage, jwtauth: $jwtauth){
            error
        }
    }
`;

function Help(){
    
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [helpmutation] = useMutation(HELPMUT);
    const [nextClickGet, nextClickSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);

    const sizeoflogocomment2 = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em",
        paddingTop:"8px"
    }
    
    const goback = () => {
        window.history.back();
    }

    const getHelp = () => {
        if(userinfo === null){
            PopBoxerEnd(true);
            PopBox("Please login to your account");
            return false;
        }
        let sentmessage = document.getElementById("helpid");
        if(sentmessage.value === ""){
            PopBoxerEnd(true);
            PopBox("Please describe your problem in detail");
            return false;
        }
        nextClickSet(true);
        helpmutation({ variables: { username: userinfo.loginAccount.username, sentmessage: sentmessage.value, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => {
            nextClickSet(false);
            if (data.usershelp.error === "no") {
                PopBoxerEnd(true);
                PopBox("Successfully Sent, you will get a reply within 24 hours");
                sentmessage.value = null;
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const PopBox = (val) => {
        PopBoxTextSet(val);
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
            <p className="loginjobs7">Help & Report</p>
            <Helmet>
                <title>Help & Report</title>
                <meta name="description" content="Ask us a question" />
            </Helmet>
            <div id="homeexpander3">
                {nextClickGet === true ? <Loading/> : ""}
                <ThemeProvider theme={theme}>
                <TextField 
                id="helpid" fullWidth={true} variant="outlined"
                margin="dense" multiline={true}
                rowsMax={4} placeholder="Describe what you need? ask us a question" /> 
                </ThemeProvider>
                <Button 
                    fullWidth={true}
                    onClick={() => getHelp()}
                    style={{color: "white", backgroundColor: "rgb(107, 43, 8)", marginLeft:"50%", width:"50%"}}
                >Submit</Button>
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
            : ""}
        </div>
    );
}

export default Help;