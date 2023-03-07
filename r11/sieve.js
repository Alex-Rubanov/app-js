// Funkcja wyszukująca za pomocą sita Eratostenesa największą liczbę pierwszą mniejszą od n.
function sieve(n) {
    let a = new Uint8Array(n+1);         // Element a[x] ma wartość 1, jeżeli x jest liczbą złożoną.
    let max = Math.floor(Math.sqrt(n));  // Liczba większa niż ta nie będzie przetwarzana.
    let p = 2;                           // 2 jest najmniejszą liczbą pierwszą.
    while(p <= max) {                    // Dla liczby pierwszej p mniejszej niż max…
        for(let i = 2*p; i <= n; i += p) // …wielokrotność p jest oznaczana jako liczba złożona.
            a[i] = 1;
        while(a[++p]) /* empty */;       // Kolejny nieoznaczony indeks jest liczbą pierwszą.
    }
    while(a[n]) n--;                     // Odwrócona pętla wyszukująca największą liczbę pierwszą.
    return n;                            // Zwrócenie znalezionej liczby.
}