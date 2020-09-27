const previousPageNew = (state = null, action) =>{
    switch(action.type){
        case 'PREVIOUSPAGENEW':
            return state = action.payload;
        default:
            return state;
    }
}

export default previousPageNew;