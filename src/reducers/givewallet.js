const GiveWallet = (state = ["id", "username", "tailorusername", "tailorgender", false], action) => {
    switch(action.type){
        case 'GIVEWALLET':
            return state = action.payload;
        default:
            return state;
    }
}

export default GiveWallet;