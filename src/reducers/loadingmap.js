const loadingMap = (state = false, action) => {
    switch(action.type){
        case 'CHANGEMAPTRUE':
            return state = true
        case 'CHANGEMAPFALSE':
            return state = false
        default:
            return state
    }
}

export default loadingMap;