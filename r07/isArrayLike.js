// Sprawdzenie, czy obiekt o jest podobny do tablicy.
// Ciągi znaków i funkcje mają właściwości length, jednak są wykluczone
// z testu typeof. W kodzie klienckim tekstowe węzły DOM mają właściwości
// length i można je również wykluczyć z testu poprzez użycie dodatkowego
// warunku o.nodeType !== 3.
function isArrayLike(o) {
    if (o &&                            // Jeżeli obiekt o nie jest wartością null, undefined itp.,
        typeof o === "object" &&        // zmienna o jest obiektem,
        Number.isFinite(o.length) &&    // właściwość o.length jest zwykłą liczbą,
        o.length >= 0 &&                // jest liczbą nieujemną,
        Number.isInteger(o.length) &&   // jest liczbą całkowitą,
        o.length < 4294967295) {        // jest mniejsza niż 2^32 – 1,
        return true;                    // to obiekt o jest podobny do tablicy.
    } else {
        return false;                   // W przeciwnym razie nie jest podobny.
    }
}
