const accountData = (state = [], action) =>{
    switch(action.type){
        case 'ACCOUNTDATA':
            return state = action.payload;
        default:
            return state;
    }
}
export default accountData;