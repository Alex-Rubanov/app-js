// Oparta na promesie funkcja opakowująca funkcję setTimeout(). Można ją stosować ze słowem await.
// Funkcja zwraca promesę, która jest spełniana po upływie zadanej liczby milisekund.
function elapsedTime(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Asynchroniczny generator zwiększający licznik i zwracający go zadaną
// (lub nieograniczoną) liczbę razy w zadanych odstępach czasu.
async function* clock(interval, max=Infinity) {
    for(let count = 1; count <= max; count++) { // Zwykła pętla for.
        await elapsedTime(interval);            // Oczekiwanie przez zadany czas.
        yield count;                            // Zwrócenie licznika.
    }
}

// Funkcja testowa, wykorzystująca generator asynchroniczny i pętlę for/await.
async function test() {                       // Funkcja asynchroniczna, więc można użyć wewnątrz niej pętli for/await.
    for await (let tick of clock(300, 100)) { // Pętla powtarzana 100 razy co 300 ms.
        console.log(tick);
    }
}