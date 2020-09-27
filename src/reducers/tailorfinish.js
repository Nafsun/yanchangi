const TailorFinish = (state = [], action) =>{
    switch(action.type){
        case 'TAILORFINISH':
            return state = action.payload;
        default:
            return state;
    }
}
export default TailorFinish;