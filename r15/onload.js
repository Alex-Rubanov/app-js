// Przypisanie funkcji właściwości onload obiektu Window.
// Funkcja ta jest procedurą obsługi zdarzenia, wywoływaną po załadowaniu dokumentu.
window.onload = function() {
  // Wyszukanie elementu <form>.
  let form = document.querySelector("form#shipping");
  // Zarejestrowanie procedury obsługi zdarzenia, która będzie wywoływana
  // przed wysłaniem formularza. Przyjęte jest założenie, że w innym miejscu
  // kodu jest zdefiniowana funkcja isFormValid().
  form.onsubmit = function(event) {   // Gdy użytkownik postanowi wysłać formularz,
    if (!isFormValid(this)) {         // funkcja sprawdza, czy pola są poprawnie wypełnione.
      event.preventDefault();         // Jeżeli nie, funkcja blokuje wysłanie formularza.
    }
  };
};
