const BroadcastHT = (state = [], action) =>{
    switch(action.type){
        case 'BROADCASTHASHTAG':
            return state = action.payload;
        default:
            return state;
    }
}
export default BroadcastHT;