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
//Icheck if napislit na ang decimal point
let decimalStroke = false;
//Check if nalick na ang operator
let operatorStroke = false;
//Icheck if napislit na ang equal sign
let newSet = false;
let currentTotal = 0;
function calcStroke(btnValue){
    if(btnValue == 'CE'){
        outputScreen.textContent = '';
        currentTotal = 0;
        resetFunc();
    } else if(btnValue == 'C'){
        const text = outputScreen.innerText;
        outputScreen.innerText = text.slice(0,text.lastIndexOf(' ') + 1);
        resetFunc();
    } else if(decimal.includes(btnValue)){
        if(decimalStroke){
            return;
        } else {
            outputScreen.innerText += btnValue;
            decimalStroke = true;
        }
    } else if(backspace.includes(btnValue)){
        const text = outputScreen.innerText;
        outputScreen.innerText = text.slice(0,-1);
    } else if (btnValue == '='){
        equalSign();
    } else if (operatorButtons.includes(btnValue)) {
        console.log(`You clicked : ${btnValue}`);
        if(operatorStroke){
            console.log(`Double Stroke`);
            
            const answer = getAnswer(outputScreen.innerText);
            outputScreen.innerText = answer;
            outputScreen.textContent += ` ${btnValue} `;
            operatorStroke = true;
            return;
        }
        // if(newSet){
        //     console.log(`You clicked : ${btnValue}`);
        //     //Replace the screen text with the current button pressed
        //     outputScreen.textContent = ` ${btnValue} `;
        //     newSet = false;
        //     operatorStroke = true;
        //     return;
        // }
        // if(outputScreen.textContent.endsWith(' ') && currentTotal == 0){
        //     outputScreen.textContent = outputScreen.textContent.slice(0,-3);
        // }

        outputScreen.textContent += ` ${btnValue} `;
        //Reset decimal pointer after sa operator
        newSet = false;
        decimalStroke = false;
        operatorStroke = true;
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

function equalSign(){
    const answer = getAnswer(outputScreen.innerText);
    outputScreen.textContent = answer;
    //Equal sign is pressed!
    newSet = true;
    //Refresh the decimal existence checker
    decimalStroke = false;
    operatorStroke = false;
}

function resetFunc(){
    decimalStroke = false;
    operatorStroke = false;
}

function operate(operator,a,b){
    this.method = {
        '+': (a,b) => a + b,
        '-': (a,b) => a - b,
        '/': (a,b) => a / b,
        '*': (a,b) => a * b,
    }

    if(isNaN(b)){
        b = a;
    }
    return this.method[operator](a,b);
}

function getAnswer(string){
    const context = string.split(' ');
    
    let firstNum = 0;
    let operator = '';
    let secondNum = 0;

    if(operatorButtons.includes(context[0]) && currentTotal != 0){
        console.log(`Operator at 0!`);
        
        firstNum = +currentTotal;
        operator = context[0];
        secondNum = +context[1];
    } else if(operatorButtons.includes(context[0]) && currentTotal == 0) {
        console.log(`Test`);
        
        secondNum = +context[1];
        firstNum = secondNum;
        operator = context[0];
    } else {
        firstNum = +context[0];
        operator = context[1];
        secondNum = +context[2]; 
    }

    if(operator == '-' && firstNum - secondNum < 0){
        return 0;
    }

    if(operator == '/' && secondNum == 0){
        newSet = true;
        return 'Cannot divide by zero';
    }
    

    currentTotal = operate(operator,firstNum,secondNum);
    console.log(`Current Total check: ${currentTotal}`);
    return currentTotal;
}