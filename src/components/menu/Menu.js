import React from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { useDispatch } from 'react-redux';
import { loadingMenuChangeFalse } from '../../actions';
import Grid from '@material-ui/core/Grid';
import Facebook from '@material-ui/icons/Facebook';
import Instagram from '@material-ui/icons/Instagram';
import Twitter from '@material-ui/icons/Twitter';
import WhatsApp from '@material-ui/icons/WhatsApp';

function Menu() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const dispatch = useDispatch();

    const sizeoflogo2 = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    const sizeoflogo = {
        color: "rgb(107, 43, 8)",
        width: "1.3em",
        height: "1.3em"
    }

    const output = (idname) => {
        document.getElementById(idname).click();
        dispatch(loadingMenuChangeFalse());
    }

    const changeInStyleMenu = (idname, color) => {
        document.getElementById(idname).style.color = color;
    }

    const changeOutStyleMenu = (idname, color) => {
        document.getElementById(idname).style.color = color;
    }

    return (
        <div>
            <p className="abovelinkmenu">
                <span onClick={() => dispatch(loadingMenuChangeFalse())} id="navarrback"><ArrowBack style={sizeoflogo2} /></span>
            </p>
            <div id="scrolldown2" className="menufloat">
                <div className="menudesign">
                    <br />
                    {userinfo === null ? "" :
                        <div>
                            <p
                                onMouseOut={() => changeOutStyleMenu("listofcustomers", "rgb(107, 43, 8)")}
                                onMouseOver={() => changeInStyleMenu("listofcustomers", "black")}
                                id="listofcustomers"
                                onClick={() => output("hidelistofcustomers")}>
                                List of Customers
                            </p>
                            <p
                                onMouseOut={() => changeOutStyleMenu("listofsuppliers", "rgb(107, 43, 8)")}
                                onMouseOver={() => changeInStyleMenu("listofsuppliers", "black")}
                                id="listofsuppliers"
                                onClick={() => output("hidelistofsuppliers")}>
                                List of Suppliers
                            </p>
                        </div>
                    }
                    <p
                        onMouseOut={() => changeOutStyleMenu("loginchanger", "rgb(107, 43, 8)")}
                        onMouseOver={() => changeInStyleMenu("loginchanger", "black")}
                        id="loginchanger"
                        onClick={() => output("hidelogin")}>
                        Login
                </p>
                    <p
                        onMouseOut={() => changeOutStyleMenu("signupchanger", "rgb(107, 43, 8)")}
                        onMouseOver={() => changeInStyleMenu("signupchanger", "black")}
                        id="signupchanger"
                        onClick={() => output("hidesignup")}>
                        Sign Up
                </p>
                    <p
                        onMouseOut={() => changeOutStyleMenu("aboutuschanger", "rgb(107, 43, 8)")}
                        onMouseOver={() => changeInStyleMenu("aboutuschanger", "black")}
                        id="aboutuschanger"
                        onClick={() => output("hideaboutus")}>
                        About us
                </p>
                    <p
                        onMouseOut={() => changeOutStyleMenu("privacychanger", "rgb(107, 43, 8)")}
                        onMouseOver={() => changeInStyleMenu("privacychanger", "black")}
                        id="privacychanger"
                        onClick={() => output("hideprivacyandpolicy")}>
                        Privacy and Policy
                </p>
                    <p
                        onMouseOut={() => changeOutStyleMenu("accountchanger", "rgb(107, 43, 8)")}
                        onMouseOver={() => changeInStyleMenu("accountchanger", "black")}
                        id="accountchanger"
                        onClick={() => output("hideaccount")}>
                        Account
                </p>
                    <br />
                </div>
                <div className="menudesign2">
                    <br />
                    <p>Copyright@2019</p>
                    <p>All right reserve</p>
                    <p>
                        <a className="contactlink" href="mailto:mustiashtechcompany@gmail.com">Contact Us</a>
                    </p>
                    <br />
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <p align="center"><a href='https://www.facebook.com/mustiashtechcompany' target='__blank'>
                                <Facebook style={sizeoflogo} />
                            </a></p>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <p align="center"><a href='https://www.twitter.com/mtechcompany' target='__blank'>
                                <Twitter style={sizeoflogo} />
                            </a></p>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <p align="center"><a href='https://chat.whatsapp.com/' target='__blank'>
                                <WhatsApp style={sizeoflogo} />
                            </a></p>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <p align="center"><a href='https://www.instagram.com/mustiashtechcompany' target='__blank'>
                                <Instagram style={sizeoflogo} />
                            </a></p>
                        </Grid>
                    </Grid>
                </div>
                <br /><br /><br />
            </div>
        </div>
    );
}

export default Menu;