const ClothWallet = (state = ["innerid", "susername", "busername", "sgender", false, "parentid"], action) => {
    switch(action.type){
        case 'CLOTHWALLET':
            return state = action.payload;
        default:
            return state;
    }
}

export default ClothWallet;