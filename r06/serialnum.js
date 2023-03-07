// Ten obiekt generuje serię kolejnych liczb.
const serialnum = {
    // Ta zwykła właściwość zawiera kolejną liczbę.
    // Symbol podkreślenia w nazwie właściwości oznacza, że służy ona tylko do użytku wewnętrznego.
    _n: 0,

    // Zwrócenie bieżącej wartości i powiększenie jej.
    get next() { return this._n++; },

    // Przypisanie właściwości n nowej wartości, pod warunkiem, że jest większa niż bieżąca.
    set next(n) {
        if (n > this._n) this._n = n;
        else throw new Error("przypisywana wartość musi być większa od bieżącej");
    }
};
serialnum.next = 10;    // Ustawienie początkowej wartości.
serialnum.next          // => 10
serialnum.next          // => 11: za każdym razem odczytywana jest inna wartość.
