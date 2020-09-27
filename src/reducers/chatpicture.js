const ChatPicture = (state = ["id", false], action) => {
    switch(action.type){
        case 'CHATPICTURE':
            return state = action.payload;
        default:
            return state;
    }
}

export default ChatPicture;