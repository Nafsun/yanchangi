import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { BankTransactions } from '../../../actions';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';
import { Loading } from '../../loading/Loading';
import Grid from '@material-ui/core/Grid';
import Naira from '../../functions/naira';

//All banks
const ALLBANKS = gql`
    query allbanksget($username: String, $jwtauth: String){
        allbanksget(username: $username, jwtauth: $jwtauth){
            id, username, bankname, bankaccountnumber, bankaccountname, bankamount, bankbalance, date
        }
    }
`;

function InnerListofBanks() {

    let userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const dispatch = useDispatch();
    const [waitloadGet, waitloadSet] = useState(false);

    const { error, data } = useQuery(ALLBANKS,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                }
            }
        });

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const GotoBankRecord = (bankname, bankaccountnumber, bankaccountname) => {
        dispatch(BankTransactions([bankname, bankaccountnumber, bankaccountname]));
        document.getElementById("hidebankrecord").click();
    }

    return (
        <div>
            {waitloadGet === false ?
                <Loading />
            :
            <div>
            <br />

            {data.allbanksget.length === 0 ? <p className="nomoref">no banks available yet</p> : ""}

            {data.allbanksget.length === 0 ? "" :
                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div className="fnotify2">
                            <p align="center" className="usernamefollowers">Name</p>
                        </div>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div className="fnotify2">
                            <p align="center" className="usernamefollowers">Account No</p>
                        </div>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div className="fnotify2">
                            <p align="center" className="usernamefollowers">Balance</p>
                        </div>
                    </Grid>
                </Grid>
            }
            {data.allbanksget.map((a) => (
                <Grid key={a.id} container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div onClick={() => GotoBankRecord(a.bankname, a.bankaccountnumber, a.bankaccountname)} className="fnotify">
                            <p align="center" className="usernamefollowers2">{a.bankname}</p>
                        </div>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div onClick={() => GotoBankRecord(a.bankname, a.bankaccountnumber, a.bankaccountname)} className="fnotify">
                            <p align="center" className="usernamefollowers2">{a.bankaccountnumber}</p>
                        </div>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div onClick={() => GotoBankRecord(a.bankname, a.bankaccountnumber, a.bankaccountname)} className="fnotify">
                            <p align="center" className="usernamefollowers2">{Naira(a.bankamount)}</p>
                        </div>
                    </Grid>
                </Grid>
            ))}
            </div>
            }
        </div>
    );
}

export default InnerListofBanks;