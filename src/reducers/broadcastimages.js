const broadImage = (state = [], action) =>{
    switch(action.type){
        case 'BROADCASTIMAGES':
            return state = [...state, action.payload];
        default:
            return state;
    }
}
export default broadImage;