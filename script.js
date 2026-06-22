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

buttonDiv.addEventListener('click', (event) => {
    const btnValue = event.target.getAttribute('data-value');
    
    if(!btnValue){
        return;
    }

    if(btnValue == 'C'){
        outputScreen.textContent = ' ';
    } else if (btnValue == '='){
        console.log(outputScreen.innerText);
        
        const answer = getAnswer(outputScreen.innerText);
        outputScreen.textContent = answer;
    } else if (operatorButtons.includes(btnValue)) {
        console.log(`You clicked : ${btnValue}`);
        outputScreen.textContent += ` ${btnValue} `;
    } else {
        console.log(`You clicked : ${btnValue}`);
        outputScreen.textContent += btnValue;
    };
    
});

function operate(operator,a,b){
    this.method = {
        '+': (a,b) => a + b,
        '-': (a,b) => a - b,
        '/': (a,b) => a / b,
        '*': (a,b) => a * b,
    }
    return this.method[operator](a,b);
}

function getAnswer(string){
    const context = string.split(' ');
    
    a = parseInt(context[0]);
    operator = context[1];
    b = parseInt(context[2]);

    console.log(`Test: ${operate(operator,a,b)}`);
    return operate(operator,a,b);
}