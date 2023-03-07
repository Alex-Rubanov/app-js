// Funkcja wyświetlająca nazwy i wartości wszystkich wartości obiektu o. Zwraca wartość undefined.
function printprops(o) {
    for(let p in o) {
        console.log(`${p}: ${o[p]}\n`);
    }
}

// Funkcja wyliczająca odległość pomiędzy dwoma punktami (x1,y1) i (x2,y2) w kartezjańskim układzie współrzędnych.
function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

// Funkcja rekurencyjna (wywołująca samą siebie), wyliczająca silnię.
// Silnia x! to iloczyn wszystkich liczb naturalnych mniejszych lub równych x.
function factorial(x) {
    if (x <= 1) return 1;
    return x * factorial(x-1);
}
