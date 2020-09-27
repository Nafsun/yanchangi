const BroadcastL = (state = [], action) =>{
    switch(action.type){
        case 'BROADCASTLIKERS':
            return state = action.payload;
        default:
            return state;
    }
}
export default BroadcastL;