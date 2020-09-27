const ChatFile = (state = ["id", false], action) => {
    switch(action.type){
        case 'CHATFILE':
            return state = action.payload;
        default:
            return state;
    }
}

export default ChatFile;