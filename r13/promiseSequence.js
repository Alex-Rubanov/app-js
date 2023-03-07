// Argumentami tej funkcji jest tablica i funkcja promiseMaker. Dla każdej wartości
// x tablicy funkcja promiseMaker(x) musi zwracać promesę, którą spełnia wynikowa
// wartość. Główna funkcja zwraca promesę, którą spełnia wynikowa tablica.
//
// Funkcja promiseSequence() nie tworzy od razu wszystkich promes i nie
// uruchamia ich równolegle. Zamiast tego uruchamia promesy pojedynczo.
// Nie wywołuje funkcji promiseMaker() z kolejną wartością dopóki 
// nie zostanie spełniona poprzednia promesa.
function promiseSequence(inputs, promiseMaker) {
    // Utworzenie prywatnej kopii tablicy, którą będzie można modyfikować.
    inputs = [...inputs];

    // Funkcja, która będzie wykorzystywana jako funkcja zwrotna promesy.
    // Jest to rekurencyjna magia, dzięki której wszystko będzie działać.
    function handleNextInput(outputs) {
        if (inputs.length === 0) {
            // Jeżeli nie ma więcej wartości wejściowych, zwracana 
            // jest tablica wyników i spełniana ostatnia promesa wraz 
            // ze wszystkimi wcześniejszymi zdeterminowanymi, ale 
            // jeszcze niespełnionymi promesami.
            return outputs;
        } else {
            // Jeżeli zostały jeszcze wartości do przetworzenia, 
            // zwracany jest obiekt promesy i determinowana 
            // bieżąca promesa za pomocą wartości uzyskanej 
            // z poprzedniej promesy.
            let nextInput = inputs.shift(); // Pobranie następnej wartości wejściowej.
            return promiseMaker(nextInput)  // Wyliczenie następnej wartości wyjściowej.
                // Utworzenie tablicy wynikowej z nową wartością.
                .then(output => outputs.concat(output))
                // "Rekurencyjne" wywołanie funkcji z nową, większą tablicą wynikową.
                .then(handleNextInput);
        }
    }

    // Utworzenie pierwszej promesy, którą spełnia pusta tablica.
    // Jej funkcją zwrotną jest funkcja zdefiniowana wyżej.
    return Promise.resolve([]).then(handleNextInput);
}

// Funkcja zwracająca promesę, którą spełnia treść o zadanym adresie URL.
function fetchBody(url) { return fetch(url).then(r => r.text()); }
// Za pomocą tej funkcji są sekwencyjnie odczytywane adresy URL.
promiseSequence(urls, fetchBody)
    .then(bodies => { /* Przetworzenie tablicy ciągów znaków. */ })
    .catch(console.error);