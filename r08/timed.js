// Argumentem tej funkcji jest inna funkcja, a zwracanym wynikiem jej opakowana wersja.
function timed(f) {
    return function(...args) {  // Zebranie argumentów w parametr resztowy.
        console.log(`Entering function ${f.name}`);
        let startTime = Date.now();
        try {
            // Przekazanie wszystkich argumentów opakowanej funkcji.
            return f(...args);  // Ponowne rozciągnięcie argumentów.
        }
        finally {
            // Wyświetlenie czasu wykonania kodu przed zwróceniem opakowanej funkcji.
            console.log(`Exiting ${f.name} after ${Date.now()-startTime}ms`);
        }
    };
}

// Wyliczenie sumy liczb od 1 do n metodą brutalnej siły.
function benchmark(n) {
    let sum = 0;
    for(let i = 1; i <= n; i++) sum += i;
    return sum;
}

// Testowe wywołanie funkcji i pomiar czasu jej wykonania.
timed(benchmark)(1000000) // => 500000500000; suma wyliczona na podstawie argumentu.
