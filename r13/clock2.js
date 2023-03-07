function clock(interval, max=Infinity) {
    // Oparta na promesie odmiana funkcji setTimeout(). Można ją stosować ze słowem await.
    // Zwróć uwagę, że argumentem jest bezwzględny czas, a nie interwał.
    function until(time) {
        return new Promise(resolve => setTimeout(resolve, time - Date.now()));
    }

    // Zwrócenie asynchroniczne iterowalnego obiektu.
    return {
        startTime: Date.now(),  // Zapamiętanie czasu uruchomienia.
        count: 1,               // Zapamiętanie numeru iteracji.
        async next() {          // Metoda next() tworzy iterator.
            if (this.count > max) {     // Czy to koniec?
                return { done: true };  // Wynik oznaczający zakończenie iteracji.
            }
            // Określenie momentu rozpoczęcia następnej iteracji.
            let targetTime = this.startTime + this.count * interval;
            // Oczekiwanie, aż ten moment nastąpi.
            await until(targetTime);
            // Zwrócenie w wynikowym obiekcie iteracji wartości zmiennej count.
            return { value: this.count++ };
        },
        // Poniższa metoda sprawia, że obiekt iteratora jest iterowalny.
        [Symbol.asyncIterator]() { return this; }
    };
}



