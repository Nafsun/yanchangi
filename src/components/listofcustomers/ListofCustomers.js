import React, {useEffect} from 'react';
import {NavigationCancel} from 'material-ui/svg-icons';
import InnerListofCustomers from './innerlistofcustomers/InnerListofCustomers';

function ListofCustomers(){

    let userinfo = JSON.parse(localStorage.getItem("userinfo"));

    useEffect(() => {
        if(userinfo == null){
            document.getElementById("hidelogin").click();
        }
    }, [userinfo]);

    const sizeoflogofollowers2 = {
        color: "white", 
        width:"1.8em", 
        height:"1.8em",
        paddingTop:"8px"
    }

    const goback = () => {
        window.history.back();
    }

    return(
        <div className="downsmall3">
            <p 
                className="abovelinkcomment3"><span id="commentnav2" onClick={() => goback()}>
                <NavigationCancel style={sizeoflogofollowers2}></NavigationCancel></span>
            </p>
            <p className="loginjobs7">List of Customers</p>
            <div className="transactiontop">
                <div className="insidefollowersquery">
                    <InnerListofCustomers/>  
                <br/>
                </div>
            </div>
            <br/><br/><br/>
        </div>
    );
}

export default ListofCustomers;