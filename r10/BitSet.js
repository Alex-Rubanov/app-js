const BitSet = (function() { // Stała BitSet zawiera wynik zwracany przez tę funkcję.
    // W tym miejscu znajdują się szczegóły implementacyjne.
    function isValid(set, n) { ... }
    function has(set, byte, bit) { ... }
    const BITS = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
    const MASKS = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);

    // Publicznym interfejsem API tego modułu jest po prostu klasa BitSet, zdefiniowana
    // i zwracana w tym miejscu. Klasa ta może wykorzystywać zdefiniowane wyżej
    // prywatne funkcje i stałe. Będą one jednak ukryte przed kodem odwołującym się
    // do tej klasy,
    return class BitSet extends AbstractWritableSet {
        // Implementacja pominięta.
    };
}());
