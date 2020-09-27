const TailorL = (state = [], action) =>{
    switch(action.type){
        case 'TAILORLIKERS':
            return state = action.payload;
        default:
            return state;
    }
}
export default TailorL;