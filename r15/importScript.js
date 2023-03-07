// Funkcja ładująca asynchronicznie skrypt z zadanego adresu URL i uruchamiająca go.
// Zwraca promesę determinowaną po załadowaniu dokumentu.
function importScript(url) {
  return new Promise((resolve, reject) => {
    let s = document.createElement("script");     // Utworzenie elementu <script>.
    s.onload = () => { resolve(); };              // Zdeterminowanie promesy po załadowaniu modułu.
    s.onerror = (e) => { reject(e); };            // Odrzucenie promesy w przypadku błędu.
    s.src = url;                                  // Ustawienie adresu URL skryptu.
    document.head.append(s);                      // Dodanie elementu <script> do dokumentu.
  });
}
