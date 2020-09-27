const TextileL = (state = [], action) =>{
    switch(action.type){
        case 'TEXTILELIKERS':
            return state = action.payload;
        default:
            return state;
    }
}
export default TextileL;