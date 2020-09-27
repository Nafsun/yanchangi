const ShareData = (state = [], action) =>{
    switch(action.type){
        case 'SHARE':
            return state = action.payload;
        default:
            return state;
    }
}
export default ShareData;