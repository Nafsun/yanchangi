const ClothSize = (state = [], action) =>{
    switch(action.type){
        case 'CLOTHSIZE':
            return state = action.payload;
        default:
            return state;
    }
}

export default ClothSize;