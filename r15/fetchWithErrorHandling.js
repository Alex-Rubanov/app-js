fetch("/api/users/current")   // Wysłanie zapytania GET za pomocą protokołu HTTP lub HTTPS.
  .then(response => {         // Po nadejściu odpowiedzi sprawdzamy, czy jest odpowiedniego typu
    if (response.ok &&        // i zawiera kod oznaczający pomyślny wynik.
      response.headers.get("Content-Type") === "application/json") {
      return response.json();       // Zwrócenie promesy reprezentującej treść odpowiedzi.
    } else {
      throw new Error(              // Zgłoszenie wyjątku w przypadku błędu.
        `Nieoczekiwany kod stanu ${response.status} lub błędny typ odpowiedzi`
      );
    }
  })
  .then(currentUser => {      // Gdy promesa zwrócona przez metodę response.json() zostanie zdeterminowana,
    displayUserInfo(currentUser);     // można przetworzyć zawartą w niej treść.
  })
  .catch(error => {           // Jeżeli coś pójdzie źle, rejestrujemy błąd.
    // Jeżeli nie będzie połączenia z serwerem, funkcja fetch() nie wyśle zapytania.
    // Jeżeli serwer zwróci kod błędu, zgłaszamy wyjątek.
    console.log("Błąd podczas odbierania odpowiedzi:", error);
  });
