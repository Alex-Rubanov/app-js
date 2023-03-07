// Funkcja zwracająca zmemoizowaną wersję funkcji f.
// Argumenty funkcji f muszą być ciągami znaków.
function memoize(f) {
    const cache = new Map();  // Pamięć podręczna umieszczona w domknięciu.

    return function(...args) {
        // Utworzenie tekstowych wartości argumentów, aby mogły być kluczami w pamięci podręcznej.
        let key = args.length + args.join("+");
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            let result = f.apply(this, args);
            cache.set(key, result);
            return result;
        }
    };
}

// Funkcja wyliczająca największy wspólny dzielnik dwóch liczb całkowitych
// przy użyciu algorytmu Euklidesa (http://en.wikipedia.org/wiki/Euclidean_algorithm).
function gcd(a,b) {        // Typy argumentów a i b nie są sprawdzane.
    if (a < b) {           // Sprawdzenie, czy a >= b.
        [a, b] = [b, a];   // Destrukturyzacja przypisania w celu zamienienia wartości miejscami.
    }
    while(b !== 0) {       // Algorytm Euklidesa, wykorzystywany do wyliczenia największego wspólnego dzielnika.
        [a, b] = [b, a%b];
    }
    return a;
}

const gcdmemo = memoize(gcd);
gcdmemo(85, 187)  // => 17

// Zwróć uwagę, że zazwyczaj wymagane jest rekurencyjne wywoływanie
// funkcji memoizującej, a nie oryginalnej.
const factorial = memoize(function(n) {
    return (n <= 1) ? 1 : n * factorial(n-1);
});
factorial(5)      // => 120: zapamiętane są również wyniki dla liczb 4, 3, 2 i 1.
