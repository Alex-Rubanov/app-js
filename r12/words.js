function words(s) {
    var r = /\s+|$/g;                     // Wyrażenie regularne odpowiadające jednej spacji, kilku spacjom lub końcowi wiersza.
    r.lastIndex = s.match(/[^ ]/).index;  // Wyszukanie pierwszego znaku innego niż spacja.
    return {                              // Zwrócenie iterowalnego iteratora.
        [Symbol.iterator]() {             // Ta metoda sprawia, że obiekt jest iterowalny.
            return this;
        },
        next() {                          // Ta metoda sprawia, że obiekt jest iteratorem.
            let start = r.lastIndex;      // Wznowienie operacji od końca ostatniego dopasowania.
            if (start < s.length) {       // Jeżeli to jeszcze nie koniec...
                let match = r.exec(s);    // ...szukamy kolejnej granicy słowa.
                if (match) {              // Jeżeli zostanie znaleziona, zwracamy słowo.
                    return { value: s.substring(start, match.index) };
                }
            }
            return { done: true };        // W przeciwnym razie informujemy, że to już koniec iteracji.
        }
    };
}

[...words(" abc def  ghi! ")] // => ["abc", "def", "ghi!"]