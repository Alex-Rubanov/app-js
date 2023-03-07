// Prosty wątek roboczy odbierający komunikaty z wątku nadrzędnego.
// Wykonuje obliczenia opisane w komunikacie, a wynik odsyła z powrotem
// do nadrzędnego wątku.
onmessage = function(message) {
  // Najpierw rozpakowujemy odebrany komunikat:
  // - zmienna tile zawiera obiekt z właściwościami width i height
  // określającymi wymiary prostokąta zawierającego piksele, dla
  // których będzie wyliczana przynależność do zbioru Mandelbrota.
  // - (x0, y0) to współrzędne piksela na płaszczyźnie zespolonej, odpowiadającego
  // lewemu górnemu wierzchołkowi prostokąta zapisanego w obiekcie tile.
  // - perPixel określa wielkość piksela w jednostkach rzeczywistych i urojonych.
  // - maxIterations określa maksymalną liczbę iteracji, które mogą być
  // wykonane, zanim zostanie określona przynależność piksela do zbioru.
  const {tile, x0, y0, perPixel, maxIterations} = message.data;
  const {width, height} = tile;

  // Następnie tworzymy obiekt ImageData reprezentujący prostokątną
  // tablicę pikseli, uzyskujemy wewnętrzny obiekt ArrayBuffer i tworzymy
  // typowaną tablicę reprezentującą ten bufor. Dzięki temu każdy piksel
  // możemy traktować jako jedną liczbę całkowitą, a nie cztery osobne
  // bajty. W tej tablicy będą zapisywane liczby iteracji wykonanych dla
  // każdego piksela, które w wątku nadrzędnym zostaną zamienione na kolory.
  const imageData = new ImageData(width, height);
  const iterations = new Uint32Array(imageData.data.buffer);

  // Tutaj zaczynają się obliczenia. Wykorzystane są trzy zagnieżdżone pętle.
  // Dwie pierwsze odliczają wiersze i kolumny tablicy pikseli, a trzecia iteruje
  // każdy piksel w celu sprawdzenia, czy "uciekł". Wykorzystane w pętlach
  // zmienne mają następujące znaczenia:
  // - row i column zawierają liczby całkowite reprezentujące współrzędne piksela.
  // - x i y reprezentują liczbę zespoloną x + yi skojarzoną z pikselem.
  // - index zawiera indeks iteracji dla bieżącego piksela.
  // - n zawiera liczbę iteracji wykonanych dla bieżącego piksela.
  // - max i min zawierają, odpowiednio, najmniejszą i największą liczbę
  // iteracji wykonanych dla wszystkich pikseli tworzących prostokąt.
  let index = 0, max = 0, min=maxIterations;
  for(let row = 0, y = y0; row < height; row++, y += perPixel) {
    for(let column = 0, x = x0; column < width; column++, x += perPixel) {
      // Dla każdego piksela tworzymy liczbę zespoloną c = x + yi.
      // Następnie za pomocą poniższej rekurencyjnej formuły wyliczamy
      // liczbę zespoloną z(n + 1)
      //    z(0) = c
      //    z(n+1) = z(n)^2 + c
      // Jeżeli |z(n)| (rząd liczby z(n)) jest większy od 2 to oznacza, że piksel
      // nie należy do zbioru i kończymy wyliczenia po wykonaniu n iteracji.
      let n;                   // Liczba wykonanych dotychczas iteracji.
      let r = x, i = y;        // Zaczynamy od liczby zespolonej z(0).
      for(n = 0; n < maxIterations; n++) {
        let rr = r*r, ii = i*i;         // Kwadraty obu części liczby z(n).
        if (rr + ii > 4) {              // Jeżeli |z(n)|^2 > 4 to oznacza, że piksel ucieka,
          break;                        // więc kończymy iteracje.
        }
        i = 2*r*i + y;                  // Wyliczenie urojonej
        r = rr - ii + x;                // i rzeczywistej części liczby z(n + 1).
      }
      iterations[index++] = n;          // Zapamiętanie liczby iteracji wykonanych dla każdego piksela.
      if (n > max) max = n;             // Zapamiętanie największej
      if (n < min) min = n;             // i najmniejszej liczby iteracji.
    }
  }

  // Po wykonaniu obliczeń wyniki wysyłamy z powrotem do nadrzędnego
  // wątku. Obiekt imageData jest kopiowany, ale zawarty w nim ogromny
  // obiekt ArrayBuffer został przesłany, co bardzo poprawia wydajność.
  postMessage({tile, imageData, min, max}, [imageData.data.buffer]);
};
