const styleId = (state = null, action) =>{
    switch(action.type){
        case 'STYLEID':
            return state = action.payload;
        default:
            return state;
    }
}
export default styleId;