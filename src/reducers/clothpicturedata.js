const clothpicture = (state = null, action) =>{
    switch(action.type){
        case 'CLOTHPICTURE':
            return state = action.payload;
        default:
            return state;
    }
}

export default clothpicture;