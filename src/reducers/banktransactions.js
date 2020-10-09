const BankTransactions = (state = [], action) =>{
    switch(action.type){
        case 'BANKTRANSACTIONS':
            return state = action.payload;
        default:
            return state;
    }
}
export default BankTransactions;