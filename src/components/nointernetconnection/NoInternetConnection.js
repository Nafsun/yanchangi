import React, {useState, useEffect} from 'react';

function NoInternetConnection(props){

    let userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [loadGet, loadSet] = useState(false);

    useEffect(() => {
        if(props.error === "Error: GraphQL error: jwt expired"){
            localStorage.removeItem("userinfo");
            document.getElementById("hidelogin").click();
        }else if(userinfo == null){
            document.getElementById("hidelogin").click();
        }else if(userinfo.loginAccount.error !== "no"){
            document.getElementById("hidelogin").click();
        }else{
            loadSet(true);
        }
    }, [props.error, userinfo]);

    return(
        <div>
            {loadGet === true ? 
                <div className="nointernet">
                    <p>Check your Internet Connection</p>
                </div>
            : ""}
        </div>
    );
}

export default NoInternetConnection;