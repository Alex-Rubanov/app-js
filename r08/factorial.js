// Funkcja wyliczająca silnię i zapamiętująca wyniki w swoich właściwościach.
function factorial(n) {
    if (Number.isInteger(n) && n > 0) {           // Dopuszczalne są tylko dodatnie liczby całkowite.
        if (!(n in factorial)) {                  // Jeżeli nie ma zapamiętanych wyników...
            factorial[n] = n * factorial(n-1);    // ...funkcja je wylicza i zapamiętuje.
        }
        return factorial[n];                      // Zwrócenie zapamiętanego wyniku.
    } else {
        return NaN;                               // Zwracana wartość, jeżeli dane wejściowe są błędne.
    }
}
factorial[1] = 1;  // Zainicjowanie pamięci podręcznej wartością początkową.
factorial(6)  // => 720
factorial[5]  // => 120; ta wartość została zapamiętana w powyższym wywołaniu.








