const ChatAudio = (state = ["id", false], action) => {
    switch(action.type){
        case 'CHATAUDIO':
            return state = action.payload;
        default:
            return state;
    }
}

export default ChatAudio;