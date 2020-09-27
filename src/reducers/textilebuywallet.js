const TextileBuyWallet = (state = ["innerid", "susername", "busername", "sgender", false, "parentid"], action) => {
    switch(action.type){
        case 'TEXTILEBUYWALLET':
            return state = action.payload;
        default:
            return state;
    }
}

export default TextileBuyWallet;