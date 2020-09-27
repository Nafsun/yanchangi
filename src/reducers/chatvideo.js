const ChatVideo = (state = ["id", false], action) => {
    switch(action.type){
        case 'CHATVIDEO':
            return state = action.payload;
        default:
            return state;
    }
}

export default ChatVideo;