const SupplierChangi = (state = [], action) =>{
    switch(action.type){
        case 'SUPPLIERCHANGI':
            return state = action.payload;
        default:
            return state;
    }
}
export default SupplierChangi;