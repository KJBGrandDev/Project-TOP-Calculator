const buttons = ['CE','C','X','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','='];
const buttonDiv = document.getElementById('button_div');
const outputScreen = document.getElementById('output');

// 1. STRICT SEPARATION: Math operators are isolated from control keys
const mathOperators = ['/', '*', '+', '-'];

// 2. MEMORY OPTIMIZATION: Math dictionary sits in global scope (built only 1x)
const MATH_METHODS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
};

let hasDecimal = false;
let isNewSet = false;

// Generate Buttons
buttons.forEach((btn) => {
    const btnElement = document.createElement('button');
    btnElement.innerText = btn;
    btnElement.classList.add('calc_button');
    btnElement.setAttribute('data-value', btn);
    buttonDiv.appendChild(btnElement);
});

function handleInput(val) {
    // Standardized to 100% .textContent for DOM speed & safety
    let screen = outputScreen.textContent;

    // --- CLEAR ENTRY (CE) ---
    if (val === 'CE') {
        outputScreen.textContent = '';
        hasDecimal = false;
        return;
    }

    // --- ALL CLEAR (C) ---
    if (val === 'C') {
        outputScreen.textContent = '';
        hasDecimal = false;
        isNewSet = false;
        return;
    }

    // --- BACKSPACE (X) ---
    if (val === 'X') {
        if (isNewSet) return; // Prevent backspacing a finalized equation result

        const updatedText = screen.slice(0, -1);
        outputScreen.textContent = updatedText;

        // Smart Decimal Check: Looks strictly at the current number being typed
        const segments = updatedText.split(' ');
        const activeNumber = segments[segments.length - 1];
        hasDecimal = activeNumber.includes('.');
        return;
    }

    // --- EQUALS (=) ---
    if (val === '=') {
        if (!screen || isNewSet) return;

        const finalAnswer = evaluateExpression(screen);
        outputScreen.textContent = finalAnswer;
        isNewSet = true;
        hasDecimal = String(finalAnswer).includes('.');
        return;
    }

    // --- DECIMAL (.) ---
    if (val === '.') {
        if (hasDecimal) return;

        if (isNewSet || screen === '' || screen.endsWith(' ')) {
            outputScreen.textContent = '0.';
        } else {
            outputScreen.textContent += '.';
        }
        
        isNewSet = false;
        hasDecimal = true;
        return;
    }

    // --- OPERATORS (+, -, *, /) ---
    if (mathOperators.includes(val)) {
        if (screen === '') return; // Blocks starting an equation with raw "*"

        // Operator Spam Fix: If screen ends in an operator, swap it out
        if (screen.endsWith(' ')) {
            outputScreen.textContent = screen.slice(0, -3) + ` ${val} `;
            return;
        }

        // Chain Math Fix: If "5 + 5" sits on screen and they hit "+", solve it first!
        const parts = screen.trim().split(' ');
        if (parts.length === 3) {
            const runningTotal = evaluateExpression(screen);
            outputScreen.textContent = `${runningTotal} ${val} `;
        } else {
            outputScreen.textContent += ` ${val} `;
        }

        isNewSet = false;
        hasDecimal = false; // Reset for the incoming second number
        return;
    }

    // --- NUMBERS (0 - 9) ---
    if (isNewSet) {
        outputScreen.textContent = val;
        isNewSet = false;
        hasDecimal = false;
    } else {
        outputScreen.textContent += val;
    }
}

function evaluateExpression(str) {
    const parts = str.trim().split(' ');
    
    const a = Number(parts[0]);
    const op = parts[1];
    
    // Premature Equal Fix: Clean standard if/else instead of ternary
    let b;
    if (parts[2] !== undefined && parts[2] !== '') {
        b = Number(parts[2]);
    } else {
        b = a;
    }

    if (!op || !MATH_METHODS[op]) return a;

    if (op === '/' && b === 0) {
        return 'Cannot divide by zero';
    }

    const rawResult = MATH_METHODS[op](a, b);
    
    // Eliminates JS floating-point junk (e.g., forces 0.1 + 0.2 to equal 0.3)
    return Math.round(rawResult * 100000000) / 100000000;
}

// Event Listeners
buttonDiv.addEventListener('click', (event) => {
    const btnValue = event.target.getAttribute('data-value');
    if (btnValue) handleInput(btnValue);
});

document.addEventListener('keydown', (event) => {
    let key = event.key;
    
    // Map physical keyboard keys to your array names
    if (key === 'Enter') key = '=';
    if (key === 'Backspace') key = 'X';
    if (key === 'Escape') key = 'C';

    if (buttons.includes(key)) {
        handleInput(key);
    }
});