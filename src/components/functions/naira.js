const Naira = (vals) => {
    let val = Math.round(vals).toString();
    let v_length = val.length;
    let new_val = [];
    let counter = 0;
    if(v_length === 4){
        for(let v of val){
            if(counter === 1 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 5){
        for(let v of val){
            if(counter === 2 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 6){
        for(let v of val){
            if(counter === 3 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 7){
        for(let v of val){
            if(counter === 1 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            if(counter === 4 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 8){
        for(let v of val){
            if(counter === 2 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            if(counter === 5 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 9){
        for(let v of val){
            if(counter === 3 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            if(counter === 6 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else if(v_length === 10){
        for(let v of val){
            if(counter === 1 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            if(counter === 4 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            if(counter === 7 && val[counter -1] !== '-'){
                new_val.push(",");
            }
            new_val.push(v);
            counter += 1;
        }
    }else{
        return val;
    }

    return new_val.join("");
}

export default Naira;