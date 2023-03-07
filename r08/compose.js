// Funkcja zwracająca funkcję wyliczającą wartość wyrażenia f(g(...)).
// Zwracana funkcja h umieszcza wszystkie swoje argumenty w funkcji g,
// następnie wynik zwrócony przez funkcję g umieszcza w argumencie funkcji f
// i na koniec zwraca wynik funkcji f. Funkcje f i g są wywoływane z tą samą
// wartością this, jak w funkcji h.
function compose(f, g) {
    return function(...args) {
        // Wykorzystywana jest metoda call() funkcji f, ponieważ w jej argumencie
        // jest umieszczana pojedyncza wartość, oraz metoda apply() funkcji g,
        // ponieważ w jej argumencie jest umieszczana tablica.
        return f.call(this, g.apply(this, args));
    };
}

const sum = (x,y) => x+y;
const square = x => x*x;
compose(square, sum)(2,3)  // => 25; kwadrat sumy.
