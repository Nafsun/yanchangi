const MapGetInsight = (state = ["username", false, false, false, false], action) => {
    switch(action.type){
        case 'MAPGETINSIGHT':
            return state = action.payload;
        default:
            return state;
    }
}

export default MapGetInsight;