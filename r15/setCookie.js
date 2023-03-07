// Funkcja zapisująca parę nazwa/wartość w ciasteczku i kodująca wartość
// za pomocą funkcji encodeURIComponent() w celu zastąpienia średników,
// przecinków i spacji sekwencjami ucieczki. Jeżeli w argumencie
// daysToLive zostanie umieszczona liczba, funkcja ją przypisze atrybutowi
// max-age, a ciasteczko wygaśnie po upływie zadanej liczby dni. Aby
// usunąć ciasteczko, należy w tym argumencie umieścić wartość 0.
function setCookie(name, value, daysToLive=null) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    if (daysToLive !== null) {
        cookie += `; max-age=${daysToLive*60*60*24}`;
    }
    document.cookie = cookie;
}
