const Follow = (state = [], action) =>{
    switch(action.type){
        case 'FOLLOW':
            return state = action.payload;
        default:
            return state;
    }
}

export default Follow;