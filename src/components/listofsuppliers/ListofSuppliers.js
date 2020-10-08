import React, {useEffect} from 'react';
import {NavigationCancel} from 'material-ui/svg-icons';
import InnerListofSuppliers from './innerlistofsuppliers/InnerListofSuppliers';
import { JustLoading } from '../loading/Loading';
import NoInternetConnection from '../nointernetconnection/NoInternetConnection';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

const ACCESSVERIFY = gql`
    query accessverify($username: String, $jwtauth: String){
        accessverify(username: $username, jwtauth: $jwtauth){
            username, createdby, listofcustomers, listofsuppliers
        }
    }
`;

function ListofSuppliers(){

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

    const accessv = useQuery(ACCESSVERIFY,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token
            },
            fetchPolicy: 'no-cache'
        });

    if (accessv.loading) {
        return <JustLoading />;
    }

    if (accessv.error) {
        return <div className="internetclass"><NoInternetConnection error={accessv.error.toString()} /></div>;
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
            <p className="loginjobs7">List of Suppliers</p>
            <div className="transactiontop">
                <div className="insidefollowersquery">
                    {accessv.data.accessverify.listofsuppliers === "yes" ?
                        <InnerListofSuppliers/>  
                    : 
                        <p className="donthaveaccess"><br/>You don't have access to this section</p>
                    }
                <br/>
                </div>
            </div>
            <br/><br/><br/>
        </div>
    );
}

export default ListofSuppliers;