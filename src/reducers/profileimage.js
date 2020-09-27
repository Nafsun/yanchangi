const profileImageData = (state = null, action) =>{
    switch(action.type){
        case 'PROFILEIMAGE':
            return state = action.payload;
        default:
            return state;
    }
}
export default profileImageData;