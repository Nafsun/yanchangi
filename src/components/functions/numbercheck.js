const NumberCheck = (id) => {
    let num = document.getElementById(id);
    let accepted_numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    let found = false;
    let countdot = 0;
    let countminus = 0;
    let num2 = num.value.replace(/\s+/g, "");

    for(let i of num2){
        if(i === '.'){
            countdot += 1;
        }
    }

    if(countdot > 1){
        num.value = "";
        return;
    }

    for(let i of num2){
        if(i === '-'){
            countminus += 1;
            if(num2[0] !== "-"){
                num.value = "";
                return;
            }
        }
    }

    if(countminus > 1){
        num.value = "";
        return;
    }

    for(let i of num2){
        found = false;
        for(let j of accepted_numbers){
            if(i === j){
                found = true;
            }
        }
        if(found === false){
            num.value = "";
            return;
        }
    }

    num.value = num2;
}

export default NumberCheck;