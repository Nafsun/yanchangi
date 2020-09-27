const IHaveitSellers = (state = [], action) =>{
    switch(action.type){
        case 'IHAVEITSELLERS':
            return state = action.payload;
        default:
            return state;
    }
}
export default IHaveitSellers;