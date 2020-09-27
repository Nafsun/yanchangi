import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import {Helmet} from "react-helmet";

function PrivacyAndPolicy(){
    
    const sizeoflogocomment2 = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em",
        paddingTop:"8px"
    }
    
    const goback = () => {
        window.history.back();
    }

    return(
        <div className="downsmall3">
            <p 
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                <Cancel style={sizeoflogocomment2}/></span>
            </p>
            <p className="loginjobs7">Privacy and Policy</p>
            <Helmet>
                <title>Privacy and Policy</title>
                <meta name="description" content="Your data and information is secured and protected by Yanchangi" />
            </Helmet>
            <div id="homeexpander2">
                <div className="menucontent">
                    <p>After signing up on our platform, we store your informations on a secured server and database to make sure that your data is protected.</p>
                </div>
            </div>
            <br/><br/>
        </div>
    );
}

export default PrivacyAndPolicy;