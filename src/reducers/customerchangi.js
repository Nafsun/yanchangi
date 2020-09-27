const CustomerChangi = (state = [], action) =>{
    switch(action.type){
        case 'CUSTOMERCHANGI':
            return state = action.payload;
        default:
            return state;
    }
}
export default CustomerChangi;