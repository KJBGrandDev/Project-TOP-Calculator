const buttons = ['CE','C','X','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','=',];
const buttonDiv = document.getElementById('button_div');
const outputScreen = document.getElementById('output');

const operatorButtons = ['CE','C','/','*','+','-'];
const decimal = ['.'];
const backspace = ['X'];
buttons.forEach((btn) => {
    const btnElement = document.createElement('button');
    
    btnElement.innerText = btn;
    btnElement.classList.add('calc_button');
    btnElement.setAttribute('data-value',btn);

    buttonDiv.appendChild(btnElement);
});
//Checks if the current num already has a decimal in it.
const decimalStroke = false;
const operatorStroke = false;
//Checks if we need to clear the screen after clicking '=' (Equal Sign)
let newSet = false;
let currentTotal = 0;
function calcStroke(btnValue){
    if(btnValue == 'CE'){
        outputScreen.textContent = '';
    } else if(btnValue == 'C'){

        const text = outputScreen.innerText;
        outputScreen.innerText = text.slice(0,text.lastIndexOf(' ') + 1);
    } else if(decimal.includes(btnValue)){
        const text = outputScreen.innerText;
        if(decimalStroke){
            return;
        } else {
            outputScreen.innerText += btnValue;
        }
    } else if(backspace.includes(btnValue)){
        const text = outputScreen.innerText;
        outputScreen.innerText = text.slice(0,-1);
    } else if (btnValue == '='){
        const answer = getAnswer(outputScreen.innerText);
        outputScreen.textContent = answer;
        currentTotal = Number(outputScreen.innerText);
        //Equal sign is pressed!
        newSet = true;
        //Refresh the decimal existence checker
        decimalStroke = false;
    } else if (operatorButtons.includes(btnValue)) {
        console.log(`You clicked : ${btnValue}`);
        if(newSet){
            console.log(`You clicked : ${btnValue}`);
            //Replace the screen text with the current button pressed
            outputScreen.textContent = ` ${btnValue} `;
            newSet = false;
            return;
        }
        if(outputScreen.textContent.endsWith(' ') && currentTotal == 0){
            outputScreen.textContent = outputScreen.textContent.slice(0,-3);
        }

        outputScreen.textContent += ` ${btnValue} `;
        //Refresh the decimal existence checker after every operator
        //Else only one num can have a decimal point
        decimalStroke = false;
    } else {
        //'=' Equal Sign is clicked?
        if(newSet){
            console.log(`You clicked : ${btnValue}`);
            //Replace the screen text with the current button pressed
            outputScreen.textContent = btnValue;
            newSet = false;
        } else {
            //Add to the screen text the current button pressed
            console.log(`You clicked : ${btnValue}`);
            outputScreen.textContent += btnValue;
        }
    };
}


buttonDiv.addEventListener('click',(event) => {
    const btnValue = event.target.getAttribute('data-value');
    
    if(!btnValue){
        return;
    }

    calcStroke(btnValue);
});

document.addEventListener('keydown', (event) => {
    if(operatorButtons.includes(event.key)){
        let operator = event.key;
        calcStroke(operator);
    } else if(buttons.includes(event.key)){
        let nums = event.key;
        calcStroke(nums);
    };
});

function operate(operator,a,b){
    this.method = {
        '+': (a,b) => a + b,
        '-': (a,b) => a - b,
        '/': (a,b) => a / b,
        '*': (a,b) => a * b,
    }
    console.log(`\nOperation Side!!`);
    
    console.log(`A: ${a}`);
    console.log(`B: ${b}`);
    console.log(`Answer: ${a + b}`);
    
    
    //If user didn't put a value for the first num
    if(isNaN(a) && currentTotal == 0){
        console.log(`Substitution done!`);
        a = 0;
    } 
    if(isNaN(a) && currentTotal != 0){
        console.log(`Current Total Used!`);
        a = currentTotal;
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
    let total = 0;
    let operator;
    if(operatorButtons.includes(context[0]) && currentTotal != 0){
        console.log(`Context 42: ${context[0]}`);
        
        total = currentTotal;
    } else {
        console.log(context);
        
        console.log(`Context 21: ${context[0]}`);
        total = Number(context[0]);
    }
    
    
    for(let i = 1; i < context.length; i+=2){
        const operator = context[i];
        const num = Number(context[i + 1]);
        console.log(`First Num / Total: ${total}`);
        console.log(`Operator: ${operator}`);
        
        console.log(`Second num: ${num}`);
        
        total = operate(operator,total,num);
        console.log(`Current Total: ${total}`);
    }
    console.log(total);
    return total;
}