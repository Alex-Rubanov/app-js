// Funkcja zwracająca obiekt iterowalny filtrujący zadaną wartość.
// Iteruje tylko te elementy, dla których predykat przyjmuje wartość true.
function filter(iterable, predicate) {
    let iterator = iterable[Symbol.iterator]();
    return { // Ten obiekt jest iterowalnym iteratorem.
        [Symbol.iterator]() { return this; },
        next() {
            for(;;) {
                let v = iterator.next();
                if (v.done || predicate(v.value)) {
                    return v;
                }
            }
        }
    };
}

// Przefiltrowanie zakresu i pozostawienie w nim tylko liczb parzystych.
[...filter(new Range(1,10), x => x % 2 === 0)]  // => [2,4,6,8,10]
