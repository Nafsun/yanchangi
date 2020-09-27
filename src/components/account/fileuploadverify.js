const mimeTypeChecker = (file) => {

    const types = ['image/png', 'image/jpeg', 'image/jpg']; //, 'image/gif'

    if(types.every(type => file.type !== type)) {
         alert("you can only upload an image file");
         return false
    }

    return true;
}

const fileSizeChecker = (file) => {

    const size = 10485760; //not more than 10mb

    if (file.size > size) {
        alert("Image must be less than 10mb");
        return false
    }

    return true;
}

export {mimeTypeChecker, fileSizeChecker}