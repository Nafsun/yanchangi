const postIdNew = (state = null, action) =>{
    switch(action.type){
        case 'POSTIDNEW':
            return state = action.payload;
        default:
            return state;
    }
}

export default postIdNew;