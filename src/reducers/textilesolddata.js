const textileSold = (state = [], action) =>{
    switch(action.type){
        case 'SOLDER':
            return state = action.payload;
        default:
            return state;
    }
}
export default textileSold;