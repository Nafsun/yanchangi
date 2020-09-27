import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { NavigationArrowBack, NavigationArrowForward } from 'material-ui/svg-icons';
import { CustomerChangi } from '../../../actions';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';
import { Loading, JustLoading } from '../../loading/Loading';
import Grid from '@material-ui/core/Grid';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../functions/theme';
import TextField from '@material-ui/core/TextField';

const GETALLCUSTOMERS = gql` 
    query getallcustomers($username: String, $jwtauth: String, $searchcustomer: String, $searchcustomeraccountno: String, $start: Int, $end: Int){
        getallcustomers(username: $username, jwtauth: $jwtauth, searchcustomer: $searchcustomer, searchcustomeraccountno: $searchcustomeraccountno, start: $start, end: $end){
            id, customer, customeraccountno, error
        }
    }
`;

var startcountf = 0;
var endcountf = 50;
let searching = "";
let searching2 = "";

function InnerListofCustomers() {

    let userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const dispatch = useDispatch();
    const [nextClickGet, nextClickSet] = useState(false);
    const [nextClickGet2, nextClickSet2] = useState(false);
    const [waitloadGet, waitloadSet] = useState(false);

    const [searchGet, searchSet] = useState(searching);
    const [searchGet2, searchSet2] = useState(searching2);

    const { error, data, refetch } = useQuery(GETALLCUSTOMERS,
        {
            variables: {
                username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token,
                searchcustomer: searchGet,
                searchcustomeraccountno: searchGet2,
                start: userinfo === null ? "nothing" : startcountf,
                end: userinfo === null ? "nothing" : endcountf
            },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                    nextClickSet(false);
                    nextClickSet2(false);
                }
            }
        });

    if (error) {
        return <NoInternetConnection error={error.toString()} />;
    }

    const Next = () => {
        nextClickSet(true);
        startcountf = startcountf + 50;
        refetch({
            variables: {
                username: userinfo.loginAccount.username,
                jwtauth: userinfo.loginAccount.token,
                start: startcountf,
                end: endcountf
            }
        });
    }

    const Previous = () => {
        nextClickSet(true);
        startcountf = startcountf - 50;
        refetch({
            variables: {
                username: userinfo.loginAccount.username,
                jwtauth: userinfo.loginAccount.token,
                start: startcountf,
                end: endcountf
            }
        });
    }

    const CustomerCheck = (customer, customeraccountno) => {
        dispatch(CustomerChangi([customer, customeraccountno])); //add the username for the profile page
        document.getElementById("hidesinglecustomer").click();
    }

    const SearchCustomer = (event) => {
        nextClickSet2(true);
        startcountf = 0;
        endcountf = 50;
        refetch({ variables: { username: userinfo.loginAccount.username, searchcustomer: event.target.value, searchcustomeraccountno: searchGet2, start: startcountf, end: endcountf, jwtauth: userinfo.loginAccount.token } });
        searchSet(event.target.value);
        searching = event.target.value;
    }

    const SearchCustomerAccountNo = (event) => {
        nextClickSet2(true);
        startcountf = 0;
        endcountf = 50;
        refetch({ variables: { username: userinfo.loginAccount.username, searchcustomer: searchGet, searchcustomeraccountno: event.target.value, start: startcountf, end: endcountf, jwtauth: userinfo.loginAccount.token } });
        searchSet2(event.target.value);
        searching2 = event.target.value;
    }

    return (
        <div>
            {waitloadGet === false ?
                <Loading />
            :
            <div>
            <br />

            {nextClickGet === true ? <Loading /> : ""}

            {data.getallcustomers.length === 0 && startcountf > 0 ? <p className="nomoref">no more customers</p> : ""}
            {data.getallcustomers.length === 0 && startcountf === 0 && nextClickGet === false && searchGet !== "" ? <p className="nomoref">No customer with that name exist</p> : ""}
            {data.getallcustomers.length === 0 && startcountf === 0 && nextClickGet === false && searchGet2 !== "" ? <p className="nomoref">No customer with that account number exist</p> : ""}
            {data.getallcustomers.length === 0 && startcountf === 0 && nextClickGet === false && nextClickGet2 === false && searchGet === "" && searchGet2 === "" ? <p className="nomoref">no customer available yet</p> : ""}

            {(data.getallcustomers.length === 0 && startcountf > 0) || (data.getallcustomers.length === 0 && startcountf === 0 && nextClickGet === false) ? "" :
                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="fnotify2">
                            <p align="center" className="usernamefollowers">Name</p>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div className="fnotify2">
                            <p align="center" className="usernamefollowers">Account No</p>
                        </div>
                    </Grid>
                </Grid>
            }
            {data.getallcustomers.map((a) => (
                <Grid key={a.id} container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div onClick={() => CustomerCheck(a.customer, a.customeraccountno)} className="fnotify">
                            <p align="center" className="usernamefollowers2">{a.customer}</p>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <div onClick={() => CustomerCheck(a.customer, a.customeraccountno)} className="fnotify">
                            <p align="center" className="usernamefollowers2">{a.customeraccountno}</p>
                        </div>
                    </Grid>
                </Grid>
            ))}
            {startcountf === 0 ? "" : <p onClick={() => Previous()} className="leftNav"><NavigationArrowBack /></p>}
            {data.getallcustomers.length === 0 ? "" : <p onClick={() => Next()} className="rightNav"><NavigationArrowForward /></p>}
            <p style={{ clear: "both" }}></p>

            {nextClickGet2 === true ? <JustLoading /> : ""}

            <div className="compresssearch">
            {data.getallcustomers.length === 0 && startcountf > 0 ?
                ""
                :
                (data.getallcustomers.length === 0 && searchGet === "" ?
                    ""
                    :
                    <ThemeProvider theme={theme}>
                        <TextField
                            label="Search a Customer" fullWidth={true} defaultValue={searchGet}
                            margin="normal" onChange={(e) => SearchCustomer(e)} />
                    </ThemeProvider>
                )
            }

            {data.getallcustomers.length === 0 && startcountf > 0 ?
                ""
                :
                (data.getallcustomers.length === 0 && searchGet2 === "" ?
                    ""
                    :
                    <ThemeProvider theme={theme}>
                        <TextField
                            label="Search a Customer Account No" fullWidth={true} defaultValue={searchGet2}
                            margin="normal" onChange={(e) => SearchCustomerAccountNo(e)} />
                    </ThemeProvider>
                )
            }
            </div>
            </div>
            }
        </div>
    );
}

export default InnerListofCustomers;