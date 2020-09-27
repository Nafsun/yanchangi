const BoughtIt = (state = [], action) =>{
    switch(action.type){
        case 'BOUGHTIT':
            return state = action.payload;
        default:
            return state;
    }
}
export default BoughtIt;