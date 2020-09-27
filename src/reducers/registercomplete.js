const RegisterComplete = (state = "no", action) =>{
    switch(action.type){
        case 'REGISTERCOMPLETE':
            return state = action.payload;
        default:
            return state;
    }
}

export default RegisterComplete;