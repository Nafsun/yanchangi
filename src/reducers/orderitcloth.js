const OrderItCloth = (state = [], action) =>{
    switch(action.type){
        case 'ORDERITCLOTH':
            return state = action.payload;
        default:
            return state;
    }
}
export default OrderItCloth;