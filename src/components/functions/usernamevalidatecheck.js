const UsernameValidateCheck = (id) => {
    let user = document.getElementById(id);
    let accepted_characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let found = false;
    let usern = user.value.toLowerCase().replace(/\s+/g, "_");
    for(let i of usern){
        found = false;
        for(let j of accepted_characters){
            if(i === j){
                found = true
            }
        }
        if(found === false){
            user.value = "";
            return;
        }
    }
    user.value = usern;
}

export default UsernameValidateCheck;