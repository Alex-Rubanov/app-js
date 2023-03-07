// Zainicjowanie właściwości counter obiektu funkcyjnego.
// Deklaracje funkcji są windowane, więc przypisanie
// może znajdować się przed deklaracją funkcji.
uniqueInteger.counter = 0;

// Funkcja zwracająca po każdym wywołaniu inną liczbę całkowitą.
// Kolejną zwracaną wartość zapisuje w swojej właściwości.
function uniqueInteger() {
    return uniqueInteger.counter++;  // Zwrócenie i powiększenie właściwości counter.
}
uniqueInteger()  // => 0
uniqueInteger()  // => 1
