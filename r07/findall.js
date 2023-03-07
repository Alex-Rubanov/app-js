// Wyszukanie wszystkich wystąpień wartości x i zwrócenie
// indeksów elementów, które ją zawierają.
function findall(a, x) {
    let results = [],            // Zwracana tablica z indeksami.
        len = a.length,          // Długość przeszukiwanej tablicy.
        pos = 0;                 // Indeks, od którego zaczyna się przeszukiwanie.
    while(pos < len) {           // Dopóki zostały jeszcze elementy...
        pos = a.indexOf(x, pos); // ...przeszukaj je.
        if (pos === -1) break;   // Zakończ, jeżeli wartość nie została znaleziona.
        results.push(pos);       // W przeciwnym razie zapisz indeks w tablicy...
        pos = pos + 1;           // ... i kontynuuj przeszukiwanie od następnego indeksu.
    }
    return results;              // Zwrócenie tablicy indeksów.
}