import React from 'react';
import {Helmet} from "react-helmet";

function Home() {

    //const userinfo = JSON.parse(localStorage.getItem("userinfo"));

    const GetStarted = () => {
        document.getElementById("hidesignup").click();
    }

    return (
        <div className="downsmall">
            <div className="bigimage">
                <br /><br /><br />
                <p className="belowwelcome">Record keeping is <span style={{color:"red"}}>very</span> important</p>
                <p className="getstarted" onClick={() => GetStarted()}>Get Started</p>
                {//<p className="belowwelcome2"><a style={{color:"white"}} href="https://files.textailng.com/TexTailng.apk">Download our <span style={{color:"red"}}>Android</span> App</a></p>
                }
            </div>
            <Helmet>
                <title>Yanchangi</title>
                <meta name="description" content="yanchangi is an online record keeping system for forex traders" />
            </Helmet>
        </div>
    );
}

export default Home;