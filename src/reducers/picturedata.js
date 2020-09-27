const picture = (state = null, action) =>{
    switch(action.type){
        case 'PICTURE':
            return state = action.payload;
        default:
            return state;
    }
}

export default picture;