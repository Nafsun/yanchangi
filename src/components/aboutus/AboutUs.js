import React from 'react';
import Cancel from '@material-ui/icons/Cancel';
import {Helmet} from "react-helmet";

function AboutUs(){
    
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
            <p className="loginjobs7">About Us</p>
            <Helmet>
                <title>About Us</title>
                <meta name="description" content="TexTailng is an online market place for textile sellers and tailors" />
            </Helmet>
            <div id="homeexpander2"> 
                <div className="menucontent">
                    <p>Yanchangi is an online record keeping system for forex traders.</p>
                    <p>Feel Free to Contact us for more - <a href="tel:07088172088">07088172088</a>, <a href="tel:08033165908">08033165908</a>, <a href="mailto:mustiashtechcompany@gmail.com">mustiashtechcompany@gmail.com</a></p>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;