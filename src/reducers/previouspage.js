const previousPage = (state = null, action) =>{
    switch(action.type){
        case 'PREVIOUSPAGE':
            return state = action.payload;
        default:
            return state;
    }
}

export default previousPage;