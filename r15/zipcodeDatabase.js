// Funkcja pomocnicza asynchronicznie uzyskująca obiekt bazy danych
// (którą tworzy i inicjuje jeżeli jest to konieczne) i przekazuje funkcji zwrotnej.
function withDB(callback) {
  let request = indexedDB.open("zipcodes", 1);   // Otwarcie bazy w wersji 1.
  request.onerror = console.error;     // Rejestrowanie błędów.
  request.onsuccess = () => {     // Kod wykonywany w przypadku powodzenia.
    let db = request.result;      // Wynikiem zapytania jest obiekt bazy danych.
    callback(db);                 // Wywołanie funkcji zwrotnej bazy danych.
  };

  // Jeżeli nie istnieje baza danych w wersji 1., wywoływana jest poniższa
  // funkcja zwrotna. Funkcja ta tworzy i inicjuje magazyn i indeksy w nowej
  // bazie lub modyfikuje je w nowej wersji bazy.
  request.onupgradeneeded = () => { initdb(request.result, callback); };
}

// Funkcja withDB() wywoduje poniższą funkcję, jeżeli baza nie została
// jeszcze zainicjowana. Funkcja tworzy bazę, zapisuje w niej dane, po czym
// jej obiekt umieszcza w argumencie funkcji zwrotnej.
//
// W bazie jest tworzony magazyn zawierający obiekty takie jak poniższy:
//
//   {
//     zipcode: "02134",
//     city: "Allston",
//     state: "MA",
//   }
//
// Jako klucz jest wykorzystywana właściwość zipcode. Indeks jest tworzony dla nazw miast.
function initdb(db, callback) {
  // Funkcja tworząca magazyn o określonej nazwie oraz obiekt
  // opcji zawierający ścieżkę klucza określającego nazwę
  // właściwości, która zostanie użyta jako klucz.
  let store = db.createObjectStore("zipcodes",   // Nazwa magazynu.
                                   { keyPath: "zipcode" });

  // Teraz indeksujemy magazyn według nazw miast i kodów
  // pocztowych. Poniższa metoda wymaga, aby ścieżkę klucza
  // umieszczać bezpośrednio w jej argumencie, a nie w obiekcie opcji.
  store.createIndex("cities", "city");

  // Pobieramy dane, które zostaną umieszczone w bazie. Plik zipcodes.json
  // został utworzony na podstawie danych dostępnych pod adresem
  // https://download.geonames.org/export/zip/US.zip zgodnie z warunkami
  // licencji opublikowanymi na stronie www.geonames.org.
  fetch("zipcodes.json")                // Wysłanie zapytania HTTP GET.
    .then(response => response.json())  // Przeanalizowanie treści odpowiedzi zapisanej w formacie JSON.
    .then(zipcodes => {                 // Odczytanie 40 tys. kodów pocztowych.
      // Do umieszczenia kodów w bazie jest potrzebny obiekt transakcji.
      // Aby go utworzyć trzeba wskazać magazyn, który będzie
      // wykorzystywany (jest tylko jeden) i określić, że dane będą nie
      // tylko odczytywane, ale również zapisywane.
      let transaction = db.transaction(["zipcodes"], "readwrite");
      transaction.onerror = console.error;

      // Uzyskanie magazynu na podstawie obiektu transakcji.
      let store = transaction.objectStore("zipcodes");

      // Interfejs IndexedDB API ma tę zaletę, że magazyny obiektów są naprawdę
      // proste w użyciu. Obiekty dodaje się i modyfikuje w następujący sposób:
      for(let record of zipcodes) { store.put(record); }

      // Po pomyślnym zakończeniu transakcji baza jest zainicjowana
      // i gotowa do użytku. Można więc wywołać funkcję zwrotną,
      // umieszczoną w argumencie funkcji withDB().
      transaction.oncomplete = () => { callback(db); };
    });
}

// Za pomocą interfejsu IndexedDB API wyszukujemy miasto na podstawie
// kodu pocztowego i umieszczamy je w argumencie funkcji zwrotnej. Jeżeli
// miasto nie zostanie znalezione, umieszczamy wartość null.
function lookupCity(zip, callback) {
  withDB(db => {
    // Utworzenie obiektu transakcji przeznaczonego tylko do odczytu.
    // Argumentem metody jest tablica magazynów obiektów, które będą użyte.
    let transaction = db.transaction(["zipcodes"]);

    // Uzyskanie magazynu na podstawie transakcji.
    let zipcodes = transaction.objectStore("zipcodes");

    // Wysłanie zapytania o obiekt zawierający zadany kod pocztowy.
    // Powyższe wiersze są synchroniczne, natomiast poniższy jest asynchroniczny.
    let request = zipcodes.get(zip);
    request.onerror = console.error;      // Rejestrowanie błędów.
    request.onsuccess = () => {           // Funkcja wywoływana w przypadku powodzenia.
      let record = request.result;        // Wynik zapytania.
      if (record) {       // Jeżeli obiekt został znaleziony, umieszczamy go w argumencie funkcji zwrotnej.
        callback(`${record.city}, ${record.state}`);
      } else {           // W przeciwnym razie informujemy funkcję zwrotną o niepowodzeniu.
        callback(null);
      }
    };
  });
}

// Funkcja wykorzystująca interfejs IndexedDB API do asynchronicznego
// wyszukiwania wszystkich kodów przypisanych miastu o zadanej nazwie
// (wielkości liter nie mają znaczenia).
function lookupZipcodes(city, callback) {
  withDB(db => {
    // Jak poprzednio tworzymy obiekt transakcji i uzyskujemy magazyn.
    let transaction = db.transaction(["zipcodes"]);
    let store = transaction.objectStore("zipcodes");

    // Tym razem uzyskujemy również indeks miast w magazynie.
    let index = store.index("cities");

    // Zapytanie o wszystkie rekordy indeksu zawierające zadaną nazwę
    // miasta. Wynik jest umieszczany w argumencie funkcji zwrotnej.
    // Jeżeli spodziewana jest większa liczba wyników, można użyć
    // metody openCursor().
    let request = index.getAll(city);
    request.onerror = console.error;
    request.onsuccess = () => { callback(request.result); };
  });
}
