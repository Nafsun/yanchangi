const BuyCloth = (state = [], action) =>{
    switch(action.type){
        case 'BUYCLOTH':
            return state = action.payload;
        default:
            return state;
    }
}
export default BuyCloth;