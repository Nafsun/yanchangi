const loadingMenu = (state = false, action) => {
    switch(action.type){
        case 'CHANGETRUE':
            return state = true
        case 'CHANGEFALSE':
            return state = false
        default:
            return state
    }
}

export default loadingMenu;