const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
let currentInput = '';
let operation = null;
let justCalculated = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;

        if (buttonText === 'AC') {
            currentInput = '';
            operation = null;
            display.value = currentInput;
        } else if (buttonText === '=') {
            if (operation && currentInput) {
                display.value = calculate();
                currentInput = display.value;
                operation = null;
                justCalculated = true;
            }
        } else if ('+-*/'.includes(buttonText)) {
            if (!operation && (currentInput || justCalculated)) {
                operation = buttonText;
                if (justCalculated) {
                    justCalculated = false;
                } else {
                    currentInput = '';
                }
                display.value += buttonText;
            }
        } else {
            if (justCalculated) {
                currentInput = '';
                display.value = '';
                justCalculated = false;
            }
            currentInput += buttonText;
            display.value += buttonText;
        }
    });
});

function calculate() {
    const [num1, num2] = display.value.split(operation);
    const a = parseInt(num1);
    const b = parseInt(num2);

    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
}
