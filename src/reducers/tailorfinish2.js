const TailorFinish2 = (state = [], action) =>{
    switch(action.type){
        case 'TAILORFINISH2':
            return state = action.payload;
        default:
            return state;
    }
}
export default TailorFinish2;