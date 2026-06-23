const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','C','=','+'];
const buttonDiv = document.getElementById('button_div');
const outputScreen = document.getElementById('output');

const operatorButtons = ['/','*','+','-',];
buttons.forEach((btn) => {
    const btnElement = document.createElement('button');
    
    btnElement.innerText = btn;
    btnElement.classList.add('calc_button');
    btnElement.setAttribute('data-value',btn);

    buttonDiv.appendChild(btnElement);
});

let newSet = false;
buttonDiv.addEventListener('click',(event) => {
    const btnValue = event.target.getAttribute('data-value');
    
    if(!btnValue){
        return;
    }

    if(btnValue == 'C'){
        outputScreen.textContent = '';
    } else if (btnValue == '='){
        const answer = getAnswer(outputScreen.innerText);
        outputScreen.textContent = answer;
        newSet = true;
    } else if (operatorButtons.includes(btnValue)) {
        console.log(`You clicked : ${btnValue}`);
        outputScreen.textContent += ` ${btnValue} `;
    } else {
        if(newSet){
            console.log(`You clicked : ${btnValue}`);
            outputScreen.textContent = btnValue;
            newSet = false;
        } else {
            console.log(`You clicked : ${btnValue}`);
            outputScreen.textContent += btnValue;
        }
    };
    
});

function operate(operator,a,b){
    this.method = {
        '+': (a,b) => a + b,
        '-': (a,b) => a - b,
        '/': (a,b) => a / b,
        '*': (a,b) => a * b,
    }

    //If user didn't put a value for the first num
    if(isNaN(a)){
        console.log(`Substitution done!`);
        a = 0;
    }
    //If user didn't put a value for the second num
    //We let the second num copy the first num value
    if(isNaN(b)){
        console.log(`Substitution done!`);
        b = a;
    }

    return this.method[operator](a,b);
}

function getAnswer(string){
    const context = string.split(' ');
    
    a = parseInt(context[0]);
    operator = context[1];
    b = parseInt(context[2]);

    //If the user only clicks an operand without values
    //We let the operator's value be the string itself
    if(operator == undefined){
        operator = string;
    }

    return operate(operator,a,b);
}