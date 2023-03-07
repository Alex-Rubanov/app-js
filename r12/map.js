// Funkcja zwracająca obiekt iterujący wyniki i wywołujący
// dla każdej wartości źródłowej funkcję f().
function map(iterable, f) {
    let iterator = iterable[Symbol.iterator]();
    return {     // Ten obiekt jest iterowalnym iteratorem.
        [Symbol.iterator]() { return this; },
        next() {
            let v = iterator.next();
            if (v.done) {
                return v;
            } else {
                return { value: f(v.value) };
            }
        }
    };
}

// Utworzenie mapy liczb całkowitych i ich kwadratów, a następnie przekształcenie jej w tablicę.
[...map(new Range(1,4), x => x*x)]  // => [1, 4, 9, 16]
