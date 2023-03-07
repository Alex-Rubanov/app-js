function setTheme(name) {
  // Utworzenie nowego znacznika <link rel="stylesheet"> ładującego arkusz stylów o zadanej nazwie.
  let link = document.createElement("link");
  link.id = "theme";
  link.rel = "stylesheet";
  link.href = `themes/${name}.css`;

  // Wyszukanie odnośnika z atrybutem id = "theme".
  let currentTheme = document.querySelector("#theme");
  if (currentTheme) {
    // Jeżeli znacznik istnieje, zastępujemy go nowym.
    currentTheme.replaceWith(link);
  } else {
    // W przeciwnym razie wstawiamy odnośnik do arkusza stylów.
    document.head.append(link);
  }
}
