const Gender = (state = null, action) =>{
    switch(action.type){
        case 'GENDER':
            return state = action.payload;
        default:
            return state;
    }
}
export default Gender;