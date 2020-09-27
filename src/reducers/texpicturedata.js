const texpicture = (state = null, action) =>{
    switch(action.type){
        case 'TEXPICTURE':
            return state = action.payload;
        default:
            return state;
    }
}

export default texpicture;