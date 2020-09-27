const loadingComment = (state = false, action) => {
    switch(action.type){
        case 'CHANGECOMMENTTRUE':
            return state = true
        case 'CHANGECOMMENTFALSE':
            return state = false
        default:
            return state
    }
}

export default loadingComment;