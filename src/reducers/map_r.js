const mapReducer = (state = [], action) =>{
    switch(action.type){
        case 'DIRECTION':
            return state = action.payload;
        default:
            return state;
    }
}
export default mapReducer;