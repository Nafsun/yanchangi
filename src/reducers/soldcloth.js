const SoldCloth = (state = [], action) =>{
    switch(action.type){
        case 'SOLDCLOTH':
            return state = action.payload;
        default:
            return state;
    }
}
export default SoldCloth;