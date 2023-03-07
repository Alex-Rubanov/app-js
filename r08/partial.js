// Argumenty tej funkcji są umieszczane po lewej stronie.
function partialLeft(f, ...outerArgs) {
    return function(...innerArgs) { // Zwracana funkcja.
        let args = [...outerArgs, ...innerArgs]; // Utworzenie listy argumentów
        return f.apply(this, args);              // i wywołanie funkcji f z tą listą.
    };
}

// Argumenty tej funkcji są umieszczane po prawej stronie.
function partialRight(f, ...outerArgs) {
    return function(...innerArgs) {  // Zwracana funkcja.
        let args = [...innerArgs, ...outerArgs]; // Utworzenie listy argumentów
        return f.apply(this, args);              // i wywołanie funkcji f z tą listą.
    };
}

// Argumenty tej funkcji stanowią szablon. Niezdefiniowanie wartości
// w liście są wypełniane wartościami pochodzącymi z wewnętrznego zbioru.
function partial(f, ...outerArgs) {
    return function(...innerArgs) {
        let args = [...outerArgs]; // Lokalna kopia szablonu z zewnętrznymi argumentami
        let innerIndex=0;          // i następującymi po nich argumentami wewnętrznymi.
        // Iterowanie argumentów i zastępowanie niezdefiniowanych wartościami pochodzącymi z wewnętrznego zbioru.
        for(let i = 0; i < args.length; i++) {
            if (args[i] === undefined) args[i] = innerArgs[innerIndex++];
        }
        // Dołączenie pozostałych wewnętrznych argumentów.
        args.push(...innerArgs.slice(innerIndex));
        return f.apply(this, args);
    };
}

// Funkcja z trzema argumentami.
const f = function(x,y,z) { return x * (y - z); };
// Zwróć uwagę na różnice pomiędzy tymi trzema częściowymi zastosowaniami.
partialLeft(f, 2)(3,4)         // => -2: powiązanie pierwszego argumentu: 2 * (3 - 4)
partialRight(f, 2)(3,4)        // => 6: powiązanie ostatniego argumentu: 3 * (4 - 2)
partial(f, undefined, 2)(3,4)  // => -6: powiązanie środkowego argumentu: 3 * (2 - 4)

const increment = partialLeft(sum, 1);
const cuberoot = partialRight(Math.pow, 1/3);
cuberoot(increment(26))  // => 3

const not = partialLeft(compose, x => !x);
const even = x => x % 2 === 0;
const odd = not(even);
const isNumber = not(isNaN);
odd(3) && isNumber(2)  // => true

// Funkcje sum() i square() zostały zdefiniowane wcześniej. Poniżej jest zdefiniowanych kilka dodatkowych:
const product = (x,y) => x*y;
const neg = partial(product, -1);
const sqrt = partial(Math.pow, undefined, .5);
const reciprocal = partial(Math.pow, undefined, neg(1));

// Wyliczenie średniej i odchylenia standardowego.
let data = [1,1,3,5,5];   // Dane wejściowe.
let mean = product(reduce(data, sum), reciprocal(data.length));
let stddev = sqrt(product(reduce(map(data,
                                     compose(square,
                                             partial(sum, neg(mean)))),
                                 sum),
                          reciprocal(sum(data.length,neg(1)))));
[mean, stddev]  // => [3, 2]
