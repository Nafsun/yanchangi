const BroadcastSize = (state = [], action) =>{
    switch(action.type){
        case 'BROADCASTSIZE':
            return state = action.payload;
        default:
            return state;
    }
}
export default BroadcastSize;