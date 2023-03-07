// W ten sposób można zdefiniować moduł stats
const stats = (function() {
    // Prywatne funkcje pomocnicze modułu.
    const sum = (x, y) => x + y;
    const square = x => x * x;

    // Publiczna funkcja, która zostanie wyeksportowana.
    function mean(data) {
        return data.reduce(sum)/data.length;
    }

    // Inna publiczna funkcja, która zostanie wyeksportowana.
    function stddev(data) {
        let m = mean(data);
        return Math.sqrt(
            data.map(x => x - m).map(square).reduce(sum)/(data.length-1)
        );
    }

    // Eksport publicznych funkcji jako właściwości obiektu.
    return { mean, stddev };
}());

// Przykłady użycia modułu.
stats.mean([1, 3, 5, 7, 9])   // => 5
stats.stddev([1, 3, 5, 7, 9]) // => Math.sqrt(10)
