function ValidateEmail(email) {
    var atposition = email.indexOf("@");  
    var dotposition = email.lastIndexOf(".");  
    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length){  
        return false;  
    }  
}

export default ValidateEmail;