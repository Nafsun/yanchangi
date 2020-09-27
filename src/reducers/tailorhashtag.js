const TailorHT = (state = [], action) =>{
    switch(action.type){
        case 'TAILORHASHTAG':
            return state = action.payload;
        default:
            return state;
    }
}
export default TailorHT;