function counter(n) {  // Argument n jest lokalną zmienną.
    return {
        // Getter zwraca wartość lokalnej zmiennej licznikowej i powiększa ją.
        get count() { return n++; },
        // Setter uniemożliwia pomniejszenie wartości zmiennej n.
        set count(m) {
            if (m > n) n = m;
            else throw Error("przypisywana wartość musi być większa od bieżącej");
        }
    };
}

let c = counter(1000);
c.count            // => 1000
c.count            // => 1001
c.count = 2000;
c.count            // => 2000
c.count = 2000;    // !Error: przypisywana wartość musi być większa od bieżącej.
