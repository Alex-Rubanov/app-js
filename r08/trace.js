// Zastąpienie metody m obiektu o inną metodą, która wyświetla komunikat,
// zanim wywoła oryginalną metodę.
function trace(o, m) {
    let original = o[m];         // Zapamiętanie oryginalnej metody w domknięciu.
    o[m] = function(...args) {   // Zdefiniowanie nowej metody.
        console.log(new Date(), "Wywołanie metody:", m);   // Wyświetlenie komunikatu.
        let result = original.apply(this, args);           // Wywołanie oryginalnej metody.
        console.log(new Date(), "Zakończenie metody:", m); // Wyświetlenie komunikatu.
        return result;                                     // Zwrócenie wyniku.
    };
}