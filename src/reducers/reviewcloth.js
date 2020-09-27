const reviewIdSaverCloth = (state = null, action) =>{
    switch(action.type){
        case 'REVIEWCLOTH':
            return state = action.payload;
        default:
            return state;
    }
}
export default reviewIdSaverCloth;