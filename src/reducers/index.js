import loadingMenu from './loadingmenu';
import profileImageData from './profileimage';
import RegisterComplete from './registercomplete';
import SupplierChangi from './supplierchangi';
import CustomerChangi from './customerchangi';
import BankTransactions from './banktransactions';
import {combineReducers} from 'redux';

const mainReducer = combineReducers({
    loadmenu: loadingMenu, pimage: profileImageData, 
    rcomplete: RegisterComplete, SupplierChangi: SupplierChangi,
    CustomerChangi: CustomerChangi, BankTransactions: BankTransactions
});

export default mainReducer;