const MyLikesUsername = (state = null, action) =>{
    switch(action.type){
        case 'MYLIKESUSERNAME':
            return state = action.payload;
        default:
            return state;
    }
}

export default MyLikesUsername;