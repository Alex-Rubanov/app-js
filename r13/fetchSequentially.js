function fetchSequentially(urls) {
    // Odbierane odpowiedzi będą zapisane w tej zmiennej.
    const bodies = [];

    // Funkcja pobierająca treść jednej strony i zwracająca promesę.
    function fetchOne(url) {
        return fetch(url)
            .then(response => response.text())
            .then(body => {
                // Zapisujemy odpowiedź w tablicy i świadomie pomijamy
                // instrukcję return (funkcja zwróci wartość undefined).
                bodies.push(body);
            });
    }

    // Uruchomienie promesy, która zostanie natychmiast spełniona z wartością undefined.
    let p = Promise.resolve(undefined);

    // Przetworzenie w pętli adresów URL i utworzenie łańcucha promes o odpowiedniej długości.
    // Każda promesa w łańcuchu obsługuje jedno zapytanie.
    for(url of urls) {
        p = p.then(() => fetchOne(url));
    }

    // Po spełnieniu ostatniej promesy w łańcuchu tablica odpowiedzi 
    // będzie gotowa. Można więc będzie zwrócić promesę z tą tablicą. Zwróć
    // uwagę, że nie obsługujemy błędów, ponieważ chcemy, aby były
    // eskalowane do kodu wywołującego funkcję.
    return p.then(() => bodies);
}
