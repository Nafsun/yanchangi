const postId = (state = null, action) =>{
    switch(action.type){
        case 'POSTID':
            return state = action.payload;
        default:
            return state;
    }
}

export default postId;