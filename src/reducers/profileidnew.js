const profileIdNew = (state = null, action) =>{
    switch(action.type){
        case 'PROFILEIDNEW':
            return state = action.payload;
        default:
            return state;
    }
}

export default profileIdNew;