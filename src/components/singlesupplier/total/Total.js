import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import { CurrentLoading } from '../../loading/Loading';
import { useSelector } from 'react-redux';
import Naira from '../../functions/naira';

//All totals for a supplier 
const TOTALFORSUPPLIER = gql` 
    query totalforsupplier($username: String, $supplier: String, $supplieraccountno: String, $jwtauth: String){
        totalforsupplier(username: $username, supplier: $supplier, supplieraccountno: $supplieraccountno, jwtauth: $jwtauth){
            totalbalance
        }
    }
`;

function Total() {

    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const [waitloadGet, waitloadSet] = useState(false);
    const SupplierChangi = useSelector(s => s.SupplierChangi);

    const { error, data } = useQuery(TOTALFORSUPPLIER,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username, supplier: SupplierChangi[0], supplieraccountno: SupplierChangi[1], jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
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
                            <p className="totaleverything">Total Balance: <span>{Naira(data.totalforsupplier.totalbalance)}</span></p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Total;