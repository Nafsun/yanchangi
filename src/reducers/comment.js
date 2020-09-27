const commentIdSaver = (state = null, action) =>{
    switch(action.type){
        case 'COMMENT':
            return state = action.payload;
        default:
            return state;
    }
}
export default commentIdSaver;