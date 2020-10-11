import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import Homes from '../home/Home';
import Login from '../login/Login';
import SignUp from '../signup/SignUp';
import AboutUs from '../aboutus/AboutUs';
import Account from '../account/Account';
import PrivacyAndPolicy from '../privacyandpolicy/PrivacyAndPolicy';
import FeedBacks from '../feedback/FeedBack';
import Home from '@material-ui/icons/Home';
import Feedback from '@material-ui/icons/Feedback';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Help from '@material-ui/icons/Help';
import Helps from '../help/Help';
import ForgotPassword from '../forgotpassword/ForgotPassword';
import VerifyEmail from '../verifyemail/VerifyEmail';
import ListofCustomers from '../listofcustomers/ListofCustomers';
import ListofSuppliers from '../listofsuppliers/ListofSuppliers';
import ListofBanks from '../listofbanks/ListofBanks';
import SingleCustomer from '../singlecustomer/SingleCustomer';
import SingleSupplier from '../singlesupplier/SingleSupplier';
import BankRecord from '../bankrecord/BankRecord';

function BottomRoute() {

    const sizeoflogos = {
        color: "white", 
        width:"1.2em", 
        height:"1.2em"
    }

    const sizeoflogos2 = {
        color: "white",
        width:"1.2em", 
        height:"1.2em",
        animation: "welcomeanime2 5s ease-in-out 0s infinite"
    }

    let [locGet, locSet] = useState(null);
    let loc = window.location.pathname;

    useEffect(() => {
        locSet(loc);
    }, [loc]);

    const Location = (l) => {
        locSet(l);
    }

    return (
        <div>
        <Router>
            <div className="buttomlink">
                <div>

                    <NavLink 
                    className="belowlink"
                    id="homeishere"
                    exact strict to="/" onClick={() => Location("/")}>
                        <Home style={locGet === "/" ? sizeoflogos2 : sizeoflogos}/>
                    </NavLink>

                    <NavLink 
                    className="belowlink"
                    id="clickaccount"
                    exact strict to="/account" onClick={() => Location("/account")}>
                        <AccountCircle style={locGet === "/account" ? sizeoflogos2 : sizeoflogos}/>
                    </NavLink>

                    <NavLink 
                    className="belowlink"
                    id="clickhelp"
                    exact strict to="/help" onClick={() => Location("/help")}>
                        <Help style={locGet === "/help" ? sizeoflogos2 : sizeoflogos}/>
                    </NavLink>

                    <NavLink 
                    className="belowlink"
                    id="clickfeedback"
                    exact strict to="/feedback" onClick={() => Location("/feedback")}>
                        <Feedback style={locGet === "/feedback" ? sizeoflogos2 : sizeoflogos}/>
                    </NavLink>

                </div>
                    <NavLink
                    id="hidelogin"
                    exact strict onClick={() => Location("/nothing")} to="/login">
                        Login
                    </NavLink>

                    <NavLink
                    id="hidesignup"
                    exact strict onClick={() => Location("/nothing")} to="/signup">
                        Sign Up
                    </NavLink>

                    <NavLink
                    id="hideaboutus"
                    exact strict onClick={() => Location("/nothing")} to="/about-us">
                        About Us
                    </NavLink>

                    <NavLink
                    id="hideprivacyandpolicy"
                    exact strict onClick={() => Location("/nothing")} to="/privacy-and-policy">
                        Privacy and Policy
                    </NavLink>

                    <NavLink
                    id="hideaccount"
                    exact strict onClick={() => Location("/nothing")} to="/account">
                        Account
                    </NavLink>

                    <NavLink
                    id="hideforgotpassword"
                    exact strict onClick={() => Location("/nothing")} to="/forgotpassword">
                        Forgot Password
                    </NavLink>

                    <NavLink
                    id="hidesubscription"
                    exact strict onClick={() => Location("/nothing")} to="/subscription">
                        Subscription
                    </NavLink>

                    <NavLink
                    id="hideverifyemail"
                    exact strict onClick={() => Location("/nothing")} to="/verifyemail">
                        Verify Email
                    </NavLink>

                    <NavLink
                    id="hidelistofcustomers"
                    exact strict onClick={() => Location("/nothing")} to="/listofcustomers">
                        List of Customers
                    </NavLink>

                    <NavLink
                    id="hidelistofsuppliers"
                    exact strict onClick={() => Location("/nothing")} to="/listofsuppliers">
                        List of Suppliers
                    </NavLink>

                    <NavLink
                    id="hidesinglecustomer"
                    exact strict onClick={() => Location("/nothing")} to="/customer">
                        Single Customer
                    </NavLink>

                    <NavLink
                    id="hidesinglesupplier"
                    exact strict onClick={() => Location("/nothing")} to="/supplier">
                        Single Supplier
                    </NavLink>

                    <NavLink
                    id="hidebankrecord"
                    exact strict onClick={() => Location("/nothing")} to="/bankrecord">
                        Bank Record
                    </NavLink>

                    <NavLink
                    id="hidelistofbanks"
                    exact strict onClick={() => Location("/nothing")} to="/banklist">
                        Bank List
                    </NavLink>
            </div>
            <Route path="/" exact component={Homes} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <Route path="/about-us" exact component={AboutUs} />
            <Route path="/privacy-and-policy" exact component={PrivacyAndPolicy} />
            <Route path="/account" exact component={Account} />
            <Route path="/feedback" exact component={FeedBacks} />
            <Route path="/help" exact component={Helps} />
            <Route path="/forgotpassword" exact component={ForgotPassword} />
            <Route path="/verifyemail" exact component={VerifyEmail} />
            <Route path="/listofcustomers" exact component={ListofCustomers} />
            <Route path="/listofsuppliers" exact component={ListofSuppliers} />
            <Route path="/customer" exact component={SingleCustomer} />
            <Route path="/supplier" exact component={SingleSupplier} />
            <Route path="/bankrecord" exact component={BankRecord} />
            <Route path="/banklist" exact component={ListofBanks} />
        </Router>
    </div>
    );
}

export default BottomRoute;