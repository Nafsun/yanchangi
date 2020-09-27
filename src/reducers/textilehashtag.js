const TextileHT = (state = [], action) =>{
    switch(action.type){
        case 'TEXTILEHASHTAG':
            return state = action.payload;
        default:
            return state;
    }
}
export default TextileHT;