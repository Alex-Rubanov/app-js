/**
 * Ten program, przeznaczony dla platformy Node, odczytuje tekst ze
 * standardowego wejścia, wylicza częstości występowania poszczególnych
 * znaków i wyświetla histogram dla tych, które są wykorzystywane najczęściej.
 * Do uruchomienia niezbędna jest platforma Node w wersji 12 lub nowszej.
*/

// Ta klasa rozszerza klasę Map tak, aby metoda get() zwracała określoną
// wartość, a nie null, gdy mapa nie zawiera klucza.
class DefaultMap extends Map {
  constructor(defaultValue) {
    super();                          // Wywołanie konstruktora klasy nadrzędnej.
    this.defaultValue = defaultValue; // Zapamiętanie domyślnej wartości.
  }
  get(key) {
    if (this.has(key)) {              // Jeżeli mapa zawiera klucz,
      return super.get(key);          // zwracana jest jego wartość z klasy nadrzędnej.
    }
    else {
      return this.defaultValue;       // W przeciwnym razie zwracana jest domyślna wartość.
    }
  }
}

// Ta klasa wylicza i wyświetla histogram częstości znaków.
class Histogram {
  constructor() {
    this.letterCounts = new DefaultMap(0);  // Mapa wiążąca znaki z liczbą wystąpień.
      this.totalLetters = 0;                // Całkowita liczba znaków.
    }
    // Ta funkcja aktualizuje informacje o nowych znakach w histogramie.
    add(text) {
      // Usunięcie białych znaków z tekstu i zamiana go na wielkie litery.
      text = text.replace(/\s/g, "").toUpperCase();
      // Iterowanie kolejnych znaków w tekście.
      for(let character of text) {
        let count = this.letterCounts.get(character); // Pobranie poprzedniej liczby
        this.letterCounts.set(character, count+1);    // i powiększenie jej.
        this.totalLetters++;
      }
    }

    // Przekształcenie histogramu w ciąg zawierający grafikę ASCII.
    toString() {
      // Przekształcenie mapy w tablicę zawierającą tablice [klucz, wartość]. 
      let entries = [...this.letterCounts];

      // Posortowanie tablicy najpierw wg liczby wystąpień, a potem alfabetycznie.
      entries.sort((a,b) => {          // Funkcja definiująca kolejność sortowania.
        if (a[1] === b[1]) {           // Jeżeli liczby są równe,
          return a[0] < b[0] ? -1 : 1; // sortuj alfabetycznie.
        } else {                       // W przeciwnym razie
          return b[1] - a[1];          // sortuj według wartości.
        }
      });

      // Przekształcenie liczb w procenty.
      for(let entry of entries) {
        entry[1] = entry[1] / this.totalLetters*100;
      }

      // Pominięcie wartości mniejszych niż 1%.
      entries = entries.filter(entry => entry[1] >= 1);

      // Przekształcenie każdej wartości w wiersz tekstu.
      let lines = entries.map(
        ([l,n]) => `${l}: ${"#".repeat(Math.round(n))} ${n.toFixed(2)}%`
      );

      // Zwrócenie wierszy połączonych za pomocą znaku końca wiersza.
      return lines.join("\n");
   }
}

// Poniższa asynchroniczna funkcja (zwracająca promesę) tworzy obiekt Histogram,
// asynchronicznie odczytuje porcje tekstu ze standardowego wejścia i dodaje je
// do histogramu. Zwraca histogram, gdy osiągnie koniec strumienia.
async function histogramFromStdin() {
  process.stdin.setEncoding("utf-8"); // Odczytanie znaków Unicode, a nie bajtów.
  let histogram = new Histogram();
  for await (let chunk of process.stdin) {
    histogram.add(chunk);
  }
  return histogram;
}

// Ostatni wiersz stanowi główne ciało programu.
// Tworzy obiekt Histogram na podstawie danych uzyskanych 
// ze standardowego wejścia i wyświetla histogram. 
histogramFromStdin().then(histogram => { console.log(histogram.toString()); });
