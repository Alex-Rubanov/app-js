// Ta funkcja wyższego rzędu zwraca nową funkcję, która umieszcza argumenty
// w funkcji f i zwraca logiczną negację zwracanego przez nią wyniku.
function not(f) {
    return function(...args) {             // Zwrócenie nowej funkcji,
        let result = f.apply(this, args);  // która wywołuje funkcję f
        return !result;                    // i neguje wynik.
    };
}

const even = x => x % 2 === 0; // Funkcja sprawdzająca, czy zadana liczba jest parzysta.
const odd = not(even);         // Nowa funkcja wykonująca odwrotną operację.
[1,1,3,5,5].every(odd)         // => true: wszystkie elementy tablicy są liczbami nieparzystymi.