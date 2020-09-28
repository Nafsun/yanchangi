export const loadingMenuChangeTrue = () => {
    return {
        type: 'CHANGETRUE'
    };
} 
export const loadingMenuChangeFalse = () => {
    return {
        type: 'CHANGEFALSE'
    };
}
export const profileImage = (pi) => {
    return {
        type: 'PROFILEIMAGE',
        payload: pi
    };
}
export const RegisterComplete = (s) => {
    return {
        type: 'REGISTERCOMPLETE',
        payload: s
    };
}

export const SupplierChangi = (s) => {
    return {
        type: 'SUPPLIERCHANGI',
        payload: s
    };
}

export const CustomerChangi = (s) => {
    return {
        type: 'CUSTOMERCHANGI',
        payload: s
    };
}