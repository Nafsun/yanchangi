const TextileImage = (state = ["id", false], action) => {
    switch(action.type){
        case 'TEXTILEIMAGE':
            return state = action.payload;
        default:
            return state;
    }
}

export default TextileImage;