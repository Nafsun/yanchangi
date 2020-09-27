import React, { useEffect, useState } from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import NoInternetConnection from '../nointernetconnection/NoInternetConnection';
import imageloading from "../images/loading.gif";
import MutationError from '../functions/mutationerror';
import Naira from '../functions/naira';
import { Loading } from '../loading/Loading';
import DialogInfo from '../functions/dialoginfo';
import { RaveProvider, RavePaymentButton } from "react-ravepayment";
import {Helmet} from "react-helmet";

const MEMBERSHIPCHECK = gql` 
    query membershipchecker($username: String, $jwtauth: String){
        membershipchecker(username: $username, jwtauth: $jwtauth){
            firstname, lastname, email, phoneno, verifymembership, dateofmembership
        }
    }
`;

const MEMBERSHIPFUND = gql` 
    mutation membershipfund($username: String, $IP: String, $amount: Float, $appfee: Float, $chargeResponseCode: String, $currency: String, $flwRef: String, $fraud_status: String, $paymentType: String, $status: String, $jwtauth: String){
        membershipfund(username: $username, IP: $IP, amount: $amount, appfee: $appfee, chargeResponseCode: $chargeResponseCode, currency: $currency, flwRef: $flwRef, fraud_status: $fraud_status, paymentType: $paymentType, status: $status, jwtauth: $jwtauth){
            error
        }
    }
`;

function Subscription() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [waitloadGet, waitloadSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);

    const [firstnameGet, firstnameSet] = useState("");
    const [lastnameGet, lastnameSet] = useState("");
    const [emailGet, emailSet] = useState("");
    const [phoneGet, phoneSet] = useState("");

    const [nextClickGet, nextClickSet] = useState(false);
    const [membershipfundmutation] = useMutation(MEMBERSHIPFUND);

    const [NetworkCheckGet, NetworkCheckSet] = useState(false);
    const [OfflineGet, OfflineSet] = useState(false);

    useEffect(() => {
        fetch("/networkchecker", {
            method: "GET"
        }).then((e) => {
            return e.json();
        }).then((e) => {
            if (e.message === "online") {
                if(navigator.onLine){
                    NetworkCheckSet(true);
                }else{
                    OfflineSet(true)
                }
            }
        }).catch(() => OfflineSet(true));
    }, []);
    
    const sizeoflogocomment2 = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    useEffect(() => {
        if (userinfo == null) {
            document.getElementById("hidelogin").click();
        }
    }, [userinfo]);

    const { error, data, refetch } = useQuery(MEMBERSHIPCHECK,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    firstnameSet(data.membershipchecker.firstname);
                    lastnameSet(data.membershipchecker.lastname);
                    emailSet(data.membershipchecker.email);
                    phoneSet(data.membershipchecker.phoneno);
                    waitloadSet(true);
                }
            }
        });

    if (error) {
        return <div className="internetclass"><NoInternetConnection error={error.toString()} /></div>;
    }

    const config = {
        txref: "rave-" + Math.random().toString().slice(2),
        pay_button_text: 'Deposit',
        custom_logo: 'https://files.textailng.com/textail-logo.png',
        custom_title: 'TexTailng',
        customer_email: emailGet,
        customer_phone: phoneGet,
        customer_firstname: firstnameGet,
        customer_lastname: lastnameGet,
        country: 'NG',
        currency: 'NGN',
        amount: parseInt(process.env.REACT_APP_SUBSCRIPTIONFEE),
        payment_options: ['card'], //, 'account', 'bank transfer'
        PBFPubKey: process.env.REACT_APP_FLUTTERWAVE,
        production: true,
        onSuccess: (response) => {
            if(response.tx.fraud_status === "ok" && response.tx.currency === "NGN"
                && response.tx.status === "successful" && response.tx.chargeResponseCode === '00' 
                && response.tx.paymentType === "card"){
                nextClickSet(true);
                membershipfundmutation({ variables: { username: userinfo.loginAccount.username, IP: response.tx.IP, amount: response.tx.amount, 
                                    appfee: response.tx.appfee, chargeResponseCode: response.tx.chargeResponseCode, currency: response.tx.currency, 
                                    flwRef: response.tx.flwRef, fraud_status: response.tx.fraud_status, paymentType: response.tx.paymentType, 
                                    status: response.tx.status, jwtauth: userinfo.loginAccount.token } }).then(({ data }) => {
                    if (data.membershipfund.error === "no") {
                        refetch({variables: {
                            username: userinfo.loginAccount.username,
                            jwtauth: userinfo.loginAccount.token
                        }});
                        PopBoxerEnd(true); PopBox("Successfully Paid your Subscription Fee");
                    }
                    nextClickSet(false);
                }).catch((e) => MutationError(e.toString()));
            }else{
                PopBoxerEnd(true); PopBox("Transaction Unsuccessful");
            }
        },
        onClose: () => {
            console.log("close payment - flutterwave");
        }
    };

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    const goback = () => {
        window.history.back();
    }

    return (
        <div className="downsmall3">
            <p
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                    <Cancel style={sizeoflogocomment2}></Cancel></span>
            </p>
            <p className="loginjobs6">Subscription</p>
            <Helmet>
                <title>Subscription</title>
            </Helmet>
            <div align="center" id="homeexpander3">
                {NetworkCheckGet === false ?
                    (OfflineGet === false ?
                        <p align="center" className="nocf"><img className="imageloadingsize6" src={imageloading} alt="Loading.."/></p>
                    : 
                        <p align="center" className="nocf">You're Offline</p>
                    )
                :
                    <div>
                        <br/>
                        {waitloadGet === false ?
                            <p align="center" className="nocf"><img className="imageloadingsize6" src={imageloading} alt="Loading.."/></p>
                        :
                            (data.membershipchecker.verifymembership === "yes" ?
                                <p align="center" className="nocf">You have successfully paid a sum of &#8358;{Naira(parseInt(process.env.REACT_APP_SUBSCRIPTIONFEE))} for your Subscription on {data.membershipchecker.dateofmembership}</p>
                            :
                                <div>
                                    <p align="center" className="nocf">Pay your &#8358;{Naira(parseInt(process.env.REACT_APP_SUBSCRIPTIONFEE))} Subscription Fee</p>
                                    <RaveProvider {...config}>
                                        <RavePaymentButton className="buttonstyle">Pay</RavePaymentButton>
                                    </RaveProvider>
                                </div>
                            )
                        }
                    </div>
                }
            </div>
            {PopBoxerStart ?
                <DialogInfo PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
            : ""}
            {nextClickGet === true ?
                <Loading/>
            : ""}
        </div>
    );
}

export default Subscription;