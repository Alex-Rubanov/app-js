// Funkcja przeglądająca rekurencyjnie obiekty potomne dla obiektu e typu Document
// lub Element i umieszczająca każdy element w argumencie zadanej funkcji.
function traverse(e, f) {
  f(e);                               // Wywołanie funkcji f() z obiektem e w argumencie.
  for(let child of e.children) {      // Iterowanie elementów potomnych.
    traverse(child, f);               // Rekurencyjne przeglądanie każdego elementu.
  }
}

function traverse2(e, f) {
  f(e);                               // Wywołanie funkcji f() z obiektem e w argumencie.
  let child = e.firstElementChild;    // Iterowanie listy połączonych elementów.
  while(child !== null) {
    traverse2(child, f);              // Rekurencyjne przeglądanie każdego elementu.
    child = child.nextElementSibling;
  }
}
