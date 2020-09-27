import React, { useState, useEffect } from 'react';
import Menu from '../menu/Menu.js';
import Home from '@material-ui/icons/Home';
import Help from '@material-ui/icons/Help';
import Feedback from '@material-ui/icons/Feedback';
import Apps from '@material-ui/icons/Apps';
import Refresh from '@material-ui/icons/Refresh';
import { useSelector, useDispatch } from 'react-redux';
import { loadingMenuChangeTrue } from '../../actions';
import { Loading } from '../loading/Loading';
import AccountCircle from '@material-ui/icons/AccountCircle';

window.addEventListener("online", function () { //listen to when the user is back online and refresh the current page
    document.getElementById("resumeclick").click();
    //console.log("I am online")
});

function TopRoute() {

    //const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [AnimateGet, AnimateSet] = useState("");
    const [renewloadGet, renewloadSet] = useState(false);

    useEffect(() => {
        AnimateSet(window.location.pathname);
    }, []);

    const lm = useSelector(state => state.loadmenu);
    const dispatch = useDispatch();

    const sizeoflogos = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "2px"
    }

    const sizeoflogosanimate = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        animation: "welcomeanime2 5s ease-in-out 0s infinite"
    }

    const Reloader = () => {
        renewloadSet(true);
        window.location.reload();
    }

    const Homes = (e) => {
        AnimateSet(e);
        document.getElementById("homeishere").click();
    }

    const Helps = (e) => {
        AnimateSet(e);
        document.getElementById("clickhelp").click();
    }

    const Feedbacks = (e) => {
        AnimateSet(e);
        document.getElementById("clickfeedback").click();
    }

    const Account = (e) => {
        AnimateSet(e);
        document.getElementById("clickaccount").click();
    }

    return (
        <div>
            <div className="toplink">
                <p className="abovelink">
                    <span id="toprouteclick" onClick={() => dispatch(loadingMenuChangeTrue())}><Apps style={sizeoflogos} /></span>
                    <span className="titlechanger">Yanchangi</span>
                    <span className="bigscreen">
                        <span id="resumeclick" onClick={() => Reloader()} className="socialnotice"><Refresh style={sizeoflogos} /></span>
                        <span className="socialnotice" onClick={() => Homes("/")}><Home style={AnimateGet === "/" ? sizeoflogosanimate : sizeoflogos} /></span>
                        <span className="socialnotice" onClick={() => Helps("/help")}><Help style={AnimateGet === "/help" ? sizeoflogosanimate : sizeoflogos} /></span>
                        <span className="socialnotice" onClick={() => Feedbacks("/feedback")}><Feedback style={AnimateGet === "/feedback" ? sizeoflogosanimate : sizeoflogos} /></span>
                        <span className="socialnotice" onClick={() => Account("/account")}><AccountCircle style={AnimateGet === "/account" ? sizeoflogosanimate : sizeoflogos} /></span>
                    </span>
                    <span className="smallscreen">
                        <span id="resumeclick" onClick={() => Reloader()} className="socialnotice"><Refresh style={sizeoflogos} /></span>
                    </span>
                </p>
            </div>
            {renewloadGet === true ? <Loading /> : ""}
            {lm ? <Menu /> : ''}
        </div>
    );
}

export default TopRoute;