const HaveItBroadcast = (state = [], action) =>{
    switch(action.type){
        case 'HAVEITBROADCAST':
            return state = action.payload;
        default:
            return state;
    }
}
export default HaveItBroadcast;