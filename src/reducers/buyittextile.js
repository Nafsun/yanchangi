const BuyItTextile = (state = [], action) =>{
    switch(action.type){
        case 'BUYITTEXTILE':
            return state = action.payload;
        default:
            return state;
    }
}
export default BuyItTextile;