const TextileSize = (state = [], action) =>{
    switch(action.type){
        case 'TEXTILESIZE':
            return state = action.payload;
        default:
            return state;
    }
}
export default TextileSize;