const profileId = (state = null, action) =>{
    switch(action.type){
        case 'PROFILEID':
            return state = action.payload;
        default:
            return state;
    }
}

export default profileId;