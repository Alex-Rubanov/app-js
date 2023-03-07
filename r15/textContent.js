// Funkcja zwracająca zawartość elementu e w postaci zwykłego tekstu.
// W tym celu rekurencyjnie przegląda wszystkie elementy potomne.
// Wynik jest podobny do zawartości właściwości textContent.
function textContent(e) {
  let s = "";                          // Zmienna zawierająca skumulowany tekst.
  for(let child = e.firstChild; child !== null; child = child.nextSibling) {
    let type = child.nodeType;
    if (type === 3) {                  // Jeżeli węzeł jest typu Text,
      s += child.nodeValue;            // dopisujemy do zmiennej zawarty w nim tekst.
    } else if (type === 1) {           // Jeżeli jest to element,
      s += textContent(child);         // przeglądamy rekurencyjnie jego elementy potomne.
    }
  }
  return s;
}
