// Funkcja zwracająca ciasteczka w postaci obiektu Map.
// Przyjęte jest założenie, że wartości są zakodowane za pomocą funkcji encodeURIComponent().
function getCookies() {
  let cookies = new Map();      // Obiekt, który zostanie zwrócony.
  let all = document.cookie;    // Odczytanie wszystkich ciasteczek jako jednego długiego ciągu.
  let list = all.split("; ");   // Podzielenie ciągu na osobne pary nazwa/wartość.
  for(let cookie of list) {     // Pętla przetwarzająca ciasteczka.
    if (!cookie.includes("=")) continue;     // Odrzucamy ciasteczko, jeżeli nie zawiera znaku równości.
    let p = cookie.indexOf("=");             // Szukamy pierwszego znaku równości.
    let name = cookie.substring(0, p);       // Uzyskanie nazwy ciasteczka.
    let value = cookie.substring(p+1);       // Uzyskanie wartości ciasteczka.
    value = decodeURIComponent(value);       // Zdekodowanie wartości.
    cookies.set(name, value);                // Zapamiętanie nazwy i wartości.
  }
  return cookies;
}
