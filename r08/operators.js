// Definicje kilku prostych funkcji.
function add(x,y) { return x + y; }
function subtract(x,y) { return x - y; }
function multiply(x,y) { return x * y; }
function divide(x,y) { return x / y; }

// Funkcja, której argumentem jest jedna z powyższych funkcji,
// wywoływana z dwoma operandami.
function operate(operator, operand1, operand2) {
    return operator(operand1, operand2);
}

// Aby wyliczyć wartość wyrażenia (2+3) + (4*5) można tę funkcję wywołać w następujący sposób:
let i = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));

// Na potrzeby demonstracji ponownie implementowane są proste funkcje,
// tym razem w literale obiektowym:
const operators = {
    add:      (x,y) => x+y,
    subtract: (x,y) => x-y,
    multiply: (x,y) => x*y,
    divide:   (x,y) => x/y,
    pow:      Math.pow  // Można również wykorzystywać predefiniowane funkcje.
};

// Argumentem tej funkcji jest nazwa operatora. Funkcja szuka
// zadanego operatora w obiekcie i wywołuje go z zadanymi operandami.
// Zwróć uwagę na składnię wywołania funkcji operatora.
function operate2(operation, operand1, operand2) {
    if (typeof operators[operation] === "function") {
        return operators[operation](operand1, operand2);
    }
    else throw "nieznany operator";
}

operate2("add", "Witaj, ", operate2("add"," ", "świecie!")) // => "Witaj, świecie!"
operate2("pow", 10, 2)  // => 100
