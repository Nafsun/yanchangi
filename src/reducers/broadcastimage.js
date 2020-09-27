const BroadcastImage = (state = ["id", false], action) => {
    switch(action.type){
        case 'BROADCASTIMAGE':
            return state = action.payload;
        default:
            return state;
    }
}

export default BroadcastImage;