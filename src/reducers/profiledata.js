const profileData = (state = [], action) =>{
    switch(action.type){
        case 'PROFILEDATA':
            return state = action.payload;
        default:
            return state;
    }
}
export default profileData;