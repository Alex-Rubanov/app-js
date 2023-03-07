// Funkcja zwracająca funkcję, której argumentem jest tablica. Nowa funkcja
// przetwarza każdy element za pomocą funkcji f i zwraca tablicę uzyskanych
// w ten sposób wartości. Porównaj ją z opisaną wcześniej funkcją map().
function mapper(f) {
    return a => map(a, f);
}

const increment = x => x+1;
const incrementAll = mapper(increment);
incrementAll([1,2,3])  // => [2,3,4]
