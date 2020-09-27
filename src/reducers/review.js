const reviewIdSaver = (state = null, action) =>{
    switch(action.type){
        case 'REVIEW':
            return state = action.payload;
        default:
            return state;
    }
}
export default reviewIdSaver;