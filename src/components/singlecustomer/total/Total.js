import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { CurrentLoading } from '../../loading/Loading';
import { useSelector } from 'react-redux';
import Naira from '../../functions/naira';

//All totals for a customer
const TOTALFORCUSTOMER = gql`
    query totalforcustomer($username: String, $customer: String, $customeraccountno: String, $jwtauth: String){
        totalforcustomer(username: $username, customer: $customer, customeraccountno: $customeraccountno, jwtauth: $jwtauth){
            totalbalance
        }
    }
`;

function Total() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [waitloadGet, waitloadSet] = useState(false);
    const CustomerChangi = useSelector(s => s.CustomerChangi);

    const { error, data } = useQuery(TOTALFORCUSTOMER,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, customer: CustomerChangi[0], customeraccountno: CustomerChangi[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if (data !== undefined) {
                    waitloadSet(true);
                }
            }
        });

    if (error) {
        return <p>Check your Internet Connection<br /><br /></p>;
    }

    return (
        <div>
            {waitloadGet === false ?
                <CurrentLoading />
                :
                <div>
                    <div className="workspace2">
                        <div className="jobcontainer2">
                            <p className="totaleverything">Total Balance: <span>{Naira(data.totalforcustomer.totalbalance)}</span></p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Total;