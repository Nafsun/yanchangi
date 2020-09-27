const TextileWallet = (state = ["innerid", "tailor", "busername", "tailorgender", false, "parentid"], action) => {
    switch(action.type){
        case 'TEXTILEWALLET':
            return state = action.payload;
        default:
            return state;
    }
}

export default TextileWallet;