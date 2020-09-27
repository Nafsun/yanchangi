const ClothImage = (state = ["id", false], action) => {
    switch(action.type){
        case 'CLOTHIMAGE':
            return state = action.payload;
        default:
            return state;
    }
}

export default ClothImage;